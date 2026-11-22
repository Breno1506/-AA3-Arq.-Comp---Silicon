/* =========================================================
   PARTE 1: CANVAS PCB, ÁUDIO, TEMAS E NAVEGAÇÃO
   ========================================================= */
const pcbCanvas = document.getElementById("pcb-canvas");
const pctx = pcbCanvas.getContext("2d");
let traces = [];
let sparks = [];

function resizePCB() {
    pcbCanvas.width = window.innerWidth;
    pcbCanvas.height = window.innerHeight;
    buildTraces();
}

function buildTraces() {
    traces = [];
    const count = Math.floor(pcbCanvas.width / 85);
    for (let i = 0; i < count; i++) {
        const startX = Math.random() * pcbCanvas.width;
        const startY = Math.random() * pcbCanvas.height;
        const pts = [{ x: startX, y: startY }];
        let cx = startX;
        let cy = startY;

        for (let s = 0; s < 4; s++) {
            const step = 60 + Math.random() * 110;
            const angle = (Math.floor(Math.random() * 8) * Math.PI) / 4;
            cx += Math.cos(angle) * step;
            cy += Math.sin(angle) * step;
            pts.push({ x: cx, y: cy });
        }

        traces.push({
            pts,
            pulsePos: Math.random(),
            speed: 0.002 + Math.random() * 0.004
        });
    }
}

function spawnSpark(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 1.5 + Math.random() * 3.5;
        sparks.push({
            x,
            y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            life: 1
        });
    }
}

window.addEventListener("resize", resizePCB);
window.addEventListener("click", (e) => spawnSpark(e.clientX, e.clientY, 8));
resizePCB();

function drawPCB() {
    pctx.clearRect(0, 0, pcbCanvas.width, pcbCanvas.height);
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#00f59b";
    const accent2 = styles.getPropertyValue("--accent-2").trim() || "#38bdf8";

    traces.forEach((t) => {
        pctx.beginPath();
        t.pts.forEach((p, idx) => {
            if (idx === 0) pctx.moveTo(p.x, p.y);
            else pctx.lineTo(p.x, p.y);
        });
        pctx.strokeStyle = "rgba(255, 255, 255, 0.045)";
        pctx.lineWidth = 1.5;
        pctx.stroke();

        const last = t.pts[t.pts.length - 1];
        pctx.beginPath();
        pctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
        pctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        pctx.fill();

        t.pulsePos += t.speed;
        if (t.pulsePos > 1) t.pulsePos = 0;

        const segCount = t.pts.length - 1;
        const scaled = t.pulsePos * segCount;
        const segIdx = Math.min(segCount - 1, Math.floor(scaled));
        const localT = scaled - segIdx;
        const p1 = t.pts[segIdx];
        const p2 = t.pts[segIdx + 1];
        const px = p1.x + (p2.x - p1.x) * localT;
        const py = p1.y + (p2.y - p1.y) * localT;

        pctx.beginPath();
        pctx.arc(px, py, 2.4, 0, Math.PI * 2);
        pctx.fillStyle = accent;
        pctx.fill();
    });

    for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 0.035;
        if (sp.life <= 0) {
            sparks.splice(i, 1);
            continue;
        }
        pctx.beginPath();
        pctx.arc(sp.x, sp.y, 2 * sp.life, 0, Math.PI * 2);
        pctx.fillStyle = i % 2 === 0 ? accent : accent2;
        pctx.fill();
    }

    requestAnimationFrame(drawPCB);
}
drawPCB();

let soundEnabled = true;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq, dur = 0.05, type = "triangle", vol = 0.035) {
    if (!soundEnabled) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
}

const sfx = {
    tap: () => beep(640, 0.035, "triangle", 0.03),
    ok: () => {
        beep(587.33, 0.08, "sine", 0.05);
        setTimeout(() => beep(880, 0.13, "sine", 0.05), 70);
    },
    err: () => beep(170, 0.14, "sawtooth", 0.04),
    win: () => {
        [523.25, 659.25, 783.99, 1046.5].forEach((n, idx) => {
            setTimeout(() => beep(n, 0.22, "triangle", 0.06), idx * 90);
        });
    }
};

document.getElementById("btn-audio-toggle").addEventListener("click", (e) => {
    soundEnabled = !soundEnabled;
    e.target.textContent = `SOM: ${soundEnabled ? "ON" : "OFF"}`;
});

document.querySelectorAll("[data-pcb-theme]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const theme = btn.dataset.pcbTheme;
        document.documentElement.setAttribute("data-pcb", theme);
        document.querySelectorAll("[data-pcb-theme]").forEach((b) => {
            b.classList.toggle("active", b.dataset.pcbTheme === theme);
        });
        sfx.tap();
    });
});

