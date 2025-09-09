


### Úvod do DNS

Domain Name System (DNS) je distribuovaná databáza ktorá zabezpečuje preklad čitateľných doménových mien (napr. www.tvojastranka.com) na IP adresy ktoré používa sieťová infraštruktúra. 
Ide o jeden zo základných pilierov internetu. Bez DNS by sme museli pamätať celé bloky čísel - ip adries a nie názvy stránok.

DNS má hierarchickú štruktúru ktorá sa začína na root zóne. Pokračuje cez top-level domény (.com, .org, .sk, …) až po konkrétne domény druhej úrovne. 
Každá doména môže obsahovať rôzne typy záznamov ktoré odhaľujú ako je infraštruktúra nastavená.

**Najčastejšie DNS záznamy**  
**NS (Name Server)** – určuje autoritatívne DNS servery pre danú doménu.  
**A** – IPv4 adresa hostiteľa (napr. www.megacorpone.com → 149.56.244.87).  
**AAAA** – IPv6 adresa hostiteľa.  
**MX (Mail Exchange)** – servery, ktoré spracúvajú e-mail pre doménu.  
**PTR (Pointer)** – používa sa pri reverznom DNS lookup-e (IP → doménové meno).  
**CNAME (Canonical Name)** – alias pre iný záznam (napr. mail → mailserver.example.com).  
**TXT** – textové záznamy, často pre overenie domény (napr. Google, SPF, DKIM).  

Práve tieto záznamy predstavujú bohatý zdroj informácií pre útočníkov aj administrátorov. Správna správa DNS je preto kľúčová nielen pre funkčnosť služieb ale aj pre bezpečnosť celej organizácie.
DNS funguje na modeli klient-server, pričom resolver odosiela požiadavky na DNS servery ktoré potom odpovedajú požadovanými informáciami.

#### DNS enumerácia v praxi

V tomto článku si ukážeme ako sa vykonáva DNS enumerácia, teda zhromažďovanie informácií z DNS záznamov. 
Ako cieľovú doménu použijeme megacorpone.com ide o fiktívnu spoločnosť ktorá bola vytvorená pre tréning a testovacie účely v oblasti kybernetickej bezpečnosti.
Vďaka tomu si môžeme bezpečne precvičiť techniky bez rizika že zasiahneme reálne produkčné služby.

##### Základné DNS dotazy
Na začiatok nám postačí jednoduchý príkaz `host`, ktorý je bežne dostupný v Linuxových distribúciách. Tento nástroj umožňuje rýchlo zisťovať rôzne druhy DNS záznamov.  
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns1.jpg" alt="dns host" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">  
Tu sme zistili že webový server www.megacorpone.com beží na IP adrese 149.56.244.87.

Predvolený príkaz `host` vyhľadáva záznam **A**. Pomocou voľby `-t` môžme vyhľadať záznamy **MX, TXT**.  
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns2.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">  
Vidíme že e-maily pre megacorpone.com spracováva viacero mail serverov. Priorita serverov je určená číslom. Najnižšia hodnota (10) má najvyššiu prioritu.  
Potom sme skúsili `txt`. Tieto záznamy obsahujú voľne definovateľný text, môže ísť o overenie vlastníctva domény (napr. Google) alebo metadáta. 

Ak doména alebo hostname neexistuje DNS server vráti odpoveď NXDOMAIN (non-existent domain).
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns3.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">

Môžme vyskúšať reverzný DNS lookup ktorý zisťuje doménové meno na základe IP adresy.
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns4.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">

##### Brute force enumerácia subdomén
Zatiaľ sme zisťovali iba hlavné DNS záznamy manuálne. V praxi však veľká časť infraštruktúry beží na subdoménach napríklad vpn.megacorpone.com, mail.megacorpone.com, dev.megacorpone.com a podobne.
Tieto názvy nie sú vždy verejne publikované ale často sa dajú odhaliť pomocou tzv. brute force enumerácie.

**Jednoduchý brute force s Bash skriptom**
Stačí nám wordlist (zoznam bežných názvov subdomén) a príkazový riadok.  
Ukážme si minimalistický príklad v Bashe:  
```bash
for sub in www mail vpn dev intranet test support beta; do
    host $sub.megacorpone.com | grep "has address"
done
```
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns5.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">  

poprípade vytvoríme/stiahneme hotový zoznam:
```bash
for ip in $(cat list.txt); do host $ip.megacorpone.com; done
```
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns6.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">   

Oveľa komplexnejšie zoznamy slov sú k dispozícii ako súčasť projektu SecLists. Tieto zoznamy slov môžu byť nainštalované do adresára /usr/share/seclists pomocou príkazu `sudo apt install seclists` 
Vidíme že niekoľko subdomén je aktívnych a ukazuje na konkrétne IP adresy. To nám rozširuje pohľad na infraštruktúru.  
Brute force enumerácia odhalila súbor IP adries v približne rovnakom rozsahu (167.114.21.X).  
Ak by správca DNS pre doménu megacorpone.com nastavil aj PTR záznamy, mohli by sme využiť reverse DNS lookup na odhalenie hostiteľov patriacich k jednotlivým IP adresám. V praxi by sme si vedeli prejsť celý rozsah IP adries – napríklad od 167.114.21.60 po 167.114.21.80 a pre každú z nich sa pokúsili zistiť či existuje priradený názov hostiteľa. Aby sme odstránili nepotrebný šum použijeme filter `grep -v` ktorý skryje všetky odpovede obsahujúce hlášku `not found`.  
`for ip in $(seq 60 80); do host 167.114.21.$ip; done | grep -v "not found" `  
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns7.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">  









