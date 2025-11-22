
// =================================================================
// GAME LOGIC - Main Application
// =================================================================

// --- Global State ---
let playerMoney = 100;
let isDevMode = false;
let currentBet = null;
let emptyCupIndex = null;
let wheelSectors = [];
let rouletteNumbers = [];
let roulettePockets = [];
let isSpinning = false;
let animationFrameId = null;
let isLuckySpinInitialized = false;
let isSevensHeavenInitialized = false;
let isCupGameInitialized = false;

// --- DOM Elements ---
const balanceElement = document.getElementById("balance");
const mainMenu = document.getElementById("main-menu");
const gameScreens = document.querySelectorAll(".game-screen");
const devModeBtn = document.getElementById("dev-mode-btn");
const jumpscareImage = document.getElementById("jumpscare-image");
const particleContainer = document.getElementById("particle-container");
const customAlertOverlay = document.getElementById('custom-alert-overlay');
const customAlertMessage = document.getElementById('custom-alert-message');
const customAlertClose = document.getElementById('custom-alert-close');

// Navigation
const luckySpinBtn = document.getElementById("lucky-spin-btn");
const sevensHeavenBtn = document.getElementById("sevens-heaven-btn");
const cupFortuneBtn = document.getElementById("cup-fortune-btn");
const backButtons = document.querySelectorAll(".back-btn");

// Game 1: Lucky Spin
const wheel = document.getElementById("wheel");
const wheelPointer = document.querySelector(".wheel-pointer");
const spinBtn = document.querySelector("#lucky-spin .spin-btn");
const spinResult = document.getElementById("spin-result");

// Game 2: Sevens Heaven
const rouletteWheel = document.getElementById("roulette-wheel");
const rouletteBall = document.getElementById("roulette-ball");
const bet6Btn = document.getElementById("bet-6");
const bet7Btn = document.getElementById("bet-7");
const rollRouletteBtn = document.querySelector("#sevens-heaven .roll-roulette-btn");
const rouletteResult = document.getElementById("roulette-result");

// Game 3: Cup of Fortune
const cupContainer = document.getElementById("cup-container");
const playCupBtn = document.querySelector("#cup-fortune .play-cup-btn");
const cupResult = document.getElementById("cup-result");

// Easing function
function easeOutQuint(x) {
  return 1 - Math.pow(1 - x, 5);
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", init);

function init() {
  loadPlayerMoney();
  setupEventListeners();
  updateBalance();
}

// --- Custom Alert ---
function showAlert(message) {
    customAlertMessage.textContent = message;
    customAlertOverlay.classList.add('visible');
}

// --- Event Listeners ---
function setupEventListeners() {
    customAlertClose.addEventListener('click', () => {
        customAlertOverlay.classList.remove('visible');
    });

    luckySpinBtn.addEventListener("click", () => { playClickSound(); showGame("lucky-spin"); });
    sevensHeavenBtn.addEventListener("click", () => { playClickSound(); showGame("sevens-heaven"); });
    cupFortuneBtn.addEventListener("click", () => { playClickSound(); showGame("cup-fortune"); });

    backButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            playClickSound();
            cancelAnimationFrame(animationFrameId);
            isSpinning = false;
            showMainMenu();
        });
    });

    devModeBtn.addEventListener("click", () => {
        const password = prompt("Enter developer password:");
        if (password === "67") {
            isDevMode = !isDevMode;
            showAlert("Developer mode " + (isDevMode ? "activated. Games are now free to play." : "deactivated. Games are no longer free to play."));
            devModeBtn.textContent = isDevMode ? "Dev Mode: ON" : "Developer Mode";
            devModeBtn.classList.toggle('active', isDevMode);
        } else if (password === "root") {
            playerMoney = Infinity;
            updateBalance();
            showAlert("Infinite money enabled! You are now the casino.");
        } else if (password === "jumpscare") {
            jumpscareImage.classList.add("jumpscare");
            jumpscareImage.classList.remove("hidden");
            setTimeout(() => {
                jumpscareImage.classList.remove("jumpscare");
                jumpscareImage.classList.add("hidden");
            }, 500);
        } else {
            showAlert("Incorrect password. Access denied.");
        }
    });

    spinBtn.addEventListener("click", () => { playClickSound(); playLuckySpin(); });
    bet6Btn.addEventListener("click", () => { playClickSound(); setBet(6); });
    bet7Btn.addEventListener("click", () => { playClickSound(); setBet(7); });
    rollRouletteBtn.addEventListener("click", () => { playClickSound(); playSevensHeaven(); });
    playCupBtn.addEventListener("click", () => { playClickSound(); startCupGame(); });
}