document.getElementById("cpu-showcase").addEventListener("click", (e) => {
    sfx.ok();
    const ghz = (3.8 + Math.random() * 1.4).toFixed(2);
    document.getElementById("clock-hz").textContent = `${ghz} GHz`;
    spawnSpark(e.clientX, e.clientY, 22);
});

const landingView = document.getElementById("landing-view");
const workspaceShell = document.getElementById("workspace-shell");

function openWorkspace(stageId) {
    sfx.ok();
    landingView.classList.add("hidden");
    workspaceShell.classList.remove("hidden");
    switchStage(stageId);
}

function switchStage(stageId) {
    document.querySelectorAll(".mode-tab").forEach((t) => {
        t.classList.toggle("active", t.dataset.target === stageId);
    });
    document.querySelectorAll(".stage-container").forEach((s) => s.classList.add("hidden"));
    document.getElementById(stageId).classList.remove("hidden");

    if (stageId === "crossword-stage" && typeof matrix !== "undefined") {
        matrix[WORDS[0].row][WORDS[0].col]?.inputEl?.focus();
    } else if (stageId === "quiz-stage" && typeof quizStarted !== "undefined" && !quizStarted) {
        startQuiz();
    }
}

document.getElementById("enter-crossword").addEventListener("click", () => openWorkspace("crossword-stage"));
document.getElementById("enter-quiz").addEventListener("click", () => openWorkspace("quiz-stage"));
document.getElementById("btn-to-landing").addEventListener("click", () => {
    sfx.tap();
    if (typeof quizTimerInterval !== "undefined") clearInterval(quizTimerInterval);
    workspaceShell.classList.add("hidden");
    landingView.classList.remove("hidden");
});

document.querySelectorAll(".mode-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        sfx.tap();
        switchStage(tab.dataset.target);
    });
});

/* =========================================================
   PARTE 2: CRUZADINHA DE ARQUITETURA COMPUTACIONAL (14 PALAVRAS)
   ========================================================= */
const GRID_DIM = 16;
const WORDS = [
    { number: 1, word: "MICROCONTROLADOR", direction: "across", row: 0, col: 0, clue: "Chip completo com processador, memória e portas de entrada e saída integrados." },
    { number: 2, word: "MEMORIADEMASSA", direction: "down", row: 0, col: 0, clue: "Armazenamento secundário não volátil de grande capacidade, como HD ou SSD." },
    { number: 3, word: "CACHE", direction: "down", row: 0, col: 2, clue: "Memória ultrarrápida próxima ao processador que guarda dados acessados com frequência." },
    { number: 4, word: "ROM", direction: "down", row: 0, col: 3, clue: "Memória não volátil apenas de leitura que guarda instruções básicas de inicialização." },
    { number: 5, word: "RAM", direction: "down", row: 0, col: 13, clue: "Memória principal volátil de acesso aleatório usada durante a execução de programas." },
    { number: 6, word: "ULA", direction: "across", row: 2, col: 12, clue: "Parte do processador responsável pelos cálculos matemáticos e testes lógicos." },
    { number: 7, word: "DMA", direction: "across", row: 4, col: 0, clue: "Recurso que permite periféricos transferirem dados à memória sem sobrecarregar o processador." },
    { number: 8, word: "ADDRESSBUS", direction: "down", row: 4, col: 2, clue: "Via unidirecional que transporta a localização física de onde ler ou gravar dados." },
    { number: 9, word: "REGISTRADORES", direction: "across", row: 6, col: 0, clue: "Pequenas unidades de armazenamento interno mais rápidas que existem dentro do processador." },
    { number: 10, word: "QUADCORE", direction: "down", row: 6, col: 12, clue: "Processador equipado com quatro núcleos físicos independentes para executar tarefas simultâneas." },
    { number: 11, word: "FLASH", direction: "across", row: 11, col: 0, clue: "Memória não volátil regravável em blocos, muito usada em pendrives e SSDs." },
    { number: 12, word: "DATABUS", direction: "across", row: 13, col: 0, clue: "Via bidirecional por onde trafegam as informações entre processador, memória e periféricos." },
    { number: 13, word: "CPU", direction: "down", row: 13, col: 8, clue: "Cérebro do computador que busca, decodifica e executa as instruções dos programas." },
    { number: 14, word: "DUALCORE", direction: "across", row: 15, col: 7, clue: "Processador que possui dois núcleos físicos trabalhando em conjunto no mesmo chip." }
];

const gridContainer = document.getElementById("crossword-grid");
const acrossList = document.getElementById("clues-across");
const downList = document.getElementById("clues-down");
const scoreCounter = document.getElementById("score-counter");

