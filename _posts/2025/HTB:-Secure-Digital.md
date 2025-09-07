---
layout: post
title:	"HTB: Secure Digital a SPI protokol"
date:	2025-09-07 10:00:00 +0200 
author: "0x00mg"
categories:
    - blog
tags:
    - htb
    - challenge
    - spi
   
image: /images/posts/2025/htb/spi.jpg
---



### HTB: Secure Digital

V rámci série výziev Hack The Box (HTB) sa objavila výzva Secure Digital ktorá sa zameriava na analýzu <a href="https://en.wikipedia.org/wiki/Serial_Peripheral_Interface" target="_blank" rel="noopener noreferrer">SPI (Serial Peripheral Interface)</a> protokolu a extrakciu dát z microSD karty. 
Tento typ výzvy je ideálny pre tých ktorí sa chcú ponoriť do hardvéru a naučiť sa ako komunikovať s embedded zariadeniami.

#### Zadanie
Musíme získať hlavný kľúč uložený na microSD karte v prístupovom systéme. Spoje vedúce k tejto karte sú prístupné na vrchnej vrstve dosky plošných spojov. 
Operatívny technik ich preto mohol prerušiť a vložiť medzi ne zariadenie ktoré zachytáva signály. Potom spustili čítanie kľúča ktorý sa prenášal cez nezabezpečené sériové rozhranie. 
Našou úlohou je zistiť čo zariadenie prečítalo.

<img src="{{ site.baseurl }}/images/posts/2025/htb/spi1.jpg" alt="SPI" style="width:100%; max-width:500px; height:auto; margin-bottom:20px; border-radius:4px;">

#### SPI protokol
SPI, teda Serial Peripheral Interface je sériový komunikačný protokol ktorý sa často používa na prepojenie mikroprocesorov alebo mikrokontrolérov s rôznymi periférnymi zariadeniami ako sú senzory, pamäťové čipy, displeje alebo prevodníky signálu. Tento protokol umožňuje priamu výmenu dát medzi zariadeniami pričom jedna strana – master – riadi celú komunikáciu a druhá strana – slave – reaguje na jeho príkazy.

Na rozdiel od paralelnej komunikácie kde sa posielajú celé slová súčasne po viacerých vodičoch, SPI posiela dáta po jednom bite teda sériovo. Tento prístup zjednodušuje hardvér a umožňuje veľmi rýchly prenos informácií. Komunikácia prebieha full-duplex spôsobom čo znamená že master a slave môžu posielať a prijímať dáta súčasne čím sa zvyšuje efektivita prenosu.

SPI používa štyri základné vodiče. **MOSI** (Master Out, Slave In) prenáša dáta z mastera do slave zariadenia zatiaľ čo **MISO** (Master In, Slave Out) prenáša dáta opačným smerom. Hodinový signál **(SCLK)** ktorý určuje rýchlosť a načasovanie prenosu generuje master prostredníctvom vodiča SCK. Aby master vedel ktoré zariadenie má práve komunikovať používa sa vodič SS alebo CS (Slave Select / Chip Select) ktorý aktivuje konkrétneho slave zariadenia. Každé slave zariadenie zvyčajne vyžaduje vlastnú linku SS aby sa zabránilo konfliktom pri viacerých pripojených perifériách.

Jednou z veľkých výhod SPI je jeho vysoká rýchlosť a jednoduchosť čo ho robí ideálnym pre aplikácie kde je potrebný rýchly prenos dát. Nevýhodou však je že každé zariadenie potrebuje samostatnú SS linku a samotný protokol nemá vstavaný systém adresovania ako napríklad I²C. Ďalším limitom je vzdialenosť – SPI sa obvykle používa len na krátke vzdialenosti, typicky niekoľko desiatok centimetrov až metrov.

Celkovo je SPI protokol výkonným a efektívnym riešením pre pripojenie periférií k mikrokontrolérom najmä tam kde je potrebná vysoká rýchlosť a jednoduchá implementácia.

<img src="{{ site.baseurl }}/images/posts/2025/htb/spi2.jpg" alt="SPI" style="width:100%; max-width:400px; height:auto; margin-bottom:20px; border-radius:4px;">

#### Postup
K dispozícií máme súbor s názvom trace_captured.sal.  
je to binárny záznam zachytený pomocou logického analyzátora ktorý monitoruje komunikáciu medzi zariadeniami cez SPI. Ako sme spomenuli vyššie tento záznam obsahuje štyri digitálne kanály ktoré reprezentujú:

**MOSI** (Master Out Slave In) – dáta posielané z master zariadenia do slave zariadenia.  
**MISO** (Master In Slave Out) – dáta posielané zo slave zariadenia do master zariadenia.  
**SCK** (Serial Clock) – hodinový signál generovaný master zariadením.  
**SS** (Slave Select) – signál určujúci, ktoré slave zariadenie je aktívne.  

Máme hneď niekoľko možností ako získať vlajku. Najjednoduchší spôsob je zobrať súbor a dekódovať na stránke <a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener noreferrer">CyberChef</a>. Ďaľším spôsobom je analyzovať dáta pomocou programu <a href="https://www.saleae.com/pages/downloads" target="_blank" rel="noopener noreferrer">Logic 2</a>.

1. Po otvorení súboru si pridáme SPI analyzér a vyberieme jednotlivé kanály

<img src="{{ site.baseurl }}/images/posts/2025/htb/spi3.jpg" alt="SPI" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">

2. Následne je možné identifikovať prenosy dát a hľadať špecifické vzory alebo reťazce, ktoré môžu naznačovať prítomnosť flagu.
3. Ja som súbor exportoval do csv formátu a dekódoval som dáta pomocou scriptu.
4.   pomocou linux cat awk







