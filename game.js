// Pac-Man Game in p5.js
let brickImg;
let font1;
let enemyImg;
function preload() {
    // brickImg = loadImage("wall.png");
    brickImg = loadImage("Assets/wall4.png");
    enemyImg = loadImage("Assets/enemy2.png");
    // Loading our font : 
    font1 = loadFont("Fonts/font1.ttf");
}
// Our canvas variable : 
let canvas;
const boundaries = [];
const pellets = [];
const enemies = [];
let score = 0;
// Let's make our map : 
// In this map "-" represents a boundary , "." represents a pellet , "*" represents an enemy and " " represents a blank space : 
const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '-', '-', '-', '-', '-', '.', '-', '-', '.', '-', '-', '-', '-', '-', '.', '-'],
    ['-', '.', '-', '.', '-', '-', '-', ' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '.', '.', '-', '-', '-', '.', '-', '-', '-', '.', '-', '*', '-', '-', '.', '-'],
    ['-', '.', '-', '.', '-', '.', '-', '.', '.', '.', '.', '.', '-', '.', '-', ' ', ' ', ' ', '.', '-'],
    ['-', '.', '-', '.', '-', '.', '-', '.', '-', ' ', '-', '.', '-', '.', '-', '-', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', ' ', '*', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '.', '-', '-', '.', '-', ' ', '-', '.', '-', '-', '-', '-', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '-', '-', '.', '.', '.', '.', '.', '-', ' ', '-', '-', '.', '-', '.', '-'],
    ['-', '.', '-', '-', '.', '-', '-', '-', '-', '.', '-', '-', '-', '-', '.', '.', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '*', '.', '.', '.', '.', '.', '-', '-', '-', '.', '-'],
    ['-', '.', '-', '.', '-', '-', '.', '-', '-', '.', '-', '-', '-', '-', '.', '-', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
]


function setup() {
    // canvas = createCanvas(800, 600);
    canvas = createCanvas(innerWidth, innerHeight);
    // Setting the canvas in the center : 
    canvas.position('absolute');
    canvas.style('top', '50%');
    canvas.style('left', '50%');
    canvas.style('transform', 'translate(-50%, -50%)');
}

const keys = {
    arrowRight: { pressed: false },
    arrowLeft: { pressed: false },
    arrowUp: { pressed: false },
    arrowDown: { pressed: false },
}
let lastKey = "";

class Boundary {
    static width = 40;
    static height = 40;
    constructor({ position }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
    }
    draw() {
        image(brickImg, this.position.x, this.position.y, this.width, this.height);
    }
}

class Pacman {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.rotation = 0;
    }
    draw() {
        // A custom pacman shape : 
        fill("black");
        circle(this.position.x, this.position.y, this.radius * 2);
        push();
        fill("yellow");
        translate(this.position.x, this.position.y);
        rotate(this.rotation);
        translate(-this.position.x, -this.position.y);
        arc(this.position.x, this.position.y, this.radius * 2, this.radius * 2, 0.2 * PI, 1.8 * PI, PIE);
        pop();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Enemy {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.prevCollisions = [];
    }
    draw() {
        fill("rgba(0,0,0,0.1)");
        circle(this.position.x, this.position.y, this.radius * 2);
        image(enemyImg, this.position.x - this.radius, this.position.y - this.radius, 30, 30);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}


class Pellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 4;
    }
    draw() {
        fill("white");
        circle(this.position.x, this.position.y, this.radius * 2);
    }
}

function circle_rect_collision({ circle, rect }) {
    return (circle.position.y - circle.radius + circle.velocity.y <= rect.position.y + rect.height && circle.position.x + circle.radius + circle.velocity.x >= rect.position.x && circle.position.y + circle.radius + circle.velocity.y >= rect.position.y && circle.position.x - circle.radius + circle.velocity.x <= rect.position.x + rect.width);
}

// let xCenter = Math.floor(innerWidth / innerHeight) / 2;
let yCenter = Math.ceil(innerHeight / innerWidth) * 2;
// Let's render our map :
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case "-":
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * (j + 5),
                        y: Boundary.height * (i + yCenter)
                    }
                }))
                break;
            case ".":
                pellets.push(new Pellet({
                    position: {
                        x: Boundary.width * (j + 5) + Boundary.width / 2,
                        y: Boundary.height * (i + yCenter) + Boundary.height / 2
                    }
                }))
                break;
            case "*":
                enemies.push(new Enemy({
                    position: {
                        x: Boundary.width * (j + 5) + Boundary.width / 2,
                        y: Boundary.height * (i + yCenter) + Boundary.height / 2
                    },
                    velocity: {
                        x: 0,
                        y: 5
                    }
                }))
                break;
        }
    })
})

// Creating our player : 
const pacman = new Pacman({ position: { x: Boundary.width * 6.5, y: Boundary.height * (yCenter + 1.5) }, velocity: { x: 0, y: 0 } });

