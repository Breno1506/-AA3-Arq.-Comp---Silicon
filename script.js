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