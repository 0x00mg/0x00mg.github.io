---
layout: page
title: "About Me"
permalink: /about_me/
---

<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="UTF-8">
<title>About Me - Hacker Style</title>
<style>
  body {
    background-color: #0d0d0d;
    color: #00cc66;
    font-family: "Courier New", monospace;
    padding: 20px;
  }
  #terminal {
    background-color: #000;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 0 10px #00ff00;
    max-width: 800px;
    margin: auto;
    white-space: pre-wrap;
    position: relative;
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
</head>
<body>
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
let cursor = document.createElement('span');
cursor.className = 'cursor';
terminal.appendChild(cursor);

function typeLine(line, callback) {
  let charIndex = 0;
  function typeChar() {
    if (charIndex < line.length) {
      cursor.insertAdjacentText('beforebegin', line.charAt(charIndex));
      charIndex++;
      setTimeout(typeChar, 30);
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
      setTimeout(typeNextLine, 200);
    });
  }
}

typeNextLine();
</script>
</body>
</html>