const matrix = Array.from({ length: GRID_DIM }, () =>
    Array.from({ length: GRID_DIM }, () => ({
        letter: null,
        number: null,
        words: [],
        inputEl: null,
        cellEl: null
    }))
);

let currentDir = "across";
let activePos = { r: 0, c: 0 };

function buildCrossword() {
    WORDS.forEach((item) => {
        for (let i = 0; i < item.word.length; i++) {
            const r = item.direction === "across" ? item.row : item.row + i;
            const c = item.direction === "across" ? item.col + i : item.col;
            matrix[r][c].letter = item.word[i];
            matrix[r][c].words.push(item);
            if (i === 0) matrix[r][c].number = item.number;
        }
    });

    gridContainer.innerHTML = "";
    for (let r = 0; r < GRID_DIM; r++) {
        for (let c = 0; c < GRID_DIM; c++) {
            const cell = matrix[r][c];
            const div = document.createElement("div");
            div.className = "cell";

            if (!cell.letter) {
                div.classList.add("empty");
            } else {
                div.classList.add("pin-cell");
                if (cell.number !== null) {
                    const idx = document.createElement("span");
                    idx.className = "cell-idx";
                    idx.textContent = cell.number;
                    div.appendChild(idx);
                }

                const inp = document.createElement("input");
                inp.type = "text";
                inp.maxLength = 1;
                inp.autocomplete = "off";
                inp.addEventListener("focus", () => onCellFocus(r, c));
                inp.addEventListener("input", (e) => onCellInput(e, r, c));
                inp.addEventListener("keydown", (e) => onCellKey(e, r, c));

                div.appendChild(inp);
                cell.inputEl = inp;
            }
            cell.cellEl = div;
            gridContainer.appendChild(div);
        }
    }

    acrossList.innerHTML = "";
    downList.innerHTML = "";
    WORDS.forEach((item) => {
        const li = document.createElement("li");
        li.className = "clue-card";
        li.dataset.number = item.number;
        li.dataset.direction = item.direction;
        li.innerHTML = `<span class="clue-tag-num">${item.number}.</span> ${item.clue}`;

        li.addEventListener("click", () => {
            sfx.tap();
            currentDir = item.direction;
            highlightActiveWord(item);
            matrix[item.row][item.col].inputEl.focus();
        });

        (item.direction === "across" ? acrossList : downList).appendChild(li);
    });

    highlightActiveWord(WORDS[0]);
}

function onCellFocus(r, c) {
    activePos = { r, c };
    const cellWords = matrix[r][c].words;
    if (!cellWords.length) return;
    const match = cellWords.find((w) => w.direction === currentDir) || cellWords[0];
    currentDir = match.direction;
    highlightActiveWord(match);
}

function highlightActiveWord(wordObj) {
    document.querySelectorAll(".cell.word-band").forEach((el) => el.classList.remove("word-band"));
    document.querySelectorAll(".clue-card.selected").forEach((el) => el.classList.remove("selected"));

    for (let i = 0; i < wordObj.word.length; i++) {
        const r = wordObj.direction === "across" ? wordObj.row : wordObj.row + i;
        const c = wordObj.direction === "across" ? wordObj.col + i : wordObj.col;
        matrix[r][c].cellEl.classList.add("word-band");
    }

    document.getElementById("current-dir-tag").textContent =
        `${wordObj.direction === "across" ? "HORIZONTAL" : "VERTICAL"} ${wordObj.number}`;
    document.getElementById("current-clue-text").textContent = wordObj.clue;

    const card = document.querySelector(`.clue-card[data-number="${wordObj.number}"][data-direction="${wordObj.direction}"]`);
    if (card) {
        card.classList.add("selected");
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

function onCellInput(e, r, c) {
    const clean = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    e.target.value = clean;
    const cellEl = matrix[r][c].cellEl;
    cellEl.classList.remove("correct", "wrong", "pop");
    void cellEl.offsetWidth;
    cellEl.classList.add("pop");

    if (clean) {
        sfx.tap();
        advanceFocus(r, c, 1);
    }
}

function onCellKey(e, r, c) {
    if (e.key === " ") {
        e.preventDefault();
        if (matrix[r][c].words.length > 1) {
            currentDir = currentDir === "across" ? "down" : "across";
            onCellFocus(r, c);
            sfx.tap();
        }
    } else if (e.key === "Enter") {
        e.preventDefault();
        verifyAnswers();
    } else if (e.key === "Backspace" && !e.target.value) {
        e.preventDefault();
        advanceFocus(r, c, -1);
    } else if (e.key === "ArrowRight") {
        e.preventDefault(); currentDir = "across"; moveCursor(r, c, 0, 1);
    } else if (e.key === "ArrowLeft") {
        e.preventDefault(); currentDir = "across"; moveCursor(r, c, 0, -1);
    } else if (e.key === "ArrowDown") {
        e.preventDefault(); currentDir = "down"; moveCursor(r, c, 1, 0);
    } else if (e.key === "ArrowUp") {
        e.preventDefault(); currentDir = "down"; moveCursor(r, c, -1, 0);
    }
}

function advanceFocus(r, c, step) {
    const nr = currentDir === "down" ? r + step : r;
    const nc = currentDir === "across" ? c + step : c;
    if (matrix[nr]?.[nc]?.inputEl) matrix[nr][nc].inputEl.focus();
}

function moveCursor(r, c, dr, dc) {
    const nr = r + dr;
    const nc = c + dc;
    if (matrix[nr]?.[nc]?.inputEl) matrix[nr][nc].inputEl.focus();
}

function revealSingleLetter() {
    const cell = matrix[activePos.r]?.[activePos.c];
    if (!cell?.inputEl) return;
    cell.inputEl.value = cell.letter;
    cell.cellEl.classList.remove("wrong");
    cell.cellEl.classList.add("correct");
    sfx.ok();
    advanceFocus(activePos.r, activePos.c, 1);
}

document.getElementById("btn-hint-letter").addEventListener("click", revealSingleLetter);

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "d" && document.activeElement.tagName !== "INPUT") {
        revealSingleLetter();
    }
});

