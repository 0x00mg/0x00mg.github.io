---
layout: post
title:	"DNS Enumeration"
date:	2025-09-10 10:00:00 +0200 
author: "0x00mg"
categories:
    - blog
tags:
    - Active Information Gathering
    - dns
    - dnsrecon
    - dnsenum
   
image: /images/posts/2025/dns/dns.jpg
---


### Úvod do DNS

Domain Name System (DNS) je distribuovaná databáza ktorá zabezpečuje preklad čitateľných doménových mien (napr. www.tvojastranka.com) na IP adresy ktoré používa sieťová infraštruktúra. 
Ide o jeden zo základných pilierov internetu. Bez DNS by sme museli pamätať celé bloky čísel - ip adries a nie názvy stránok.

DNS má hierarchickú štruktúru ktorá sa začína na root zóne. Pokračuje cez top-level domény (.com, .org, .sk, …) až po konkrétne domény druhej úrovne. 
Každá doména môže obsahovať rôzne typy záznamov ktoré odhaľujú ako je infraštruktúra nastavená.

**Najčastejšie DNS záznamy**  

| Typ záznamu | Popis |
|-------------|-------|
| **NS (Name Server)** | Určuje autoritatívne DNS servery pre danú doménu. |
| **A** | IPv4 adresa hostiteľa (napr. www.megacorpone.com → 149.56.244.87). |
| **AAAA** | IPv6 adresa hostiteľa. |
| **MX (Mail Exchange)** | Servery, ktoré spracúvajú e-mail pre doménu. |
| **PTR (Pointer)** | Používa sa pri reverznom DNS lookup-e (IP → doménové meno). |
| **CNAME (Canonical Name)** &nbsp;&nbsp;| Alias pre iný záznam (napr. mail → mailserver.example.com). |
| **TXT** | Textové záznamy, často pre overenie domény (napr. Google, SPF, DKIM). |   
&nbsp;

Práve tieto záznamy predstavujú bohatý zdroj informácií pre útočníkov aj administrátorov. Správna správa DNS je preto kľúčová nielen pre funkčnosť služieb ale aj pre bezpečnosť celej organizácie.
DNS funguje na modeli klient-server, pričom resolver odosiela požiadavky na DNS servery ktoré potom odpovedajú požadovanými informáciami.

#### DNS enumerácia v praxi

<sub>_Zrieknutie sa zodpovednosti: Autor neberie žiadnu zodpovednosť za prípadné zneužitie uvedených príkazov či nástrojov. Všetky príklady sú určené výhradne na vzdelávacie účely a testovanie v legálnych, kontrolovaných prostrediach._</sub>

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

#### Automatizovaná DNS enumerácia

Doteraz sme skúšali základné dotazy manuálne no v reálnej praxi si väčšinu týchto krokov vieme zautomatizovať pomocou nástrojov. 
V Linuxe máme k dispozícii viacero utilít ktoré umožňujú rýchle a systematické získavanie DNS informácií. Medzi najčastejšie používané patria DNSRecon a DNSEnum.

##### DNSRecon
DNSRecon je pokročilý Python skript ktorý dokáže kombinovať viacero techník od bežného zisťovania záznamov cez brute force subdomén až po reverse lookup celé rozsahy IP adries.
Skúsme spustiť základný scan na doméne megacorpone.com:  
`dnsrecon -d megacorpone.com -t std`  
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns8.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">   
`-d` - špecifikujeme cieľovú doménu  
`-t std` - typ enumerácie v tomto prípade standard (základné záznamy ako A, MX, NS, SOA, TXT)  
Výstup nám zobrazí zoznam autoritatívnych name serverov, poštové servery a prípadné TXT záznamy. V praxi vieme hneď získať informácie o infraštruktúre a často aj náznaky o technológiách alebo službách.

Okrem štandardného zberu údajov vie DNSRecon aj brute force subdomén. Ak máme pripravený wordlist (list.txt) použijeme:
`dnsrecon -d megacorpone.com -D list.txt -t brt`  
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns9.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">    
`-D list.txt` - wordlist so zoznamom subdomén  
`-t brt` - brute force režim  
Nástroj takto automaticky prejde celý zoznam a vráti len tie subdomény ktoré existujú a sú priradené k IP adrese. Vďaka tomu môžeme rýchlo odhaliť servery ako vpn.megacorpone.com, router.megacorpone.com či testovacie prostredia.

