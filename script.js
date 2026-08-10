const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Lanes Setup: 3 lanes (Left, Center, Right)
const lanes = [130, 250, 370]; 
let currentLane = 1; // Start in center lane

let player = {
    x: lanes[currentLane],
    y: 450,
    baseY: 450,
    width: 40,
    height: 40,
    dy: 0,
    jumpPower: -12,
    gravity: 0.7,
    isJumping: false
};

// Obstacles Array
let obstacles = [];
let frameCount = 0;
let score = 0;
let gameSpeed = 5;
let isGameOver = false;

// Controls (Keyboard)
document.addEventListener("keydown", (e) => {
    if (isGameOver) {
        if (e.code === "Space" || e.code === "ArrowUp") resetGame();
        return;
    }

    if (e.code === "ArrowLeft" && currentLane > 0) {
        currentLane--;
    } else if (e.code === "ArrowRight" && currentLane < lanes.length - 1) {
        currentLane++;
    } else if ((e.code === "ArrowUp" || e.code === "Space") && !player.isJumping) {
        player.dy = player.jumpPower;
        player.isJumping = true;
    }
});

// Touch/Swipe Controls for Mobile
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    if (isGameOver) {
        resetGame();
        return;
    }
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;
    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal Swipe
        if (diffX > 30 && currentLane < lanes.length - 1) {
            currentLane++;
        } else if (diffX < -30 && currentLane > 0) {
            currentLane--;
        }
    } else {
        // Vertical Swipe
        if (diffY < -30 && !player.isJumping) {
            player.dy = player.jumpPower;
            player.isJumping = true;
        }
    }
});

function resetGame() {
    obstacles = [];
    score = 0;
    gameSpeed = 5;
    currentLane = 1;
    player.y = player.baseY;
    player.dy = 0;
    player.isJumping = false;
    isGameOver = false;
    loop();
}

// Spawn Obstacles down the lanes
function spawnObstacle() {
    let laneIdx = Math.floor(Math.random() * lanes.length);
    obstacles.push({
        lane: laneIdx,
        z: 0, // Depth from vanishing point
        y: 150,
        width: 60,
        height: 50
    });
}

function update() {
    if (isGameOver) return;

    frameCount++;
    if (frameCount % 90 === 0) {
        spawnObstacle();
        gameSpeed += 0.1; // Gradual difficulty increase
    }

    // Smooth lane transitions for player X position
    let targetX = lanes[currentLane];
    player.x += (targetX - player.x) * 0.2;

    // Jump physics
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y >= player.baseY) {
        player.y = player.baseY;
        player.dy = 0;
        player.isJumping = false;
    }

    // Update Obstacles (simulating forward runner movement)
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].z += gameSpeed;

        // Collision Check
        if (
            obstacles[i].z > 420 && 
            obstacles[i].z < 500 && 
            obstacles[i].lane === currentLane &&
            player.y >= player.baseY - 20 // If not high enough in the air
        ) {
            isGameOver = true;
        }

        // Remove obstacles that passed the screen
        if (obstacles[i].z > 600) {
            obstacles.splice(i, 1);
            score += 10;
        }
    }
}

// Function to draw the Cyber Spider character
function drawSpider(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Spider Legs (Cybernetic curved lines)
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 3;

    // Left legs
    ctx.beginPath();
    ctx.moveTo(-10, 0); ctx.quadraticCurveTo(-30, -10, -40, 10);
    ctx.moveTo(-10, 5); ctx.quadraticCurveTo(-35, 10, -45, 25);
    ctx.moveTo(-10, 10); ctx.quadraticCurveTo(-30, 25, -35, 40);
    ctx.stroke();

    // Right legs
    ctx.beginPath();
    ctx.moveTo(10, 0); ctx.quadraticCurveTo(30, -10, 40, 10);
    ctx.moveTo(10, 5); ctx.quadraticCurveTo(35, 10, 45, 25);
    ctx.moveTo(10, 10); ctx.quadraticCurveTo(30, 25, 35, 40);
    ctx.stroke();

    // Spider Body / Torso (Purple/Blue metallic shell)
    ctx.fillStyle = "#330066";
    ctx.beginPath();
    ctx.ellipse(0, 10, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cyber Head & Glowing Cyan Visor/Eyes
    ctx.fillStyle = "#110022";
    ctx.beginPath();
    ctx.arc(0, -5, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#00ffff"; // Glowing eyes
    ctx.fillRect(-6, -8, 4, 4);
    ctx.fillRect(2, -8, 4, 4);

    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Subway Surfers Perspective Guidelines (3 Lanes converging)
    ctx.strokeStyle = "rgba(0, 255, 204, 0.2)";
    ctx.lineWidth = 2;
    
    // Horizon lines
    ctx.beginPath();
    ctx.moveTo(250, 150); ctx.lineTo(50, 600);
    ctx.moveTo(250, 150); ctx.lineTo(200, 600);
    ctx.moveTo(250, 150); ctx.lineTo(300, 600);
    ctx.moveTo(250, 150); ctx.lineTo(450, 600);
    ctx.stroke();

    // Draw Obstacles sorted by depth
    obstacles.forEach(obs => {
        // Perspective scaling based on Z-depth
        let scaleFactor = 0.2 + (obs.z / 600) * 0.8;
        let laneX = lanes[obs.lane];
        // Project position from center vanishing point (250, 150)
        let renderX = 250 + (laneX - 250) * scaleFactor;
        let renderY = 150 + (450 - 150) * (obs.z / 600);

        ctx.fillStyle = "#ff3366";
        ctx.shadowColor = "#ff0033";
        ctx.shadowBlur = 10;
        ctx.fillRect(renderX - (25 * scaleFactor), renderY - (35 * scaleFactor), 50 * scaleFactor, 40 * scaleFactor);
        ctx.shadowBlur = 0; // reset shadow
    });

    // Draw Player Spider
    let spiderScale = 1.2 + (player.baseY - player.y) * 0.005; // Slightly scale up when jumping
    drawSpider(player.x, player.y, spiderScale);

    // Draw Score
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px sans-serif";
    ctx.fillText("Score: " + score, 20, 30);

    // Game Over Screen
    if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff3366";
        ctx.font = "bold 32px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CRASHED!", canvas.width / 2, 240);

        ctx.fillStyle = "#00ffcc";
        ctx.font = "18px sans-serif";
        ctx.fillText("Final Score: " + score, canvas.width / 2, 290);
        ctx.fillText("Tap or Press Space to Restart", canvas.width / 2, 340);
        ctx.textAlign = "left"; // reset alignment
    }
}

function loop() {
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(loop);
    }
}

loop();
