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
    color: #33ff33;
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

function typeLine(line, callback) {
  let charIndex = 0;
  function typeChar() {
    if (charIndex < line.length) {
      terminal.innerHTML += line.charAt(charIndex);
      charIndex++;
      setTimeout(typeChar, 30);
    } else {
      terminal.innerHTML += '\n';
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

