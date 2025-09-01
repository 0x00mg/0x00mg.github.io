---
layout: notes
title: "Nmap 1"
---

Nmap Cheat Sheet
================

Target Specification
---------------------------------------------------

| Switch | Example | Description |
|--------|------------------|-------------|
| |nmap 192.168.1.1| Sken jednej IP adresy |
|  |  nmap 192.168.1.1 192.168.2.1 |  Sken konkrétnych IP adries |
|  |  nmap 192.168.1.1-254 |  Sken rozsahu |
|  |  nmap scanme.nmap.org |  Sken domény |
|  |  nmap 192.168.1.0/24 |  Sken pomocou CIDR zápisu |
|  -iL |  nmap -iL targets.txt |  Sken cieľov zo súboru |
|  -iR |  nmap -iR 100 |  Sken 100 náhodných hostiteľov |
|  --exclude |  nmap --exclude 192.168.1.1 |  Vylúčiť zadaných hostiteľov |


Scan Techniques
---------------

| Switch | Example | Description  |
|----|-----|----|
|  -sS |  nmap 192.168.1.1 -sS |  TCP SYN sken portov (predvolené) |
|  -sT |  nmap 192.168.1.1 -sT | TCP connect sken portov<br />(predvolené bez root práv)|
|  -sU |  nmap 192.168.1.1 -sU |  UDP sken portov |
|  -sA |  nmap 192.168.1.1 -sA |  TCP ACK sken portov |
|  -sW |  nmap 192.168.1.1 -sW |  TCP Window sken portov |
|  -sM |  nmap 192.168.1.1 -sM |  TCP Maimon sken portov |


Host Discovery
--------------

| Switch | Example | Description  |
|----|-----|----|
|  -sL |  nmap 192.168.1.1-3 -sL |  Bez skenu. Iba vypíše ciele |
|  -sn |  nmap 192.168.1.1/24 -sn | Zakáže sken portov. Len zisťovanie hostiteľov.<br /> |
|  -Pn |  nmap 192.168.1.1-5 -Pn | Zakáže zisťovanie hostiteľov. Iba sken portov. <br />|  -PS |  nmap 192.168.1.1-5 -PS22-25,80 | TCP SYN zisťovanie na porte x. Predvolene port 80|
|  -PA |  nmap 192.168.1.1-5 -PA22-25,80 | TCP ACK zisťovanie na porte x.<br/>Predvolene port 80|
|  -PU |  nmap 192.168.1.1-5 -PU53 | UDP zisťovanie na porte x. Predvolene port 40125|
|  -PR |  nmap 192.168.1.1-1/24 -PR |  ARP zisťovanie v lokálnej sieti |
|  -n |  nmap 192.168.1.1 -n |  Nikdy nerobiť DNS preklad |


Port Specification
------------------

| Switch | Example | Description  |
|----|-----|----|
|  -p |  nmap 192.168.1.1 -p 21 |  Sken portu x |
|  -p |  nmap 192.168.1.1 -p 21-100 |  Rozsah portov |
|  -p |  nmap 192.168.1.1 -p U:53,T:21-25,80 |  Sken viacerých TCP a UDP portov |
|  -p- |  nmap 192.168.1.1 -p- |  Sken všetkých portov |
|  -p |  nmap 192.168.1.1 -p http,https |  Sken portov podľa názvu služby |
|  -F |  nmap 192.168.1.1 -F |  Rýchly sken portov (100 portov) |
|  --top-ports |  nmap 192.168.1.1 --top-ports 2000 |  Sken najpoužívanejších x portov |
|  -p-65535 |  nmap 192.168.1.1 -p-65535 | Vynechanie počiatočného portu v rozsahu<br />spustí sken od portu 1 |
|  -p0- |  nmap 192.168.1.1 -p0- | Vynechanie koncového portu v rozsahu spustí sken až do portu 65535 |



Service and Version Detection
-----------------------------


| Switch | Example | Description  |
|----|-----|----|
|  -sV |  nmap 192.168.1.1 -sV |  Pokus o zistenie verzie služby bežiacej na porte |
|  -sV --version-intensity |  nmap 192.168.1.1 -sV --version-intensity 8 |  Úroveň intenzity 0 až 9. Vyššie číslo zvyšuje presnosť |
|  -sV --version-light |  nmap 192.168.1.1 -sV --version-light |  Zapne ľahký režim. Nižšia presnosť, rýchlejšie |
|  -sV --version-all |  nmap 192.168.1.1 -sV --version-all |  Zapne intenzitu úrovne 9. Vyššia presnosť, pomalšie |
|  -A |  nmap 192.168.1.1 -A |  Zapne detekciu OS, detekciu verzie, skriptovanie a traceroute |


OS Detection
------------