// --- Navigation & State ---
function showMainMenu() {
  mainMenu.style.display = "block";
  gameScreens.forEach(screen => screen.style.display = "none");
  resetAllGameStates();
}

function showGame(gameId) {
  mainMenu.style.display = "none";
  gameScreens.forEach(screen => screen.style.display = screen.id === gameId ? "block" : "none");
  if (gameId === 'lucky-spin' && !isLuckySpinInitialized) { initializeLuckySpin(); isLuckySpinInitialized = true; }
  if (gameId === 'sevens-heaven' && !isSevensHeavenInitialized) { initializeSevensHeaven(); isSevensHeavenInitialized = true; }
  if (gameId === 'cup-fortune' && !isCupGameInitialized) { initializeCupGame(); isCupGameInitialized = true; }
}

function resetAllGameStates() {
    isSpinning = false;
    cancelAnimationFrame(animationFrameId);
    // Additional reset logic can be added here if needed
}

// --- Money & Balance ---
function loadPlayerMoney() {
  const savedMoney = localStorage.getItem("playerMoney");
  if (savedMoney) playerMoney = parseInt(savedMoney, 10);
}

function updateMoney(amount) {
  if (isDevMode) return;
  playerMoney += amount;
  localStorage.setItem("playerMoney", playerMoney);
  updateBalance();
}

function updateBalance() {
  balanceElement.textContent = `Balance: $${playerMoney}`;
}

function checkCost(cost) {
  if (isDevMode || playerMoney >= cost) return true;
  showAlert("You don't have enough funds to play this game.");
  return false;
}

// --- Visual Effects ---
function triggerCoinShower() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.width = `${Math.floor(Math.random() * 10) + 8}px`;
        particle.style.height = particle.style.width;
        particleContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 3000);
    }
}

// =================================================================
// GAME-SPECIFIC LOGIC
// =================================================================

// --- Game 1: Lucky Spin ---
function initializeLuckySpin() {
    wheelSectors = [
        { color: "#B22222", label: "RED", prize: 0 }, { color: "#FFD700", label: "GOLD", prize: 20 },
        { color: "#4682B4", label: "BLUE", prize: 5 }, { color: "#B22222", label: "RED", prize: 0 },
        { color: "#4682B4", label: "BLUE", prize: 5 }, { color: "#B22222", label: "RED", prize: 0 },
        { color: "#4682B4", label: "BLUE", prize: 5 }, { color: "#B22222", label: "RED", prize: 0 },
    ];
    const sectorAngle = 360 / wheelSectors.length;
    const gradientParts = wheelSectors.map((s, i) => `${s.color} ${i * sectorAngle}deg ${(i + 1) * sectorAngle}deg`);
    wheel.style.backgroundImage = `conic-gradient(${gradientParts.join(', ')})`;
}

function playLuckySpin() {
    if (isSpinning || !checkCost(5)) return;
    isSpinning = true;
    playSpinSound();
    updateMoney(-5);
    spinResult.textContent = "Spinning...";
    const outcome = Math.random() < 0.5 ? "RED" : Math.random() < 0.875 ? "BLUE" : "GOLD";
    const winningSectors = wheelSectors.map((s, i) => ({...s, index: i})).filter(s => s.label === outcome);
    const { index: winningIndex, prize, label: chosenLabel } = winningSectors[Math.floor(Math.random() * winningSectors.length)];
    const sectorAngle = 360 / wheelSectors.length;
    const randomOffsetInSector = (Math.random() - 0.5) * (sectorAngle * 0.8);
    const targetAngle = (winningIndex * sectorAngle) + (sectorAngle / 2) + randomOffsetInSector;
    const finalRotation = (5 * 360) + (360 - targetAngle);

    let startTime = null;
    wheel.style.transition = 'none';
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 5000, 1);
        const currentAngle = easeOutQuint(progress) * finalRotation;
        wheel.style.transform = `rotate(${currentAngle}deg)`;
        if (progress < 1) animationFrameId = requestAnimationFrame(animate);
        else endLuckySpin(prize, chosenLabel);
    }
    animationFrameId = requestAnimationFrame(animate);
}

