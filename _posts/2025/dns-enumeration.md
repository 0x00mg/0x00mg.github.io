


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

