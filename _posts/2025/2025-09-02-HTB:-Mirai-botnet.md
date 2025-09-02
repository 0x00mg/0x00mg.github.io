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
Bol určený na infikovanie IoT zariadení (kamery, routery, DVR rekordéry a pod.), ktoré mali predvolené alebo slabé prihlasovacie údaje. 
Po infikovaní zariadenie vstúpilo do botnetu ktorý útočníci využívali na DDoS útoky 
Mirai automaticky skenoval internet a hľadal zariadenia prístupné cez Telnet alebo SSH. Potom skúšal zoznam známych predvolených používateľských mien a hesiel.
Najznámejšie použitie Mirai botnetu bol masívny útok na DNS poskytovateľa Dyn v októbri 2016, ktorý spôsobil výpadky veľkých služieb ako Twitter, Netflix, Reddit či Spotify.
[Mirai(Malware)](https://en.wikipedia.org/wiki/Mirai_(malware))

Toto laboratórium demonštruje aké rizikové je ponechať zariadenie s predvolenými prihlasovacími údajmi bez zmeny.

### Prieskum

Po prihlásení do laboratória a priradení cieľovej IP adresy je prvým krokom vždy získať prehľad o tom, aké služby stroj ponúka. 
Na to je najjednoduchšie použiť nástroj `nmap` ktorý nám umožní zistiť otvorené porty, spustené služby a aj ich verzie. 
Vďaka tomu vieme určiť ďalší smer prieskumu a hľadať potenciálne zraniteľnosti. Preto začnem skenom cieľa.

Na rýchle odhalenie všetkých portov použijem príkaz:

`-p-`  skenujem všetkých 65 535 portov.
`--min-rate 10000`  nastavuje minimálnu rýchlosť odosielania paketov (10 000 za sekundu), aby bol sken výrazne rýchlejší.







(Na pokračovaní sa pracuje ... )