function endLuckySpin(prize, label) {
    updateMoney(prize);
    const netGain = prize - 5;
    spinResult.textContent = `Landed on ${label}! You ${netGain >= 0 ? 'won' : 'lost'} $${Math.abs(netGain)}.`;
    if (netGain > 0) { playWinSound(); triggerCoinShower(); } else { playLoseSound(); }
    isSpinning = false;
}

// --- Game 2: Sevens Heaven ---
function initializeSevensHeaven() {
    rouletteWheel.innerHTML = '';
    roulettePockets = [];
    const totalNumbers = 12;
    const pocketRadius = (rouletteWheel.clientWidth / 2) * 0.75;
    rouletteNumbers = Array.from({ length: totalNumbers }, (_, i) => (i % 2 === 0 ? 6 : 7));
    const track = document.createElement("div");
    track.className = "roulette-track";
    rouletteWheel.appendChild(track);
    rouletteNumbers.forEach((number, i) => {
        const angle = (i * 360) / totalNumbers;
        const pocket = document.createElement("div");
        pocket.className = "roulette-pocket";
        pocket.textContent = number;
        const x = Math.cos((angle - 90) * (Math.PI / 180)) * pocketRadius + (rouletteWheel.clientWidth / 2) - 15;
        const y = Math.sin((angle - 90) * (Math.PI / 180)) * pocketRadius + (rouletteWheel.clientHeight / 2) - 15;
        pocket.style.left = `${x}px`;
        pocket.style.top = `${y}px`;
        pocket.dataset.angle = angle;
        rouletteWheel.appendChild(pocket);
        roulettePockets.push(pocket);
    });
    const center = document.createElement("div");
    center.className = "roulette-center";
    center.textContent = "7";
    rouletteWheel.appendChild(center);
}

function setBet(number) {
  if (isSpinning) return;
  currentBet = number;
  bet6Btn.classList.toggle("active", number === 6);
  bet7Btn.classList.toggle("active", number === 7);
}

function playSevensHeaven() {
    if (!currentBet) { showAlert("Please place a bet on 6 or 7 first!"); return; }
    if (isSpinning || !checkCost(10)) return;
    isSpinning = true;
    playSpinSound();
    updateMoney(-10);
    rouletteResult.textContent = "Spinning...";
    const winningNumber = Math.random() < 0.5 ? 6 : 7;
    const winningPockets = roulettePockets.map((p, i) => ({...p, index: i})).filter(p => rouletteNumbers[p.index] === winningNumber);
    const { index: winningIndex } = winningPockets[Math.floor(Math.random() * winningPockets.length)];
    const pocketSize = 360 / rouletteNumbers.length;
    const finalBallAngle = winningIndex * pocketSize;
    const wheelRotations = 1;
    const finalWheelAngle = (wheelRotations * 360) + (360 - finalBallAngle);
    let startTime = null;
    rouletteWheel.style.transition = 'none';
    rouletteBall.style.transition = 'none';
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 4000, 1);
        const easedProgress = easeOutQuint(progress);
        const currentWheelAngle = easedProgress * finalWheelAngle;
        rouletteWheel.style.transform = `rotate(${currentWheelAngle}deg)`;
        const ballStartAngle = 0;
        const ballEndAngle = finalWheelAngle + finalBallAngle;
        const currentBallAngle = ballStartAngle - (easedProgress * (ballEndAngle - ballStartAngle));
        const startRadius = 135;
        const endRadius = (rouletteWheel.clientWidth / 2) * 0.75;
        const currentRadius = startRadius + (easedProgress * (endRadius - startRadius));
        const ballX = Math.cos((currentBallAngle - 90) * (Math.PI / 180)) * currentRadius;
        const ballY = Math.sin((currentBallAngle - 90) * (Math.PI / 180)) * currentRadius;
        if(rouletteBall) rouletteBall.style.transform = `translate(${ballX}px, ${ballY}px)`;
        if (progress < 1) animationFrameId = requestAnimationFrame(animate);
        else endSevensHeaven(winningIndex, winningNumber);
    }
    animationFrameId = requestAnimationFrame(animate);
}