function verifyAnswers() {
    let solvedTotal = 0;

    for (let r = 0; r < GRID_DIM; r++) {
        for (let c = 0; c < GRID_DIM; c++) {
            matrix[r][c].cellEl?.classList.remove("correct", "wrong");
        }
    }

    const checks = WORDS.map((item) => {
        let isRight = true;
        let hasInput = false;
        const cells = [];

        for (let i = 0; i < item.word.length; i++) {
            const r = item.direction === "across" ? item.row : item.row + i;
            const c = item.direction === "across" ? item.col + i : item.col;
            const cell = matrix[r][c];
            const val = cell.inputEl.value.toUpperCase();
            if (val !== "") hasInput = true;
            if (val !== item.word[i]) isRight = false;
            cells.push(cell);
        }

        const card = document.querySelector(`.clue-card[data-number="${item.number}"][data-direction="${item.direction}"]`);
        if (isRight) {
            solvedTotal++;
            card?.classList.add("solved");
        } else {
            card?.classList.remove("solved");
        }

        return { isRight, hasInput, cells };
    });

    checks.forEach(({ isRight, hasInput, cells }) => {
        if (!isRight && hasInput) {
            cells.forEach((cell) => {
                if (cell.inputEl.value !== "") cell.cellEl.classList.add("wrong");
            });
        }
    });

    checks.forEach(({ isRight, cells }) => {
        if (isRight) {
            cells.forEach((cell) => {
                cell.cellEl.classList.remove("wrong");
                cell.cellEl.classList.add("correct");
            });
        }
    });

    scoreCounter.textContent = `${solvedTotal} de ${WORDS.length} palavras`;

    const bezelRect = document.getElementById("socket-bezel").getBoundingClientRect();
    if (solvedTotal === WORDS.length) {
        sfx.win();
        spawnSpark(bezelRect.left + bezelRect.width / 2, bezelRect.top + bezelRect.height / 2, 45);
        document.getElementById("victory-modal").classList.remove("hidden");
    } else if (solvedTotal > 0) {
        sfx.ok();
        spawnSpark(bezelRect.left + bezelRect.width / 2, bezelRect.top + 30, 18);
    } else {
        sfx.err();
    }
}

function resetCrossword() {
    sfx.tap();
    for (let r = 0; r < GRID_DIM; r++) {
        for (let c = 0; c < GRID_DIM; c++) {
            const cell = matrix[r][c];
            if (cell.inputEl) {
                cell.inputEl.value = "";
                cell.cellEl.classList.remove("correct", "wrong");
            }
        }
    }
    document.querySelectorAll(".clue-card.solved").forEach((el) => el.classList.remove("solved"));
    scoreCounter.textContent = `0 de ${WORDS.length} palavras`;
    highlightActiveWord(WORDS[0]);
    matrix[WORDS[0].row][WORDS[0].col].inputEl.focus();
}

document.getElementById("btn-check").addEventListener("click", verifyAnswers);
document.getElementById("btn-reset").addEventListener("click", resetCrossword);
document.getElementById("btn-victory-close").addEventListener("click", () => {
    document.getElementById("victory-modal").classList.add("hidden");
});
document.getElementById("btn-victory-quiz").addEventListener("click", () => {
    document.getElementById("victory-modal").classList.add("hidden");
    switchStage("quiz-stage");
});

buildCrossword();