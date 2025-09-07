



### HTB: Secure Digital

V rámci série výziev Hack The Box (HTB) sa objavila výzva Secure Digital ktorá sa zameriava na analýzu SPI (Serial Peripheral Interface) protokolu a extrakciu dát z microSD karty. 
Tento typ výzvy je ideálny pre tých, ktorí sa chcú ponoriť do hardvérového a naučiť sa ako komunikovať s embedded zariadeniami.

Musíme získať hlavný kľúč uložený na microSD karte v prístupovom systéme. Spoje vedúce k tejto karte sú prístupné na vrchnej vrstve dosky plošných spojov. 
Operatívny technik ich preto mohol prerezať a vložiť medzi ne zariadenie, ktoré zachytáva signály. Potom spustili čítanie kľúča, ktorý sa prenášal cez nezabezpečené sériové rozhranie. 
Vieš zistiť, čo microSD karta načítala?
