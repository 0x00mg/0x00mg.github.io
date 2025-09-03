---
layout: post
title:	"HTB: Mirai Botnet"
date:	2025-09-02 10:00:00 +0200 
author: "0x00mg"
categories:
    - blog
tags:
    - malware
    - botnet
    - raspberry
   
image: /images/posts/2025/mirai/mirai1.jpg
---

## Mirai Malware

Mirai je malware typu botnet, ktorý sa prvýkrát objavil v roku 2016.
Vytvorila ho skupina mladých programátorov v USA (Paras Jha, Josiah White a Dalton Norman).
Bol určený na infikovanie IoT zariadení (kamery, routery, DVR rekordéry a pod.) ktoré mali predvolené alebo slabé prihlasovacie údaje. 
Po infikovaní zariadenie vstúpilo do botnetu ktorý útočníci využívali na DDoS útoky.
Mirai automaticky skenoval internet a hľadal zariadenia prístupné cez Telnet alebo SSH. Potom skúšal zoznam známych predvolených používateľských mien a hesiel.
Najznámejšie použitie Mirai botnetu bol masívny útok na DNS poskytovateľa Dyn v októbri 2016, ktorý spôsobil výpadky veľkých služieb ako Twitter, Netflix, Reddit či Spotify.
[Mirai(Malware)](https://en.wikipedia.org/wiki/Mirai_(malware))

Toto [HTB Mirai](https://www.hackthebox.com/)laboratórium demonštruje aké rizikové je ponechať zariadenie s predvolenými prihlasovacími údajmi bez zmeny.

### <ins>Prieskum</ins>

Po prihlásení do laboratória a priradení cieľovej IP adresy je prvým krokom vždy získať prehľad o tom, aké služby stroj ponúka. 
Na to je najjednoduchšie použiť nástroj `nmap` ktorý nám umožní zistiť otvorené porty, spustené služby a aj ich verzie. 
Vďaka tomu vieme určiť ďalší smer prieskumu a hľadať potenciálne zraniteľnosti. Preto začnem skenom cieľa.

Na rýchle odhalenie všetkých portov použijem príkaz:

![Základný scan](/images/posts/2025/mirai/mirai2.jpg)

`-p-`  skenujem všetkých 65 535 portov.  
`--min-rate 10000`  nastavuje minimálnu rýchlosť odosielania paketov (10 000 za sekundu), aby bol sken výrazne rýchlejší. 

Po ukončení skenu si otvorené porty oskenujem hlbšie:

![Hlboký scan](/images/posts/2025/mirai/mirai3.jpg)

`-sC` spustí default NSE skripty (Nmap Scripting Engine).  
&nbsp;&nbsp;&nbsp;&nbsp;Tieto skripty skúšajú získať extra info o službách (verzia SSH, SSL certifikát, HTTP titulok, FTP info atď.).  
`-sV` spustí detekciu verzií služieb na otvorených portoch.  
&nbsp;&nbsp;&nbsp;&nbsp;Nmap sa pokúsi zistiť presný softvér a verziu.

Poprípade môžme použiť hlbši sken hneď pomocou `nmap -A -Pn -T4 -p- $IP`  
`-A` spustí default NSE skripty (Nmap Scripting Engine).  A zapne viacero pokročilých možností:  
&nbsp;&nbsp;&nbsp;&nbsp;* OS detection (skúsi uhádnuť operačný systém)  
&nbsp;&nbsp;&nbsp;&nbsp;* version detection (zistí verzie služieb)  
&nbsp;&nbsp;&nbsp;&nbsp;* script scanning (default NSE skripty)  
&nbsp;&nbsp;&nbsp;&nbsp;* traceroute  
`-Pn` ignoruje ping (host discovery).   
&nbsp;&nbsp;Nmap sa bude tváriť, že host je živý a rovno skúsi porty (užitočné ak ICMP/ping je blokovaný firewallom).  
`-T4` časovanie/agresivita.  
&nbsp;&nbsp;&nbsp;&nbsp;T0 = stealth, super pomalé,   
&nbsp;&nbsp;&nbsp;&nbsp;T4 = rýchle skenovanie vhodné pre lokálne siete alebo keď vieš, že nechceš čakať,  
&nbsp;&nbsp;&nbsp;&nbsp;T5 = extrémne rýchle, ale môže spôsobiť chybovosť.  
`-p-` skenuje všetky porty (1–65535), nie len default 1000.  

#### 80/TCP
Predtým ako sa pokúsime o zneužitie tak sa pokúsime otvoriť web http://cieľová_IP:80   
Stránka nám nič nevráti.  
Hlavičky odpovede HTTP poskytujú niekoľko náznakov:  

![HTTP Hlavička](/images/posts/2025/mirai/mirai4.jpg)

Zaujímavá je časť `X-Pi-hole`. Vraví nám že sa jedná o [Pi-hole](https://pi-hole.net/). Jedná sa o DNS server ktorý beží na Raspberry P, linuxoch alebo dockeroch.
Používa sa na blokovanie reklám a celkovo ku zlepšeniu súkromia. 

Máme niekoľko možností ako zistiť viac informácií o webovej stránke, napr. pomocu: Gobuster, Nikto, feroxbuster...  
Pre naše účely použijeme [gobuster](https://github.com/OJ/gobuster)

![Gobuster výsledok](/images/posts/2025/mirai/mirai5.jpg)

`-w` určuje wordlist, teda zoznam slov alebo názvov adresárov/súborov, ktoré bude nástroj skúšať.  
`-u` je cieľová URL.  
`-x` = prípony súborov, ktoré má skúšať.  
`2>/dev/null` Presmerovanie chybných alebo varovných výstupov (stderr) do „temnoty“.  
`-k` Tento prepínač hovorí Gobusteru ignorovať problémy s HTTPS certifikátmi, ak by bol cieľ HTTPS.  
&nbsp;&nbsp;&nbsp;&nbsp;V tomto prípade, hoci je URL HTTP -k väčšinou neškodí ale ak by bol cieľ HTTPS, zabezpečí že certifikát self-signed neblokuje scan.

Určite navštívim /admin panel.

#### Site

![Admin panel pihole](/images/posts/2025/mirai/mirai6.jpg)

Po preskúmaní admin panelu nevidíme nič nezvyčajné. Vyskúšame default login ktorý som našiel na officiálnej stránke Pi-hole. Neúspešne

##### 36000/TCP - Plex Media Server

Po pripojení na (http://cieľová_IP:36000) sa vyskúšame registrovať. Po prihlásení vidím verziu 3.9.1  
Pokúsim sa vyhľadať exploity pre túto verziu no nič nenájdem.

![Plex](/images/posts/2025/mirai/mirai7.jpg)

Port **1877/tcp** patrí historicky HP-UX WebQoS databáze, dnes už nepoužívanej, takže nemá zmysel sa ním ďalej zaoberať.  

Port **53/tcp** dnsmasq - ľahký DNS forwarder a DHCP server, často používaný v routeroch a IoT zariadeniach. (2.76 starý a zraniteľný)  
Skúsim recursion test či DNS odpovedá na dotazy ktoré by nemal.
`dig axfr @10.10.10.48 google.com ` mi nič nevracia.

#### 22/tcp - SSH

Banner prezrádza, že zariadenie alebo server používa Debian, konkrétne staršiu verziu Debian 8 čo umožňuje pripojenie buď s predvoleným heslom alebo cez brute-force nástroje ako Medusa, a predstavuje tak riziko napadnutia zariadenia.  
medusa: medusa -h 10.10.10.48 -u pi -p raspberry -M ssh

![Medusa](/images/posts/2025/mirai/mirai8.jpg)

`-h 10.10.10.48` Cieľová IP adresa, na ktorú sa Medusa pripojí.  
`-u pi` Používateľské meno, ktoré sa skúša (pi – typické pre Raspberry Pi alebo IoT zariadenia).  
`-p raspberry` Heslo ktoré sa skúša (raspberry – predvolené heslo pre používateľa pi).  
`-M ssh` Modul Medusy ktorý určuje protokol: SSH v tomto prípade.

Po úspešnom prihlásení vyhľadáme flag v user.txt  
Zistíme aké príkazy môžme používať ako užívateľ a ako root:  
`sudo -l` Zobrazí zoznam príkazov, ktoré môže aktuálny používateľ spustiť cez sudo bez zadania hesla alebo s heslom.  
![sudo -l](/images/posts/2025/mirai/mirai9.jpg)   
`sudo su -` úplné root prostredie, vrátane PATH, domovského adresára (/root) a profilových premenných.  
`find / -type f -name "user.txt" 2>/dev/null`  
`cat user.txt` 
![flag user](/images/posts/2025/mirai/mirai10.jpg)  

Ďalej hľadáme root flag.  
`find / -type f -name "root.txt" 2>/dev/null`  
![root flag](/images/posts/2025/mirai/mirai11.jpg)
















Popis o výsledkoch.....






(Na pokračovaní sa pracuje ... )
