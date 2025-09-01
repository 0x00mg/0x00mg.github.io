---
layout: page
title: "About Me"
permalink: /about_me/
---
<div id="terminal"></div>

<script>
const terminal = document.getElementById('terminal');

const lines = [
  "Initializing profile...",
  "----------------------------------------",
  "Username: Miroslav Gensor",
  "Education: Mechanik elektrotechnik, cislicova a riadiaca technika",
  "Location: Bratislava",
  "Company: IFT - InForm Technologies a.s.",
  "----------------------------------------",
  "Loading profession modules...",
  "[OK] RIS & SCADA systems specialist loaded",
  "[OK] Daily operations initialized",
  "----------------------------------------",
  "Scanning hobbies...",
  "[*] Plastikove modelarstvo",
  "[*] Hľadanie vlajok na Hack The Box",
  "[*] Elektronika a technicke experimenty",
  "----------------------------------------",
  "Profile loaded successfully.",
  "Type 'exit' to logout..."
];

let lineIndex = 0;

// vytvoríme kurzor
let cursor = document.createElement('span');
cursor.className = 'cursor';
terminal.appendChild(cursor);

function typeLine(line, callback) {
  let charIndex = 0;
  function typeChar() {
    if (charIndex < line.length) {
      cursor.insertAdjacentText('beforebegin', line.charAt(charIndex));
      charIndex++;
      setTimeout(typeChar, 30); // rýchlosť písania
    } else {
      cursor.insertAdjacentText('beforebegin', '\n');
      callback();
    }
  }
  typeChar();
}

function typeNextLine() {
  if (lineIndex < lines.length) {
    typeLine(lines[lineIndex], () => {
      lineIndex++;
      setTimeout(typeNextLine, 200); // pauza medzi riadkami
    });
  } else {
    // kurzor zostáva blikať na konci
    terminal.appendChild(cursor);
  }
}

// spusti animáciu po načítaní stránky
document.addEventListener('DOMContentLoaded', typeNextLine);
</script>

<style>
#terminal {
  background-color: #000;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 0 10px #00ff00;
  max-width: 800px;
  margin: 50px auto;
  white-space: pre-wrap;
  position: relative;
  min-height: 400px;
  color: #00cc66;
  font-family: monospace;
  overflow: hidden;
}

.cursor {
  display: inline-block;
  width: 10px;
  background-color: #00cc66;
  animation: blink 1s step-start infinite;
  vertical-align: bottom;
  margin-left: 2px;
}

@keyframes blink {
  50% { background-color: transparent; }
}
</style>
