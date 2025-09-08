---
layout: post
title:	"HTB: Secure Digital a SPI protokol"
date:	2025-09-08 10:00:00 +0200 
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
type: hardware  
difficulty: very easy

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
je to binárny záznam zachytený pomocou logického analyzátora (saleae Logic) ktorý monitoruje komunikáciu medzi zariadeniami cez SPI. Ako sme spomenuli vyššie tento záznam obsahuje štyri digitálne kanály ktoré reprezentujú:

**MOSI** (Master Out Slave In) – dáta posielané z master zariadenia do slave zariadenia.  
**MISO** (Master In Slave Out) – dáta posielané zo slave zariadenia do master zariadenia.  
**SCK** (Serial Clock) – hodinový signál generovaný master zariadením.  
**SS** (Slave Select) – signál určujúci, ktoré slave zariadenie je aktívne.  

Máme hneď niekoľko možností ako získať vlajku. Najjednoduchší spôsob je zobrať súbor a dekódovať na stránke <a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener noreferrer">CyberChef</a>. Ďaľším spôsobom je analyzovať dáta pomocou programu <a href="https://www.saleae.com/pages/downloads" target="_blank" rel="noopener noreferrer">Logic 2</a>.

1. Pre otvorenie súboru použijeme Logic 2 a v menu si pridáme SPI analyzér kde vyberieme jednotlivé kanály

<img src="{{ site.baseurl }}/images/posts/2025/htb/spi3.jpg" alt="SPI" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">

2. Následne je možné identifikovať prenosy dát a hľadať špecifické vzory alebo reťazce, ktoré môžu naznačovať prítomnosť flagu.
3. Ja som súbor exportoval do csv formátu, rozdelil jednotlivé dáta do stĺpcov a dekódoval pomocou scriptu. (csv export bez prekladu ascii/hex iba binary)
   
{% highlight python %}
# Načítanie CSV súboru z logického analyzátora
df = pd.read_csv("digital.csv")
{% endhighlight %}
```python
# Mapovanie kanálov podľa CSV
# Predpoklad: Channel 0 = MOSI, Channel 1 = MISO, Channel 2 = CS, Channel 3 = SCK
MOSI = df["Channel 0"].values  # Data posielané z mastera
MISO = df["Channel 1"].values  # Data posielané z periférie (tu zatiaľ nepoužívame)
CS   = df["Channel 2"].values  # Chip Select, aktívny low
SCK  = df["Channel 3"].values  # Hodinový signál SPI
 ```
Aby sme mohli dekódovať SPI komunikáciu, musíme si vybrať správne stĺpce. V tomto prípade:  
MOSI (Master Out Slave In) – dáta od mastera k slave zariadeniu,  
MISO (Master In Slave Out) – dáta od slave k masterovi (zatiaľ nepoužívame),  
CS (Chip Select) – signalizuje, kedy je vybrané dané zariadenie (aktívne v log. 0),  
SCK (Serial Clock) – hodinový signál, podľa ktorého sa čítajú bity.  
```python
def spi_decode(MOSI, MISO, SCK, CS):
    prev_clk = 0          # Predchádzajúci stav hodinového signálu (na detekciu nábežnej hrany)
    current_byte = 0      # Tu sa postupne ukladá skladaný byte
    bit_count = 0         # Počet bitov zozbieraných do aktuálneho bytu
    byte_list = []        # Zoznam dekódovaných bytov
```
Definujeme funkciu `spi_decode`, ktorá vykoná samotné dekódovanie SPI komunikácie. Používame premenné na sledovanie hodín, skladanie bytov a ukladanie výsledku.
```python  
    # Prejdenie všetkých vzoriek súčasne (CS, SCK, MOSI)
    for cs, clk, mosi in zip(CS, SCK, MOSI):
        if cs == 0:  # Ak je CS aktívne (low), prebieha komunikácia
            if prev_clk == 0 and clk == 1:  # Detekcia nábežnej hrany hodinového signálu
                # Posuň aktuálny byte doľava a pridaj nový bit z MOSI
                current_byte = (current_byte << 1) | mosi
                bit_count += 1
```
Prechádzame všetky vzorky a dekódujeme ich podľa hodín.  
Komunikácia je povolená len vtedy, keď je CS = 0.  
Dáta sa zachytávajú pri nábežnej hrane hodín (prechod z 0 na 1).  
Každý bit sa vloží do current_byte pomocou posunu a logického OR.  
```python
                # Ak máme 8 bitov, uložíme byte a resetujeme premenné
                if bit_count == 8:
                    byte_list.append(current_byte)
                    current_byte = 0
                    bit_count = 0
```
Keď nazbierame 8 bitov máme kompletný byte. Ten uložíme do výsledného zoznamu a začneme zbierať nový byte od nuly.
```python
        else:
            # Ak CS nie je aktívne (high), resetujeme aktuálny byte a počet bitov
            # To zabráni nesprávnej akumulácii dát mimo rámca SPI prenosu
            current_byte = 0
            bit_count = 0
```
Ak CS = 1 znamená to že žiadna komunikácia neprebieha. V tom prípade resetujeme všetko aby sme nenazbierali “odpadové” bity mimo SPI rámca.
```python
# Konverzia bajtov na ASCII
# Znaky mimo čitateľného rozsahu (32–126) nahradíme bodkou '.'
ascii_str = ''.join(chr(b) if 32 <= b <= 126 else '.' for b in bytes_out)
```
Prevedieme dekódované byty na čitateľné ASCII znaky. Ak sa v bytoch nachádzajú nečitateľné hodnoty nahradíme ich bodkou aby bol výstup prehľadný.

celý script nájdete na:  <a href="https://github.com/0x00mg/Python/blob/main/HTB/spi_reader.py" target="_blank" rel="noopener noreferrer">spi_reader.py</a>
   
4. Súbor vieme tiež elegantne dekódovať v linuxe pomocou príkazov `cut` ale data som vytiahol aj s HEX

<img src="{{ site.baseurl }}/images/posts/2025/htb/spi4.jpg" alt="SPI" style="width:100%; max-width:700px; height:auto; margin-bottom:20px; border-radius:4px;">

`cut -d';' -f4` – vezme 4. stĺpec (MOSI).  
`tr -d '\n'` – poskladá všetky znaky do jedného riadku. 
`grep -o "HTB{[^}]*}"` – nájde a vypíše samotný flag vo formáte HTB{...}  

#### Záver

Výzva Secure Digital ukázala že SPI prenosy je možné jednoducho zachytiť a dekódovať či už v Logic 2, Pythonom alebo pomocou príkazov v linuxe. Keďže SPI nemá vstavané zabezpečenie MOSI/MISO linky prenášajú dáta v čitateľnej podobe a útočníkovi stačí správne mapovať kanály.

Poučenie je jednoznačné: SPI je rýchly a jednoduchý protokol ale nie bezpečný. Prenos citlivých údajov preto musí byť doplnený o šifrovanie alebo aplikačnú ochranu, inak je odpočúvanie triviálne.






