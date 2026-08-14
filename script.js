function updateMarginValue() {
  document.getElementById("marginValue").textContent =
    document.getElementById("margin").value;
}

/* ===== LOAD DICTIONARY ===== */

let wordSet = new Set();
let dictionaryReady = false;

fetch("word.txt")
  .then(response => response.text())
  .then(text => {
    const words = text.split(/\r?\n/).map(w => w.trim().toLowerCase());
    wordSet = new Set(words.filter(w => w.length > 0));

    dictionaryReady = true;
    document.getElementById("dictStatus").textContent =
      "Dictionary loaded: " + wordSet.size + " words";
  })
  .catch(() => {
    document.getElementById("dictStatus").textContent =
      "Dictionary failed to load.";
  });

/* ===== WORD CHAIN LOGIC (FULL FIXED VERSION) ===== */

function generateNeighbors(word) {
  const neighbors = [];
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  for (let i = 0; i < word.length; i++) {
    for (let c of alphabet) {
      if (c !== word[i]) {
        const newWord = word.slice(0, i) + c + word.slice(i + 1);
        neighbors.push(newWord.toLowerCase());
      }
    }
  }
  return neighbors;
}

// Bidirectional BFS (fastest possible)
function findShortestChain(start, end, margin) {
  const MAX_LENGTH = 18;

  const queueStart = [[start, [start], 0]];
  const queueEnd = [[end, [end], 0]];

  const visitedStart = new Map([[start, { path: [start], fake: 0 }]]);
  const visitedEnd = new Map([[end, { path: [end], fake: 0 }]]);

  while (queueStart.length > 0 && queueEnd.length > 0) {

    // Expand from START side
    const [wordS, pathS, fakeS] = queueStart.shift();

    if (pathS.length > MAX_LENGTH) break;

    for (const next of generateNeighbors(wordS)) {
      const isReal = wordSet.has(next);
      const newFake = isReal ? fakeS : fakeS + 1;
      if (newFake > margin) continue;

      const key = next.toLowerCase();
      if (!visitedStart.has(key)) {
        visitedStart.set(key, { path: [...pathS, next], fake: newFake });
        queueStart.push([next, [...pathS, next], newFake]);
      }

      if (visitedEnd.has(key)) {
        const endData = visitedEnd.get(key);
        const fullChain = [...pathS, next, ...endData.path.slice(1).reverse()];
        return fullChain;
      }
    }

    // Expand from END side
    const [wordE, pathE, fakeE] = queueEnd.shift();

    if (pathE.length > MAX_LENGTH) break;

    for (const next of generateNeighbors(wordE)) {
      const isReal = wordSet.has(next);
      const newFake = isReal ? fakeE : fakeE + 1;
      if (newFake > margin) continue;

      const key = next.toLowerCase();
      if (!visitedEnd.has(key)) {
        visitedEnd.set(key, { path: [...pathE, next], fake: newFake });
        queueEnd.push([next, [...pathE, next], newFake]);
      }

      if (visitedStart.has(key)) {
        const startData = visitedStart.get(key);
        const fullChain = [...startData.path, next, ...pathE.slice(1).reverse()];
        return fullChain;
      }
    }
  }

  return null;
}

function findChain() {
  const resultDiv = document.getElementById("result");

  if (!dictionaryReady) {
    resultDiv.textContent = "Dictionary still loading...";
    return;
  }

  const start = document.getElementById("startWord").value.trim().toLowerCase();
  const end = document.getElementById("endWord").value.trim().toLowerCase();
  const margin = parseInt(document.getElementById("margin").value, 10);

  if (start.length !== end.length) {
    resultDiv.textContent = "Start and end words must have the same length.";
    return;
  }

  const chain = findShortestChain(start, end, margin);

  if (!chain) {
    resultDiv.textContent = "No chain found.";
    return;
  }

  let html = `<strong>Shortest chain (length ${chain.length}):</strong><br>`;
  html += chain.map(w => {
    const isReal = wordSet.has(w);
    const cls = isReal ? "chain-word" : "chain-word fake";
    return `<span class="${cls}">${w}</span>`;
  }).join(" ➝ ");

  resultDiv.innerHTML = html;
}