##### DNSEnum  
Ďalší veľmi obľúbený nástroj je dnsenum ktorý kombinuje viacero techník do jedného príkazu. Stačí mu zadať cieľovú doménu a nástroj automaticky spustí brute force so zabudovaným zoznamom.
`dnsenum megacorpone.com`  
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns11.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">    
DNSEnum často odhalí väčší počet hostov než náš manuálny brute force pretože pracuje s rozsiahlejšími wordlistami a získa informácie o IP rozsahoch ktoré daná doména používa.
V typickom výstupe tak môžeme vidieť subdomény ako admin.megacorpone.com, intranet.megacorpone.com, vpn.megacorpone.com a podobne.
Navyše nástroj sa pokúsi zistiť celé C-class siete ktoré sú pridelené organizácii. To nám poskytuje ďalší priestor pre rozšírenie enumerácie kde môžeme neskôr preskenovať celý rozsah týchto IP adries nástrojmi ako `nmap.`  

Odporúčam bližšie sa zoznámiť s nástrojmi DNSRecon a DNSEnum keďže výrazne uľahčujú a automatizujú proces DNS enumerácie.

##### NSLookup (Windows)
Na Windows systémoch máme vstavaný príkaz nslookup ktorý je ideálny na rýchle testy bez potreby inštalovať externé nástroje.
`nslookup mail.megacorpone.com`   
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns10.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">    
`nslookup -type=TXT info.megacorpone.com`  
<img src="{{ site.baseurl }}/images/posts/2025/dns/dns12.jpg" alt="dns" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">      
`-type=TXT` - zisťujeme špecificky textové záznamy
výstup často obsahuje overenia (SPF, DKIM, Google site verification) alebo iné metadáta
nslookup je menej výkonný než nástroje v linuxe ale má výhodu že je predinštalovaný na každom Windows systéme. Dá sa ľahko kombinovať aj s PowerShell alebo batch skriptami pre automatizáciu

##### DNS enumerácia pomocou Nmap NSE skriptov
Okrem samostatných nástrojov ako DNSRecon a DNSEnum môžeme DNS enumeráciu vykonávať aj priamo cez Nmap. 
Nmap obsahuje množstvo NSE skriptov (Nmap Scripting Engine), ktoré nám umožňujú cielene spúšťať rozšírené skeny vrátane DNS.

Základný DNS brute force  
`nmap --script dns-brute megacorpone.com`
Ak chceme väčší wordlist (napr. z projektu SecLists) môžeme pridať parameter:  
`nmap --script dns-brute --script-args dns-brute.domain=megacorpone.com,dns-brute.hostlist=/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt`  
`dns-brute.domain` - cieľová doména  
`dns-brute.hostlist` - vlastný zoznam subdomén  
Takto dosiahneme výsledky porovnateľné s DNSRecon či DNSEnum, ale priamo v rámci Nmapu.  

Ďalší užitočný skript je dns-zone-transfer ktorý sa pokúša o AXFR prenos celej DNS zóny:  
`nmap --script dns-zone-transfer -p 53 ns1.megacorpone.com`  
`-p 53` - špecifikujeme DNS port  
`dns-zone-transfer` - pokus o získanie celej zóny z name servera   
V praxi je zóna len málokedy nesprávne nakonfigurovaná no ak sa nám podarí úspešne vykonať transfer získame kompletný zoznam všetkých subdomén.

Rovnako zaujímavý je aj dns-reverse skript ktorý sa snaží zisťovať názvy hostiteľov pre IP adresy v rozsahu:  
`nmap -sL --script dns-reverse 167.114.21.60-80`  
`-sL` - list scan (Nmap neodosiela pakety iba spracováva mená)  
`dns-reverse` - reverzný lookup v danom rozsahu  
Tento príkaz je praktický ak už máme podozrenie že infraštruktúra beží v určitom rozsahu IP adries (napr. podľa výstupu DNSEnum).

#### Záver

DNS enumerácia predstavuje jeden z najdôležitejších krokov pri aktívnom získavaní informácií. Aj keď na prvý pohľad pôsobí nenápadne ale správne vykonaný prieskum dokáže odhaliť podstatné časti infraštruktúry
od autoritatívnych name serverov cez mailové brány až po testovacie či VPN subdomény.  
Získané informácie tvoria základ pre ďalšie kroky najmä mapovanie siete, identifikáciu služieb a následnú web enumeráciu ktorej sa budeme venovať v samostatnom článku.  
Správne zvládnutá DNS enumerácia je preto neoceniteľnou výhodou nielen pre penetračných testerov ale aj pre administrátorov ktorí chcú lepšie porozumieť vlastnej infraštruktúre a odhaliť slabé miesta skôr než útočníci.

**Zdroje:**
- OSCP
- HTB
- Parrot
- InfoSec

