| Switch | Example | Description  |
|----|-----|----|
|  -O |  nmap 192.168.1.1 -O | Vzdialená detekcia OS pomocou TCP/IP<br />fingerprintingu |
|  -O --osscan-limit |  nmap 192.168.1.1 -O --osscan-limit | Ak sa nenájde aspoň jeden otvorený a jeden zatvorený<br />TCP port, nebude sa skúšať detekcia OS |
|  -O --osscan-guess |  nmap 192.168.1.1 -O --osscan-guess |  Núti Nmap hádať agresívnejšie |
|  -O --max-os-tries |  nmap 192.168.1.1 -O --max-os-tries 1 | Nastaví maximálny počet x pokusov<br />o detekciu OS na cieľ |
|  -A |  nmap 192.168.1.1 -A |  Zapne detekciu OS, detekciu verzie, skriptovanie a traceroute |


Timing and Performance
----------------------


| Switch | Example | Description  |
|----|-----|----|
|  -T0 |  nmap 192.168.1.1 -T0 | Paranoid (0) obchádzanie IDS systémov |
|  -T1 |  nmap 192.168.1.1 -T1 | Sneaky (1) obchádzanie IDS systémov |
|  -T2 |  nmap 192.168.1.1 -T2 | Polite (2) spomalí sken aby využíval<br />menej šírky pásma a zdrojov cieľa |
|  -T3 |  nmap 192.168.1.1 -T3 |  Normal (3) predvolená rýchlosť |
|  -T4 |  nmap 192.168.1.1 -T4 | Aggressive (4) zrýchli skeny; predpokladá<br />rýchlu a stabilnú sieť |
|  -T5 |  nmap 192.168.1.1 -T5 | Insane (5) extrémne zrýchlenie; predpokladá<br />mimoriadne rýchlu sieť |



| Switch | Example input | Description  |
|----|-----|----|
|  --host-timeout &lt;time&gt; |  1s; 4m; 2h |  Vzdá sa cieľa po uplynutí času |
|  --min-rtt-timeout/max-rtt-timeout/initial-rtt-timeout &lt;time&gt; |  1s; 4m; 2h |  Nastaví čas odozvy sondy |
|  --min-hostgroup/max-hostgroup &lt;size&lt;size&gt; |  50; 1024 | Veľkosť paralelne skenovanej skupiny hostiteľov |
|  --min-parallelism/max-parallelism &lt;numprobes&gt; |  10; 1 |  Paralelizácia sond |
|  --scan-delay/--max-scan-delay &lt;time&gt; |  20ms; 2s; 4m; 5h |  Nastaví oneskorenie medzi sondami |
|  --max-retries &lt;tries&gt; |  3 | Určí maximálny počet<br />opätovných pokusov o sken portu |
|  --min-rate &lt;number&gt; |  100 |  Posiela pakety nie pomalšie ako &lt;number&gt; za sekundu |
|  --max-rate &lt;number&gt; |  100 |  Posiela pakety nie rýchlejšie ako &lt;number&gt; za sekundu |


NSE Scripts
-----------


| Switch | Example | Description  |
|----|-----|----|
|  -sC |  nmap 192.168.1.1 -sC |  Sken s predvolenými NSE skriptmi. Považované za bezpečné a užitočné |
|  --script default |  nmap 192.168.1.1 --script default |  Sken s predvolenými NSE skriptmi. Považované za bezpečné a užitočné |
|  --script |  nmap 192.168.1.1 --script=banner |  Sken s jedným skriptom. Príklad banner |
|  --script |  nmap 192.168.1.1 --script=http* |  Sken s použitím zástupného znaku. Príklad http |
|  --script |  nmap 192.168.1.1 --script=http,banner |  Sken s dvomi skriptmi. Príklad http a banner |
|  --script |  nmap 192.168.1.1 --script &quot;not intrusive&quot; |  Sken predvolených, ale vynechá rušivé skripty |
|  --script-args |  nmap --script snmp-sysdescr --script-args snmpcommunity=admin 192.168.1.1 |  NSE skript s argumentmi |


Useful NSE Script Examples


| Command | Description  |
|----|-----|
|  nmap -Pn --script=http-sitemap-generator scanme.nmap.org |  Generátor mapy webu |
|  nmap -n -Pn -p 80 --open -sV -vvv --script banner,http-title -iR 1000 |  Rýchle vyhľadávanie náhodných web serverov |
|  nmap -Pn --script=dns-brute domain.com |  Hrubá sila DNS mien (hádanie subdomén) |
|  nmap -n -Pn -vv -O -sV --script smb-enum*,smb-ls,smb-mbenum,smb-os-discovery,smb-s*,smb-vuln*,smbv2* -vv 192.168.1.1 |  Bezpečné SMB skripty na spustenie |
|  nmap --script whois* domain.com |  Whois dopyt |
|  nmap -p80 --script http-unsafe-output-escaping scanme.nmap.org |  Detekcia XSS zraniteľností |
|  nmap -p80 --script http-sql-injection scanme.nmap.org |  Kontrola SQL injekcií |


Firewall / IDS Evasion and Spoofing
-----------------------------------


