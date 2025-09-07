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
K dispozícií máme 4 súbory
