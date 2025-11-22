
// Global state
let playerMoney = 100;
let isDevMode = false;
let currentBet = null; // For Sevens Heaven game
let emptyCupIndex = null; // For Cup of Fortune game
let wheelSectors = [];
let rouletteNumbers = [];
let roulettePockets = [];
let isSpinning = false;
let animationFrameId = null;

// Initialization trackers
let isLuckySpinInitialized = false;
let isSevensHeavenInitialized = false;
let isCupGameInitialized = false;

// DOM elements
const balanceElement = document.getElementById("balance");
const mainMenu = document.getElementById("main-menu");
const gameScreens = document.querySelectorAll(".game-screen");
const devModeCheckbox = document.getElementById("dev-mode");

// Game buttons
const luckySpinBtn = document.getElementById("lucky-spin-btn");
const sevensHeavenBtn = document.getElementById("sevens-heaven-btn");
const cupFortuneBtn = document.getElementById("cup-fortune-btn");

// Back buttons
const backButtons = document.querySelectorAll(".back-btn");

// Game 1: Lucky Spin elements
const wheel = document.getElementById("wheel");
const wheelPointer = document.querySelector(".wheel-pointer");
const spinBtn = document.querySelector(".spin-btn");
const spinResult = document.getElementById("spin-result");

// Game 2: Sevens Heaven elements
const rouletteWheel = document.getElementById("roulette-wheel");
const rouletteBall = document.getElementById("roulette-ball");
const bet6Btn = document.getElementById("bet-6");
const bet7Btn = document.getElementById("bet-7");
const rollRouletteBtn = document.querySelector(".roll-roulette-btn");
const rouletteResult = document.getElementById("roulette-result");

// Game 3: Cup of Fortune elements
const cupContainer = document.getElementById("cup-container");
const playCupBtn = document.querySelector(".play-cup-btn");
const cupResult = document.getElementById("cup-result");

// --- Easing function for smooth animation ---
function easeOutQuint(x) {
  return 1 - Math.pow(1 - x, 5);
}

// Initialize the application
function init() {
  setupEventListeners();
  updateBalance();
}

// Set up all event listeners
function setupEventListeners() {
  luckySpinBtn.addEventListener("click", () => showGame("lucky-spin"));
  sevensHeavenBtn.addEventListener("click", () => showGame("sevens-heaven"));
  cupFortuneBtn.addEventListener("click", () => showGame("cup-fortune"));

  backButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      cancelAnimationFrame(animationFrameId);
      isSpinning = false;
      showMainMenu();
    });
  });

  devModeCheckbox.addEventListener("change", function () {
    isDevMode = this.checked;
  });

  spinBtn.addEventListener("click", playLuckySpin);

  bet6Btn.addEventListener("click", () => setBet(6));
  bet7Btn.addEventListener("click", () => setBet(7));
  rollRouletteBtn.addEventListener("click", playSevensHeaven);

  playCupBtn.addEventListener("click", startCupGame);
}

// Navigation functions
function showMainMenu() {
  mainMenu.style.display = "flex";
  gameScreens.forEach((screen) => {
    screen.style.display = "none";
  });
  resetAllGameStates();
}

function showGame(gameId) {
  mainMenu.style.display = "none";
  gameScreens.forEach((screen) => {
    screen.style.display = screen.id === gameId ? "block" : "none";
  });

  if (gameId === 'lucky-spin' && !isLuckySpinInitialized) {
      initializeLuckySpin();
      isLuckySpinInitialized = true;
  } else if (gameId === 'sevens-heaven' && !isSevensHeavenInitialized) {
      initializeSevensHeaven();
      isSevensHeavenInitialized = true;
  } else if (gameId === 'cup-fortune' && !isCupGameInitialized) {
      initializeCupGame();
      isCupGameInitialized = true;
  }
}

function resetAllGameStates() {
    isSpinning = false;
    cancelAnimationFrame(animationFrameId);
    
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    spinBtn.classList.remove('disabled');
    spinResult.textContent = 'Select a color and spin the wheel!';

    rouletteWheel.style.transition = 'none';
    rouletteWheel.style.transform = 'rotate(0deg)';
    rouletteBall.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    rollRouletteBtn.classList.remove('disabled');
    bet6Btn.classList.remove('disabled', 'active');
    bet7Btn.classList.remove('disabled', 'active');
    currentBet = null;
    roulettePockets.forEach(p => p.classList.remove('winning'));
    rouletteResult.textContent = 'Place your bet and spin the wheel!';

    playCupBtn.classList.remove('disabled');
    initializeCupGame();
}

// Money management
function updateMoney(amount) {
  if (!isDevMode) {
    playerMoney += amount;
    updateBalance();
  }
}

function updateBalance() {
  balanceElement.textContent = `Balance: $${playerMoney}`;
}

function checkCost(cost) {
  if (isDevMode) return true;
  if (playerMoney >= cost) return true;
  alert("Not enough money!");
  return false;
}

// Game 1: Lucky Spin
function initializeLuckySpin() {
  wheel.innerHTML = "";
  wheelSectors = [
    { color: "#DB3342", label: "RED", prize: 0 }, { color: "#F39C12", label: "GOLD", prize: 20 },
    { color: "#3498DB", label: "BLUE", prize: 5 }, { color: "#DB3342", label: "RED", prize: 0 },
    { color: "#3498DB", label: "BLUE", prize: 5 }, { color: "#DB3342", label: "RED", prize: 0 },
    { color: "#3498DB", label: "BLUE", prize: 5 }, { color: "#DB3342", label: "RED", prize: 0 },
  ];
  const sectorAngle = 360 / wheelSectors.length;
  const gradientParts = wheelSectors.map((s, i) => `${s.color} ${i * sectorAngle}deg ${(i + 1) * sectorAngle}deg`);
  wheel.style.backgroundImage = `conic-gradient(${gradientParts.join(', ')}`;
}