| Switch | Example | Description  |
|----|-----|----|
|  -f |  nmap 192.168.1.1 -f |  Sken používa malé fragmentované IP pakety. Ťažšie odhaliteľné filtrom |
|  --mtu |  nmap 192.168.1.1 --mtu 32 |  Nastavenie vlastnej veľkosti offsetu |
|  -D | nmap -D 192.168.1.101,192.168.1.102, <br />192.168.1.103,192.168.1.23 192.168.1.1|  Posiela skeny z falošných IP |
|  -D |  nmap -D decoy-ip1,decoy-ip2,your-own-ip,decoy-ip3,decoy-ip4 remote-host-ip |  Vysvetlenie vyššie uvedeného príkladu |
|  -S |  nmap -S www.microsoft.com www.facebook.com |  Skenuje Facebook z Microsoftu (-e eth0 -Pn môže byť potrebné) |
|  -g |  nmap -g 53 192.168.1.1 |  Použije zadané číslo zdrojového portu |
|  --proxies |  nmap --proxies http://192.168.1.1:8080, http://192.168.1.2:8080 192.168.1.1 |  Smeruje spojenia cez HTTP/SOCKS4 proxy |
|  --data-length |  nmap --data-length 200 192.168.1.1 |  Pridá náhodné dáta do odosielaných paketov |


Example IDS Evasion command

    nmap -f -t 0 -n -Pn –data-length 200 -D 192.168.1.101,192.168.1.102,192.168.1.103,192.168.1.23 192.168.1.1


Output
------

| Switch | Example | Description  |
|----|-----|----|
|  -oN |  nmap 192.168.1.1 -oN normal.file |  Normálny výstup do súboru normal.file |
|  -oX |  nmap 192.168.1.1 -oX xml.file |  XML výstup do súboru xml.file |
|  -oG |  nmap 192.168.1.1 -oG grep.file |  Grepovateľný výstup do súboru grep.file |
|  -oA |  nmap 192.168.1.1 -oA results |  Výstup vo všetkých troch hlavných formátoch naraz |
|  -oG - |  nmap 192.168.1.1 -oG - |  Grepovateľný výstup na obrazovku. -oN -, -oX - tiež použiteľné |
|  --append-output |  nmap 192.168.1.1 -oN file.file --append-output |  Pridá sken do existujúceho súboru |
|  -v |  nmap 192.168.1.1 -v |  Zvýši úroveň výrečnosti (použi -vv alebo viac pre väčší efekt) |
|  -d |  nmap 192.168.1.1 -d |  Zvýši úroveň ladenia (použi -dd alebo viac pre väčší efekt) |
|  --reason |  nmap 192.168.1.1 --reason |  Zobrazí dôvod, prečo je port v danom stave, rovnaké ako -vv |
|  --open |  nmap 192.168.1.1 --open |  Zobrazí iba otvorené (alebo možno otvorené) porty |
|  --packet-trace |  nmap 192.168.1.1 -T4 --packet-trace |  Zobrazí všetky odoslané a prijaté pakety |
|  --iflist |  nmap --iflist |  Zobrazí rozhrania hostiteľa a trasy |
|  --resume |  nmap --resume results.file |  Pokračuje v skene |


Helpful Nmap Output examples



| Command | Description  |
|----|-----|
|  nmap -p80 -sV -oG - --open 192.168.1.1/24 | grep open |  Sken web serverov a grep na zobrazenie IP, ktoré bežia |
|  nmap -iR 10 -n -oX out.xml | grep &quot;Nmap&quot; | cut -d &quot; &quot; -f5 &gt; live-hosts.txt |  Vygeneruje zoznam IP živých hostiteľov |
|  nmap -iR 10 -n -oX out2.xml | grep &quot;Nmap&quot; | cut -d &quot; &quot; -f5 &gt;&gt; live-hosts.txt |  Pridá IP do zoznamu živých hostiteľov |
|  ndiff scanl.xml scan2.xml |  Porovná výstupy z nmap pomocou ndiff |
|  xsltproc nmap.xml -o nmap.html |  Konvertuje nmap xml súbory do html |
|  grep &quot; open &quot; results.nmap | sed -r 's/ +/ /g' | sort | uniq -c | sort -rn | less |  Zoradený zoznam, ako často sa porty objavia |


Miscellaneous Options
---------------------

| Switch | Example | Description  |
|----|-----|----|
|  -6 |  nmap -6 2607:f0d0:1002:51::4 |  Povoliť IPv6 skenovanie |
|  -h |  nmap -h |  nmap nápoveda |


Other Useful Nmap Commands
--------------------------



| Command | Description  |
|----|-----|
|  nmap -iR 10 -PS22-25,80,113,1050,35000 -v -sn |  Zisťovanie len na portoch x, bez skenu portov |
|  nmap 192.168.1.1-1/24 -PR -sn -vv |  Arp zisťovanie len v lokálnej sieti, bez skenu portov |
|  nmap -iR 10 -sn -traceroute |  Traceroute na náhodné ciele, bez skenu portov |
|  nmap 192.168.1.1-50 -sL --dns-server 192.168.1.1 |  Dopyt na interný DNS pre hostiteľov, len vypíše ciele |

