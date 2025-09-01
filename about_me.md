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

// kurzor bude vždy na konci
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
  } else {
    // kurzor je stále na konci, animácia blink sa aplikuje cez CSS
    terminal.appendChild(cursor);
  }
}

typeNextLine();
