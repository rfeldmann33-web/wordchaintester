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

/* ===== WORD CHAIN LOGIC ===== */

function generateNeighbors(word) {
  const neighbors = [];
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  for (let i = 0; i < word.length; i++) {
    for (let c of alphabet) {
      if (c !== word[i]) {
        const newWord = word.slice(0, i) + c + word.slice(i + 1);
        neighbors.push(newWord);
      }
    }
  }
  return neighbors;
}

function allChains(start, end, margin) {
  const MAX_LENGTH = 18;
  const results = [];
  const queue = [[start, [start], 0]];

  while (queue.length > 0) {
    const [word, path, fakeCount] = queue.shift();

    if (path.length > MAX_LENGTH) continue;

    if (word === end) {
      results.push({ chain: path, fakeCount });
      continue;
    }

    for (const next of generateNeighbors(word)) {
      const isReal = wordSet.has(next);
      const newFakeCount = isReal ? fakeCount : fakeCount + 1;

      if (newFakeCount > margin) continue;
      if (path.includes(next)) continue;

      queue.push([next, [...path, next], newFakeCount]);
    }
  }

  return results;
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

  const chains = allChains(start, end, margin);

  if (chains.length === 0) {
    resultDiv.textContent = "No chains found.";
    return;
  }

  chains.sort((a, b) => a.chain.length - b.chain.length);
  const shortest = chains[0];

  let html = `<strong>Shortest chain (length ${shortest.chain.length}):</strong><br>`;
  html += shortest.chain.map(w => {
    const isReal = wordSet.has(w);
    const cls = isReal ? "chain-word" : "chain-word fake";
    return `<span class="${cls}">${w}</span>`;
  }).join(" ➝ ");

  html += `<br><br><strong>Total chains found:</strong> ${chains.length}<br><br>`;

  resultDiv.innerHTML = html;
}