function playLuckySpin() {
  if (isSpinning || !checkCost(5)) return;
  isSpinning = true;
  spinBtn.classList.add("disabled");
  updateMoney(-5);
  spinResult.textContent = "Spinning...";
  spinResult.className = "result";

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
    spinResult.classList.add(netGain >= 0 ? "win-flash" : "lose-flash");
    wheelPointer.classList.add("bounce");

    setTimeout(() => {
        spinBtn.classList.remove("disabled");
        wheelPointer.classList.remove("bounce");
        isSpinning = false;
    }, 2000);
}

// Game 2: Sevens Heaven (Time-based Animation)
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
    if (!currentBet) { alert("Please place a bet on 6 or 7 first!"); return; }
    if (isSpinning || !checkCost(10)) return;
    isSpinning = true;

    rollRouletteBtn.classList.add("disabled");
    bet6Btn.classList.add("disabled");
    bet7Btn.classList.add("disabled");
    roulettePockets.forEach(p => p.classList.remove('winning'));
    rouletteResult.textContent = "Spinning...";
    updateMoney(-10);

    // Determine outcome
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

        // Animate wheel
        const currentWheelAngle = easedProgress * finalWheelAngle;
        rouletteWheel.style.transform = `rotate(${currentWheelAngle}deg)`;

        // Animate ball
        const ballStartAngle = 0;
        const ballEndAngle = finalWheelAngle + finalBallAngle;
        const currentBallAngle = ballStartAngle - (easedProgress * (ballEndAngle - ballStartAngle));
        
        const startRadius = 135;
        const endRadius = (rouletteWheel.clientWidth / 2) * 0.75;
        const currentRadius = startRadius + (easedProgress * (endRadius - startRadius));
        
        const ballX = Math.cos((currentBallAngle - 90) * (Math.PI / 180)) * currentRadius;
        const ballY = Math.sin((currentBallAngle - 90) * (Math.PI / 180)) * currentRadius;
        rouletteBall.style.transform = `translate(${ballX}px, ${ballY}px)`;

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            endSevensHeavenSimulation(winningIndex, winningNumber);
        }
    }

    animationFrameId = requestAnimationFrame(animate);
}

function endSevensHeavenSimulation(winningIndex, winningNumber) {
    const winningPocket = roulettePockets[winningIndex];
    winningPocket.classList.add('winning');

    const prize = currentBet === winningNumber ? 20 : 0;
    updateMoney(prize);
    const netGain = prize - 10;
    rouletteResult.textContent = `Ball landed on ${winningNumber}! You ${netGain >= 0 ? 'won' : 'lost'} $${Math.abs(netGain)}.`;
    rouletteResult.classList.add(netGain >= 0 ? "win-flash" : "lose-flash");

    rollRouletteBtn.classList.remove("disabled");
    bet6Btn.classList.remove("disabled");
    bet7Btn.classList.remove("disabled");
    winningPocket.classList.remove('winning');
    isSpinning = false;
}

// Game 3: Cup of Fortune
function initializeCupGame() {
  cupContainer.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const cup = document.createElement("div");
    cup.className = "cup";
    cup.dataset.index = i;
    cup.addEventListener("click", handleCupClick);
    cupContainer.appendChild(cup);
  }
  randomizeEmptyCup();
}

function randomizeEmptyCup() {
  emptyCupIndex = Math.floor(Math.random() * 5);
}

function startCupGame() {
  if (isSpinning || !checkCost(7)) return;
  isSpinning = true;

  playCupBtn.classList.add("disabled");
  updateMoney(-7);
  randomizeEmptyCup();
  cupResult.textContent = "Shuffling...";
  const cups = Array.from(cupContainer.children);
  cups.forEach(cup => {
    cup.classList.remove("cup-flip", "cup-prize", "cup-empty");
    cup.style.pointerEvents = "auto"; // Make sure cups are clickable
  });

  // Simplified shuffle animation
  cupContainer.animate([
      { transform: 'translateX(0px) rotate(0deg)' },
      { transform: 'translateX(20px) rotate(5deg)' },
      { transform: 'translateX(-20px) rotate(-5deg)' },
      { transform: 'translateX(20px) rotate(5deg)' },
      { transform: 'translateX(-20px) rotate(-5deg)' },
      { transform: 'translateX(0px) rotate(0deg)' }
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
      cupResult.textContent = "You won $10!";
    } else {
      cupResult.textContent = `You chose empty. You lost $7.`;
    }
    cupResult.classList.add(hasPrize ? "win-flash" : "lose-flash");

    // Reveal all cups after a short delay
    setTimeout(() => {
      document.querySelectorAll(".cup").forEach((c, i) => {
        if (i !== cupIndex) { // Don't re-flip the chosen cup
          c.classList.add("cup-flip");
          if (i !== emptyCupIndex) {
            c.classList.add("cup-prize");
          } else {
            c.classList.add("cup-empty");
          }
        }
      });
    }, 1000);

    setTimeout(() => {
      playCupBtn.classList.remove("disabled");
      isSpinning = false;
      document.querySelectorAll(".cup").forEach(c => c.style.pointerEvents = "auto");
    }, 2500);
  }, 900);
}

document.addEventListener("DOMContentLoaded", init);
