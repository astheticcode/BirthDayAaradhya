// ===== Grab the elements we need =====
const openBtn = document.getElementById("openBtn");
const welcome = document.getElementById("welcome");
const main = document.getElementById("main");
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseMsg = document.getElementById("surpriseMsg");
const floaters = document.getElementById("floaters");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== 1. Floating hearts and stars =====
const SHAPES = ["♥", "✦", "★", "♡"];
const COLOURS = ["#f7a8c4", "#b99bf0", "#c9a35b", "#e68fb5"];

function spawnFloater() {
  const el = document.createElement("span");
  el.className = "floater";
  el.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = 14 + Math.random() * 22 + "px";
  el.style.color = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  el.style.animationDuration = 8 + Math.random() * 8 + "s";
  floaters.appendChild(el);
  el.addEventListener("animationend", () => el.remove()); // clean up so the page stays fast
}
if (!reduceMotion) setInterval(spawnFloater, 900);

// ===== 2. Confetti (drawn on a canvas) =====
let pieces = [];
let running = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  if (reduceMotion) return;
  for (let i = 0; i < 160; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.4,
      size: 6 + Math.random() * 7,
      speed: 2 + Math.random() * 3.5,
      drift: Math.random() * 2 - 1,
      spin: Math.random() * 6,
      colour: COLOURS[Math.floor(Math.random() * COLOURS.length)]
    });
  }
  if (!running) { running = true; requestAnimationFrame(drawConfetti); }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach(p => {
    p.y += p.speed;
    p.x += p.drift;
    p.spin += 0.1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.spin);
    ctx.fillStyle = p.colour;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  });
  pieces = pieces.filter(p => p.y < canvas.height + 20); // remove pieces that fell off screen
  if (pieces.length) requestAnimationFrame(drawConfetti);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

// ===== 3. Open Your Surprise button =====
openBtn.addEventListener("click", () => {
  welcome.classList.add("leave");
  launchConfetti();
  setTimeout(() => {
    welcome.hidden = true;
    main.hidden = false;
    main.classList.add("show");
    window.scrollTo(0, 0);
  }, 650);
});

// ===== 4. Click for a Surprise button =====
surpriseBtn.addEventListener("click", () => {
  surpriseMsg.classList.add("open");
  surpriseBtn.textContent = "Again! 🎉";   // lets her replay the confetti
  launchConfetti();
});

// ===== 5. Missing photos should never break the page =====
document.querySelectorAll(".photo img").forEach(img => {
  img.addEventListener("error", () => img.closest(".photo").classList.add("missing"));
});