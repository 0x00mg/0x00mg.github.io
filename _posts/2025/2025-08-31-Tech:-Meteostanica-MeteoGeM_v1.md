---
layout: post
title:	"Tech: Meteostanica - MeteoGeM_v1"
date:	2025-08-31 10:00:00 +0200 
author: "0x4d47"
categories:
    - blog
tags:
    - elektronika
    - esp8266
   
image: /images/posts/2025/meteo/meteo1.jpg
---

**.......článok je ešte v procese.......**

### Ako som postavil vlastnú batériovú meteostanicu s ESP8266 a MQTT

Už dlho ma lákala myšlienka mať prehľad o tom, aká je teplota a vlhkosť nielen v byte, ale aj vonku. Chcel som si to ale riešiť po svojom žiadne hotové IoT hračky ale vlastný projekt ktorý si sám zladím a prispôsobím.  
A tak sa zrodil nápad na dvojicu meteostaníc: jednu do bytu a druhú von s tým že obidve budú napájané z batérie a čo najviac úsporné.

#### Nápad a požiadavky

**Moje požiadavky boli jasné:**  
1. Meranie teploty, vlhkosti a tlaku každých 15 minút.  
2. Odosielanie dát na NAS cez MQTT aby som ich mohol ďalej spracovávať.  
3. Zariadenia musia byť úplne autonómne a napájané z Li-Ion batérií.  
4. Medzi meraniami sa má celé zariadenie vypnúť aby batérie vydržali čo najdlhšie. (žiadny deep sleep mode)

Znie to jednoducho ale ako vždy... diabol je v detailoch.  

#### Výber komponentov

**Po chvíľke premýšľania som skončil pri týchto súčiastkach:**  
**ESP8266** – lacný WiFi mikrokontrolér ktorý bez problémov zvládne MQTT.  
**BME280** – senzor na teplotu, vlhkosť a tlak. Malý, presný a komunikuje cez I²C.  
**TPL5110** – „super power timer“ od Texas Instruments, ktorý dokáže úplne odpojiť napájanie a prebudiť zariadenie v zadanom intervale.  
**Pololu U1V11F3** – DC/DC menič na stabilné 3,3V pre ESP. Regulátor zvyšuje napätie v rozsahu od 0,5 do 5,5 V na konštantnú hodnotu 3,3 V.  
**2× Li-Ion 18650** – zdroj energie.


#### Softvérová časť

Samozrejme s pomocou AI som napísal jednoduchý kód v Arduine ([code MeteoGeM_v1](https://github.com/0x00mg/C-language/tree/main/MeteoGeM)). Funguje to takto:  
1. Po zapnutí sa ESP pripojí na WiFi.  
2. Inicializuje BME280, ak ho nenájde, reštartuje sa.  
3. Získa aktuálny čas z NTP a prevedie ho na lokálny (vrátane letného/zimného času).  
4. Pripojí sa na MQTT broker (bežiaci na NAS).  
5. Zmeria teplotu, vlhkosť, tlak a napätie batérie.  
6. Všetko odošle na príslušné MQTT topicy.  
7. Vysiela DONE signál pre TPL5110 a čaká, kým sa zariadenie úplne vypne.  
8. Ak sa čokoľvek pokazí (WiFi, MQTT, senzor), ESP sa jednoducho reštartuje a skúsi to znova.  

**TPL5110** – malý čip, veľká záchrana batérie  
Najväčšia výzva bola nastaviť TPL5110. Tento malý čip sa správa ako inteligentný „vypínač“ – drží ESP úplne vypnuté a prebúdza ho len v nastavených intervaloch. Nakonfigurovať ho na 15 minút bola celkom sranda.
Po tom čo ESP odošle dáta musí ešte odoslať DONE signál. Tým dá TPL5110 najavo že môže zase odpojiť napájanie a čakať na ďalšie prebudenie.

Vďaka tomu mám istotu že ESP medzi meraniami nežerie batériu v deep sleep režime ale je naozaj úplne odpojené.

#### Testovanie a výsledky

Keď som to prvýkrát spustil, bol to krásny moment... nič nefungovalo. :)  
ESP sa prebudilo, pripojilo na WiFi, poslalo dáta a... ostalo zapnuté....  
**(Popis problému v procese....)**

Na NAS-e som si nastavil MQTT server a vizualizáciu dát. Teraz môžem sledovať históriu teplôt a vlhkosti a porovnávať byt vs. vonkajšie prostredie.  
**(Popis nastavenia a testovanie v procese....)**

<img src="{{ site.baseurl }}/images/posts/2025/meteo/meteo1.jpg" alt="Broadboard" style="width:100%; max-width:600px; height:auto; margin-bottom:20px; border-radius:4px;">

#### Čo ďalej?

Plánujem:

Pridať webové rozhranie alebo integráciu do Home Assistanta.  
Vytlačiť elegantnú krabičku.  


#### Záver
Tento projekt mi ukázal, že aj relatívne jednoduchá myšlienka (merať teplotu každých 15 minút) sa dá spraviť elegantne a efektívne – ak si človek dá pozor na spotrebu energie.
ESP8266, BME280 a TPL5110 sa ukázali ako ideálna kombinácia pre lacnú a úspornú meteostanicu, ktorá dokáže fungovať na batériu veľmi dlho.
