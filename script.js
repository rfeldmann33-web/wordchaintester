/* ===== REAL-WORD-ONLY CHAIN ENGINE ===== */

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

function findShortestChain(start, end) {
  const MAX_LENGTH = 18;

  const queueStart = [[start, [start]]];
  const queueEnd = [[end, [end]]];

  const visitedStart = new Map([[start, { path: [start] }]]);
  const visitedEnd = new Map([[end, { path: [end] }]]);

  while (queueStart.length > 0 && queueEnd.length > 0) {

    /* ===== Expand from START side ===== */
    const [wordS, pathS] = queueStart.shift();

    if (pathS.length > MAX_LENGTH) break;

    for (const next of generateNeighbors(wordS)) {
      if (!wordSet.has(next)) continue;   // ONLY real words allowed

      if (!visitedStart.has(next)) {
        visitedStart.set(next, { path: [...pathS, next] });
        queueStart.push([next, [...pathS, next]]);
      }

      if (visitedEnd.has(next)) {
        const endData = visitedEnd.get(next);
        const fullChain = [...pathS, next, ...endData.path.slice(1).reverse()];
        return fullChain;
      }
    }

    /* ===== Expand from END side ===== */
    const [wordE, pathE] = queueEnd.shift();

    if (pathE.length > MAX_LENGTH) break;

    for (const next of generateNeighbors(wordE)) {
      if (!wordSet.has(next)) continue;   // ONLY real words allowed

      if (!visitedEnd.has(next)) {
        visitedEnd.set(next, { path: [...pathE, next] });
        queueEnd.push([next, [...pathE, next]]);
      }

      if (visitedStart.has(next)) {
        const startData = visitedStart.get(next);
        const fullChain = [...startData.path, next, ...pathE.slice(1).reverse()];
        return fullChain;
      }
    }
  }

  return null;
}

function findChain() {
  const resultDiv = document.getElementById("result");

  const start = document.getElementById("startWord").value.trim().toLowerCase();
  const end = document.getElementById("endWord").value.trim().toLowerCase();

  if (start.length !== end.length) {
    resultDiv.textContent = "Start and end words must have the same length.";
    return;
  }

  const chain = findShortestChain
      const key = next;
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

    /* ===== Expand from END side ===== */
    const [wordE, pathE, fakeE] = queueEnd.shift();

    if (pathE.length > MAX_LENGTH) break;

    for (const next of generateNeighbors(wordE)) {
      const isReal = wordSet.has(next);
      const newFake = isReal ? fakeE : fakeE + 1;
      if (newFake > margin) continue;

      const key = next;
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