function draw() {
    // Drawing the background : 
    background("rgb(26, 23, 33)");
    // Displaying some texts : 
    textFont(font1);
    fill("white");
    textSize(40);
    textAlign(CENTER);
    text("Pacman", innerWidth / 2, 50);
    // Displaying the score : 
    textFont(font1);
    fill("white");
    textSize(40);
    textAlign(CENTER);
    text(`Score :  ${score}`, innerWidth / 2, innerHeight - 20);
    // Pacman movement : 
    if (keys.arrowUp.pressed && lastKey == "ArrowUp") {
        // Some more collision detection code : 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circle_rect_collision({ circle: { ...pacman, velocity: { x: 0, y: -6 } }, rect: boundary })) {
                pacman.velocity.y = 0;
                break;
            }
            else {
                pacman.velocity.y = -6;
            }
        }
    }
    else if (keys.arrowLeft.pressed && lastKey == "ArrowLeft") {
        // Some more collision detection code : 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circle_rect_collision({ circle: { ...pacman, velocity: { x: -6, y: 0 } }, rect: boundary })) {
                pacman.velocity.x = 0;
                break;
            }
            else {
                pacman.velocity.x = -6;
            }
        }
    }
    else if (keys.arrowDown.pressed && lastKey == "ArrowDown") {
        // Some more collision detection code : 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circle_rect_collision({ circle: { ...pacman, velocity: { x: 0, y: 6 } }, rect: boundary })) {
                pacman.velocity.y = 0;
                break;
            }
            else {
                pacman.velocity.y = 6;
            }
        }
    }
    else if (keys.arrowRight.pressed && lastKey == "ArrowRight") {
        // Some more collision detection code : 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circle_rect_collision({ circle: { ...pacman, velocity: { x: 6, y: 0 } }, rect: boundary })) {
                pacman.velocity.x = 0;
                break;
            }
            else {
                pacman.velocity.x = 6;
            }
        }
    }
    // Drawing boundaries : 
    boundaries.forEach(boundary => {
        boundary.draw();
        // Stop the pacman if it collides with a boundary : 
        if (circle_rect_collision({ circle: pacman, rect: boundary })) {
            pacman.velocity.x = 0;
            pacman.velocity.y = 0;
        }
    });
    // Drawing the pellets : 
    for (let i = pellets.length - 1; 0 < i; i--) {
        const pellet = pellets[i];
        pellet.draw();
        // Pellets collision detection : 
        if (Math.hypot(pellet.position.x - pacman.position.x, pellet.position.y - pacman.position.y) < pellet.radius + pacman.radius) {
            pellets.splice(i, 1);
            score++;
        }
    }
    enemies.forEach((enemy, i) => {
        enemy.draw();
        if (Math.hypot(enemy.position.x - pacman.position.x, enemy.position.y - pacman.position.y) < enemy.radius + pacman.radius) {
            location.reload();
        }
        const collisions = [];
        // Creating enemy movement :
        boundaries.forEach((boundary) => {
            if (!collisions.includes("right") && circle_rect_collision({ circle: { ...enemy, velocity: { x: 6, y: 0 } }, rect: boundary })) {
                collisions.push("right");
            }
            if (!collisions.includes("left") && circle_rect_collision({ circle: { ...enemy, velocity: { x: -6, y: 0 } }, rect: boundary })) {
                collisions.push("left");
            }
            if (!collisions.includes("up") && circle_rect_collision({ circle: { ...enemy, velocity: { x: 0, y: -6 } }, rect: boundary })) {
                collisions.push("up");
            }
            if (!collisions.includes("down") && circle_rect_collision({ circle: { ...enemy, velocity: { x: 0, y: 6 } }, rect: boundary })) {
                collisions.push("down");
            }
        })
        if (collisions.length > enemy.prevCollisions.length) {
            enemy.prevCollisions = collisions;
        }
        if (JSON.stringify(collisions) !== JSON.stringify(enemy.prevCollisions)) {
            if (enemy.velocity.x > 0) {
                enemy.prevCollisions.push("right");
            }
            else if (enemy.velocity.x < 0) {
                enemy.prevCollisions.push("left");
            }
            else if (enemy.velocity.y < 0) {
                enemy.prevCollisions.push("up");
            }
            else if (enemy.velocity.y > 0) {
                enemy.prevCollisions.push("down");
            }
            const pathways = enemy.prevCollisions.filter((collision) => {
                return !collisions.includes(collision);
            })
            const direction = random(pathways);
            switch (direction) {
                case "down":
                    enemy.velocity.y = 5;
                    enemy.velocity.x = 0;
                    break;
                case "up":
                    enemy.velocity.y = -5;
                    enemy.velocity.x = 0;
                    break;
                case "right":
                    enemy.velocity.y = 0;
                    enemy.velocity.x = 5;
                    break;
                case "left":
                    enemy.velocity.y = 0;
                    enemy.velocity.x = -5;
                    break;
            }
            enemy.prevCollisions = [];
        }
    })
    // Drawing the pacman : 
    pacman.draw();
    if (pacman.velocity.x > 0) {
        pacman.rotation = 0;
    }
    else if (pacman.velocity.x < 0) {
        pacman.rotation = Math.PI;
    }
    else if (pacman.velocity.y > 0) {
        pacman.rotation = Math.PI / 2;
    }
    else if (pacman.velocity.y < 0) {
        pacman.rotation = Math.PI * 1.5;
    }
}

addEventListener("keydown", ({ key }) => {
    if (key == "ArrowUp") {
        lastKey = "ArrowUp"
        keys.arrowUp.pressed = true;
    }
    else if (key == "ArrowDown") {
        lastKey = "ArrowDown"
        keys.arrowDown.pressed = true;
    }
    else if (key == "ArrowRight") {
        lastKey = "ArrowRight"
        keys.arrowRight.pressed = true;
    }
    else if (key == "ArrowLeft") {
        lastKey = "ArrowLeft"
        keys.arrowLeft.pressed = true;
    }
})

addEventListener("keyup", ({ key }) => {
    if (key == "ArrowUp") {
        keys.arrowUp.pressed = false;
    }
    else if (key == "ArrowDown") {
        keys.arrowDown.pressed = false;
    }
    else if (key == "ArrowRight") {
        keys.arrowRight.pressed = false;
    }
    else if (key == "ArrowLeft") {
        keys.arrowLeft.pressed = false;
    }
})