---
layout: post
title:	"Tech: Meteostanica - MeteoGeM_v1"
date:	2025-08-31 10:00:00 +0200 
author: "0x4d47"
categories:
    - blog
tags:
    - elektro
    - esp8266
    - MQTT
   
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
5. Sledovanie stavu batérie

Znie to jednoducho ale ako vždy... diabol je v detailoch.  

#### Výber komponentov

**Po chvíľke premýšľania som skončil pri týchto súčiastkach:**  
**ESP8266** – lacný WiFi mikrokontrolér ktorý bez problémov zvládne MQTT.  
**BME280** – senzor na teplotu, vlhkosť a tlak. Malý, presný a komunikuje cez I²C.  
**TPL5110** – „super power timer“ od Texas Instruments, ktorý dokáže úplne odpojiť napájanie a prebudiť zariadenie v zadanom intervale.  
**Pololu U1V11F3** – DC/DC menič na stabilné 3,3V pre ESP. Regulátor zvyšuje napätie v rozsahu od 0,5 do 5,5 V na konštantnú hodnotu 3,3 V.  
**2× Li-Ion 18650** – zdroj energie.

<img src="{{ site.baseurl }}/images/posts/2025/meteo/meteo2.jpg" alt="Broadboard" style="width:100%; max-width:400px; height:auto; margin-bottom:20px; border-radius:4px;">


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

Jedným z testov je aj určiť spotrebu a odhadnúť výdrž na 2× Li-Ion 18650 (2200 mAh, paralelne = 4400 mAh), pričom meteostanica sa prebúdza každých 15 minút, odosiela dáta cez MQTT a následne sa opäť vypne.

**Parametre spotreby jednotlivých súčiastok**  
| Komponent      | Stav                  | Prúd (mA)                 | Poznámka               |
| -------------- | --------------------- | ------------------------- | ---------------------- |
| WeMos D1 Mini  | aktívny (WiFi + MQTT) | 150                       | cca 5 s                |
| BME280         | aktívny               | 0,2                       | počas 5 s čítania      |
| TPL5110        | standby               | 0,000035                  | zanedbateľné           |
| Pololu U1V11F3 | prevádzka             | zohľadnená cez efektivitu | cca 85–90 % efektivita |

## Výpočet spotreby meteostanice

### 1. Aktívna fáza

Počas aktívnej fázy (WiFi + MQTT) berie WeMos približne **150 mA** po dobu **5 s**:

$$
I_{\text{active}} = 150 \,\text{mA}
$$

Čas prebudenia v hodinách:

$$
t_{\text{active}} = \frac{5}{3600} \,\text{h} \approx 0.001389 \,\text{h}
$$

Spotreba na jeden cyklus:

$$
Q_{\text{cyklus}} = I_{\text{active}} \cdot t_{\text{active}}
$$

$$
Q_{\text{cyklus}} = 150 \cdot 0.001389 \approx 0.208 \,\text{mAh}
$$

### 2. Korekcia na účinnosť DC/DC meniča

Efektivita Pololu U1V11F3 je približne 85 %:

$$
Q_{\text{cyklus,real}} = \frac{Q_{\text{cyklus}}}{0.85}
$$

$$
Q_{\text{cyklus,real}} = \frac{0.208}{0.85} \approx 0.245 \,\text{mAh}
$$

### 3. Spotreba za deň

Počet cyklov za deň (prebudenie každých 15 minút):

$$
n_{\text{cyklov}} = \frac{24 \cdot 3600}{15 \cdot 60} = 96
$$

Denná spotreba:

$$
Q_{\text{deň}} = n_{\text{cyklov}} \cdot Q_{\text{cyklus,real}}
$$

$$
Q_{\text{deň}} = 96 \cdot 0.245 \approx 23.5 \,\text{mAh}
$$

### 4. Výdrž batérie

Kapacita dvoch 18650 (paralelne):

$$
Q_{\text{batéria}} = 2 \cdot 2200 = 4400 \,\text{mAh}
$$

Odhad výdrže v dňoch:

$$
t_{\text{výdrž}} = \frac{Q_{\text{batéria}}}{Q_{\text{deň}}}
$$

$$
t_{\text{výdrž}} = \frac{4400}{23.5} \approx 187 \,\text{dní} \approx 6.2 \,\text{mesiaca}
$$



<img src="{{ site.baseurl }}/images/posts/2025/meteo/meteo1.jpg" alt="Broadboard" style="width:100%; max-width:600px; height:auto; margin-bottom:20px; border-radius:4px;">

#### Čo ďalej?

Plánujem:

Pridať webové rozhranie alebo integráciu do Home Assistanta.  
Vytlačiť elegantnú krabičku.  


#### Záver
Tento projekt mi ukázal, že aj relatívne jednoduchá myšlienka (merať teplotu každých 15 minút) sa dá spraviť elegantne a efektívne ak si človek dá pozor na spotrebu energie.
ESP8266, BME280 a TPL5110 sa ukázali ako ideálna kombinácia pre lacnú a úspornú meteostanicu ktorá dokáže fungovať na batériu veľmi dlho.
