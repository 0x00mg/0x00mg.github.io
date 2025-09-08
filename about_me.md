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
  "Company: IFT - InForm Technologies a.s.", 
  "Location: Bratislava",
  "----------------------------------------",
  "Loading profession modules...",
  "[OK] RIS & SCADA systems specialist loaded",
  "[OK] Daily operations initialized",
  "----------------------------------------",
  "Scanning hobbies...",
  "[*] Plastic Modeling",
  "[*] CTF Hack The Box",
  "[*] Electronics and technical experiments",
  "[*] MTB, SNB",
  "[*] Chess",
  "----------------------------------------",
  "Profile loaded successfully.",
  "Type 'help' for commands or 'exit' to logout..."
];

let lineIndex = 0;

function typeLine(line, callback) {
  let charIndex = 0;

  function typeChar() {
    if (charIndex < line.length) {
      terminal.insertAdjacentText('beforeend', line.charAt(charIndex));
      charIndex++;
      setTimeout(typeChar, 30);
    } else {
      terminal.insertAdjacentText('beforeend', '\n');
      terminal.scrollTop = terminal.scrollHeight;
      callback();
    }
  }

  typeChar();
}

function typeNextLine() {
  if (lineIndex < lines.length) {
    typeLine(lines[lineIndex], () => {
      lineIndex++;
      setTimeout(typeNextLine, 100);
    });
  } else {
    enableInput(); // po dokončení animácie zapneme vstup
  }
}

// Vytvorenie nového riadku pre vstup
function enableInput() {
  createInputLine();
}

function createInputLine() {
  const input = document.createElement('div');
  input.setAttribute('contenteditable', 'true');
  input.className = 'terminal-input';
  terminal.appendChild(input);
  input.focus();
  terminal.scrollTop = terminal.scrollHeight;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = input.textContent.trim();

      // Presunieme príkaz do starého riadku
      const commandLine = document.createElement('div');
      commandLine.textContent = command;
      commandLine.className = 'terminal-command';
      terminal.insertBefore(commandLine, input);

      processCommand(command);

      // Odstránime starý input a vytvoríme nový riadok
      input.remove();
      createInputLine();
    }
  });

  input.addEventListener('blur', () => input.focus());
}

function processCommand(cmd) {
  let output = '';
  switch(cmd.toLowerCase()) {
    case 'help':
      output = "Available commands: help, whoami, exit";
      break;
    case 'whoami':
      output = "Miroslav Gensor";
      break;
      case 'exit':
        output = "Logging out... goodbye...\n";
        terminal.insertAdjacentText('beforeend', output);
        terminal.scrollTop = terminal.scrollHeight;
      
        setTimeout(() => {
          // vymažeme obsah terminálu
          terminal.textContent = '';
      
          // vytvoríme nový blinkajúci input kurzor vľavo hore
          createInputLine();
        }, 3000);
        return;
    default:
      output = "Unknown command: " + cmd;
  }

  terminal.insertAdjacentText('beforeend', output + '\n');
  terminal.scrollTop = terminal.scrollHeight;
}
  
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
  color: #00cc66;
  font-family: monospace;
  overflow-y: auto;
  min-height: 400px;
}

.terminal-input {
  outline: none;
  display: block;
  min-width: 100%;
  color: #00cc66;
}

.terminal-command {
  color: #00cc66;
  white-space: pre-wrap;
}
</style>



<!--
<div id="terminal"></div>

<script>
const terminal = document.getElementById('terminal');

const lines = [
  "Initializing profile...",
  "----------------------------------------",
  "Username: Miroslav Gensor",
  "Education: Mechanik elektrotechnik, cislicova a riadiaca technika",  
  "Company: IFT - InForm Technologies a.s.",
  "Location: Bratislava",
  "----------------------------------------",
  "Loading profession modules...",
  "[OK] RIS & SCADA systems specialist loaded",
  "[OK] Daily operations initialized",
  "----------------------------------------",
  "Scanning hobbies...",
  "[*] Plastic Modeling",
  "[*] CTF Hack The Box",
  "[*] Electronics and technical experiments",
  "[*] MTB, SNB",
  "----------------------------------------",
  "Profile loaded successfully.",
  "Type 'help' for commands or 'exit' to logout..."
];

let lineIndex = 0;

// vytvoríme kurzor
let cursor = document.createElement('span');
cursor.className = 'cursor';
terminal.appendChild(cursor); // kurzor je stále posledný element

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
      setTimeout(typeNextLine, 100);
    });
  } else {
    enableInput(); // po dokončení animácie zapneme vstup
  }
}

// jednoduchý shell
function enableInput() {
  const input = document.createElement('span');
  input.setAttribute('contenteditable', 'true');
  input.className = 'terminal-input';
  terminal.appendChild(input);
  input.focus();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = input.textContent.trim();
      processCommand(command);
      input.textContent = '';
    }
  });
}

function processCommand(cmd) {
  if(cmd.toLowerCase() === 'exit') {
    // vypíšeme správu logout
    const msg = "Logging out... goodbye!\n";
    terminal.insertBefore(document.createTextNode(msg), cursor);
    terminal.scrollTop = terminal.scrollHeight;

    // po 3 sekundách vymažeme obsah, kurzor zostane
    setTimeout(() => {
      terminal.textContent = '';
      terminal.appendChild(cursor);
    }, 3000);

    return;
  }

    
  let output = '';
  switch(cmd.toLowerCase()) {
    case 'help':
      output = "Available commands: help, whoami, exit";
      break;
    case 'whoami':
      output = "Miroslav Gensor";
      break;
    default:
      output = "Unknown command: " + cmd;
  }

  terminal.insertBefore(document.createTextNode(output + '\n'), cursor);
  terminal.scrollTop = terminal.scrollHeight;
}

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
  overflow-y: auto;
}

.cursor {
  display: inline-block;
  width: 10px;
  background-color: #00cc66;
  animation: blink 1s step-start infinite;
  vertical-align: bottom;
  margin-left: 2px;
}

.terminal-input {
  outline: none;
  display: inline-block;
  min-width: 10px;
  color: #00cc66;
}

@keyframes blink {
  50% { background-color: transparent; }
}
</style>

-->
