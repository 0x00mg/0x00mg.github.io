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

Toto laboratórium demonštruje aké rizikové je ponechať zariadenie s predvolenými prihlasovacími údajmi bez zmeny.

### Prieskum

Po prihlásení do laboratória a priradení cieľovej IP adresy je prvým krokom vždy získať prehľad o tom, aké služby stroj ponúka. 
Na to je najjednoduchšie použiť nástroj `nmap` ktorý nám umožní zistiť otvorené porty, spustené služby a aj ich verzie. 
Vďaka tomu vieme určiť ďalší smer prieskumu a hľadať potenciálne zraniteľnosti. Preto začnem skenom cieľa.

Na rýchle odhalenie všetkých portov použijem príkaz:

IMAGE

`-p-`  skenujem všetkých 65 535 portov.  
`--min-rate 10000`  nastavuje minimálnu rýchlosť odosielania paketov (10 000 za sekundu), aby bol sken výrazne rýchlejší. 

Po ukončení skenu si otvorené porty oskenujem hlbšie:

IMAGE

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

IMAGE

Máme niekoľko možností ako zistiť viac informácií o webovej stránke, napr. pomocu: Gobuster, Nikto, feroxbuster...  
Pre naše účely použijeme [gobuster](https://github.com/OJ/gobuster)

IMAGE

`-w` určuje wordlist, teda zoznam slov alebo názvov adresárov/súborov, ktoré bude nástroj skúšať.  
`-u` je cieľová URL.  
`-x` = prípony súborov, ktoré má skúšať.  
`2>/dev/null` Presmerovanie chybných alebo varovných výstupov (stderr) do „temnoty“.  
`-k` Tento prepínač hovorí Gobusteru ignorovať problémy s HTTPS certifikátmi, ak by bol cieľ HTTPS.  
&nbsp;&nbsp;&nbsp;&nbsp;V tomto prípade, hoci je URL HTTP -k väčšinou neškodí ale ak by bol cieľ HTTPS, zabezpečí že certifikát self-signed neblokuje scan.



Popis o výsledkoch.....






(Na pokračovaní sa pracuje ... )
