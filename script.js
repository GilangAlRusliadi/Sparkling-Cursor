const TAU = Math.PI * 2;

let currentShape = "star";
let currentColors = ["red", "yellow", "blue", "green", "purple"];
let allowAllShapes = false;

const shapeMap = {
    "1": { shape: "circle", colors: ["red", "yellow", "blue", "green", "purple"] },
    "2": { shape: "lens", colors: ["red", "yellow", "blue", "green", "purple"] },
    "3": { shape: "triangle", colors: ["red", "yellow", "blue", "green", "purple"] },
    "4": { shape: "square", colors: ["red", "yellow", "blue", "green", "purple"] },
    "5": { shape: "star", colors: ["red", "yellow", "blue", "green", "purple"] },
    "6": { shape: "heart", colors: ["#FF69B4"] }, // Hot Pink
    "7": { shape: "moon", colors: ["yellow"] },
    "8": { shape: "leaf", colors: ["lightgreen"] },
    "9": { shape: "waterdrop", colors: ["lightskyblue"] },
    "0": { shape: "all", colors: ["red", "yellow", "blue", "green", "purple", "#FF69B4", "yellow", "lightgreen", "lightskyblue"] }
};

document.addEventListener("keydown", (event) => {
    if (shapeMap[event.key]) {
        currentShape = shapeMap[event.key].shape;
        currentColors = shapeMap[event.key].colors;
        allowAllShapes = event.key === "0";
    }
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.sin(Math.random() * TAU) * Math.random() * 4;
        this.vy = Math.cos(Math.random() * TAU) * Math.random() * 4;
        this.alpha = 1;
        this.scale = Math.random() * 0.8 + 0.2;
        this.drag = 0.96;
        this.angle = Math.random() * TAU;
        this.shape = allowAllShapes ? this.randomShape() : currentShape;
        this.color = allowAllShapes ? this.randomColor() : this.assignColor();
    }

    randomShape() {
        const shapes = ["circle", "lens", "triangle", "square", "star",
                        "heart", "moon", "leaf", "waterdrop"];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    randomColor() {
        return shapeMap["0"].colors[Math.floor(Math.random() * shapeMap["0"].colors.length)];
    }

    assignColor() {
        return currentColors[Math.floor(Math.random() * currentColors.length)];
    }

    update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.02;
        this.angle += 0.1;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;

        switch (this.shape) {
            case "circle": drawCircle(ctx, this.scale * 6); break;
            case "lens": drawLens(ctx, this.scale * 10); break;
            case "triangle": drawTriangle(ctx, this.scale * 10); break;
            case "square": drawSquare(ctx, this.scale * 10); break;
            case "star": drawStar(ctx, this.scale * 8); break;
            case "heart": drawHeart(ctx, this.scale * 10); break;
            case "moon": drawMoon(ctx, this.scale * 10); break;
            case "leaf": drawLeaf(ctx, this.scale * 10); break;
            case "waterdrop": drawWaterDrop(ctx, this.scale * 10); break;
        }

        ctx.restore();
    }
}

function drawCircle(ctx, size) {
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, TAU);
    ctx.fill();
}

function drawLens(ctx, size) {
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size / 2, 0, 0, TAU);
    ctx.fill();
}

function drawTriangle(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, size);
    ctx.lineTo(-size, size);
    ctx.closePath();
    ctx.fill();
}

function drawSquare(ctx, size) {
    ctx.fillRect(-size / 2, -size / 2, size, size);
}

function drawStar(ctx, size) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
        let r = (i % 2 === 0) ? size : size / 2;
        let angle = i * Math.PI / 5;
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
}

function drawHeart(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, size / 4);
    ctx.bezierCurveTo(size / 2, -size / 2, size, size / 4, 0, size);
    ctx.bezierCurveTo(-size, size / 4, -size / 2, -size / 2, 0, size / 4);
    ctx.closePath();
    ctx.fill();
}

function drawMoon(ctx, size) {
    ctx.beginPath();
    ctx.arc(0, 0, size, Math.PI * 0.25, Math.PI * 1.75);
    ctx.arc(-size / 2, 0, size * 0.8, Math.PI * 1.75, Math.PI * 0.25, true);
    ctx.closePath();
    ctx.fill();
}

function drawLeaf(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size, -size / 2, size, size / 2, 0, size);
    ctx.bezierCurveTo(-size, size / 2, -size, -size / 2, 0, -size);
    ctx.closePath();
    ctx.fill();
}

function drawWaterDrop(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size, -size / 2, size, size / 2, 0, size);
    ctx.bezierCurveTo(-size, size / 2, -size, -size / 2, 0, -size);
    ctx.lineTo(0, -size);
    ctx.closePath();
    ctx.fill();
}

const canvas = document.getElementById("sparkleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];

window.addEventListener("mousemove", (event) => {
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(event.clientX, event.clientY));
    }
});

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => { p.update(); p.draw(ctx); if (p.alpha <= 0) particles.splice(i, 1); });
    requestAnimationFrame(loop);
}

loop();

const backgrounds = [
    "background/Eridu View Night.png",
    "background/Eridu City Night.png",
    "background/Eridu Tower Entrance Night.png",
    "background/Eridu Tower Inside Night.png",
    "background/Eridu Tower Rooftop Night.png"
];

let bgIndex = 0;
let activeBg = 1;

const bg1 = document.getElementById("background1");
const bg2 = document.getElementById("background2");

// Set wallpaper pertama langsung terlihat
bg1.style.backgroundImage = `url('${backgrounds[bgIndex]}')`;
bg1.style.opacity = 1;

function changeBackground() {
    const nextIndex = (bgIndex + 1) % backgrounds.length;

    if (activeBg === 1) {
        bg2.style.backgroundImage = `url('${encodeURIComponent(backgrounds[nextIndex])}')`;
        bg2.style.opacity = 1; // Gambar baru fade-in
        bg1.style.opacity = 0; // Gambar lama fade-out
        activeBg = 2;
    } else {
        bg1.style.backgroundImage = `url('${encodeURIComponent(backgrounds[nextIndex])}')`;
        bg1.style.opacity = 1;
        bg2.style.opacity = 0;
        activeBg = 1;
    }

    bgIndex = nextIndex;
}

// Pergantian dilakukan setiap 9 detik agar transisi terjadi di detik 9-10, 18-19, dst.
setInterval(changeBackground, 9000);