function endSevensHeaven(winningIndex, winningNumber) {
    const prize = currentBet === winningNumber ? 20 : 0;
    updateMoney(prize);
    rouletteResult.textContent = `Ball landed on ${winningNumber}! You ${prize > 0 ? 'won' : 'lost'} $${prize > 0 ? 10 : 10}.`;
    if (prize > 0) { playWinSound(); triggerCoinShower(); } else { playLoseSound(); }
    isSpinning = false;
}

// --- Game 3: Cup of Fortune ---
function initializeCupGame() {
    cupContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        const cup = document.createElement("div");
        cup.className = "cup";
        cup.dataset.index = i;
        cup.addEventListener("click", (e) => { playClickSound(); handleCupClick(e); });
        cupContainer.appendChild(cup);
    }
}

function startCupGame() {
    if (isSpinning || !checkCost(7)) return;
    isSpinning = true;
    playSpinSound();
    updateMoney(-7);

    // Reset cups before starting a new round
    document.querySelectorAll(".cup").forEach(c => {
        c.classList.remove("cup-flip", "cup-prize", "cup-empty");
        c.style.pointerEvents = "auto"; // Re-enable pointer events
    });

    emptyCupIndex = Math.floor(Math.random() * 5);
    cupResult.textContent = "Shuffling...";
    cupContainer.animate([
        { transform: 'translateX(0px) rotate(0deg)' }, { transform: 'translateX(20px) rotate(5deg)' },
        { transform: 'translateX(-20px) rotate(-5deg)' }, { transform: 'translateX(20px) rotate(5deg)' },
        { transform: 'translateX(-20px) rotate(-5deg)' }, { transform: 'translateX(0px) rotate(0deg)' }
    ], { duration: 1500, easing: 'ease-in-out' });
    setTimeout(() => {
        cupResult.textContent = "Choose a cup!";
        isSpinning = false;
    }, 1600);
}

function handleCupClick(event) {
    if (isSpinning) return;
    isSpinning = true;
    const cup = event.currentTarget;
    const cupIndex = parseInt(cup.dataset.index, 10);
    document.querySelectorAll(".cup").forEach(c => c.style.pointerEvents = "none");
    cup.classList.add("cup-flip");
    setTimeout(() => {
        const hasPrize = cupIndex !== emptyCupIndex;
        const prize = hasPrize ? 10 : 0;
        updateMoney(prize);
        cup.classList.add(hasPrize ? "cup-prize" : "cup-empty");
        if (hasPrize) {
            cupResult.textContent = "You found a prize! You won $10.";
            playWinSound(); triggerCoinShower();
        } else {
            cupResult.textContent = "You chose the empty cup! You lost $7.";
            playLoseSound();
            jumpscareImage.classList.add("jumpscare");
            jumpscareImage.classList.remove("hidden");
            setTimeout(() => {
                jumpscareImage.classList.remove("jumpscare");
                jumpscareImage.classList.add("hidden");
            }, 500);
        }
        setTimeout(() => {
            document.querySelectorAll(".cup").forEach((c, i) => {
                if (i !== cupIndex) {
                    c.classList.add("cup-flip");
                    if (i !== emptyCupIndex) c.classList.add("cup-prize");
                    else c.classList.add("cup-empty");
                }
            });
        }, 1000);
        setTimeout(() => { 
            isSpinning = false; 
            playCupBtn.disabled = false; // Re-enable the play button
        }, 2500);
    }, 900);
}
