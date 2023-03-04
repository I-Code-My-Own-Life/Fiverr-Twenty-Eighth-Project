// Pac-Man Game in p5.js
let brickImg;
let font1;
let enemyImg;
function preload() {
    // Loading our images : 
    // brickImg = loadImage("wall.png");
    brickImg = loadImage("Assets/wall4.png");
    enemyImg = loadImage("Assets/enemy2.png");
    // Loading our font : 
    font1 = loadFont("Fonts/font1.ttf");
    // Loading our score table (random data) :
    table = loadTable('assets/table.csv', 'csv', 'header');
}
// Our canvas variable : 
let canvas;
const boundaries = [];
const pellets = [];
const enemies = [];
let score = 0;
let scene = "Game";
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
    canvas = createCanvas(innerWidth, innerHeight);
}

const keys = {
    arrowRight: { pressed: false },
    arrowLeft: { pressed: false },
    arrowUp: { pressed: false },
    arrowDown: { pressed: false },
}

class Boundary {
    static width = 40;
    static height = 40;
    constructor({ pos }) {
        this.pos = pos;
        this.width = 40;
        this.height = 40;
    }
    draw() {
        image(brickImg, this.pos.x, this.pos.y, this.width, this.height);
    }
}

class Pacman {
    constructor({ pos, vel }) {
        this.pos = pos;
        this.vel = vel;
        this.radius = 15;
        this.rotation = 0;
    }
    draw() {
        // A custom pacman shape : 
        fill("black");
        circle(this.pos.x, this.pos.y, this.radius * 2);
        push();
        fill("yellow");
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        translate(-this.pos.x, -this.pos.y);
        arc(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2, 0.2 * PI, 1.8 * PI, PIE);
        pop();
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
}

class Enemy {
    constructor({ pos, vel }) {
        this.pos = pos;
        this.vel = vel;
        this.radius = 15;
        this.prevCollisions = [];
    }
    draw() {
        fill("rgba(0,0,0,0.1)");
        circle(this.pos.x, this.pos.y, this.radius * 2);
        image(enemyImg, this.pos.x - this.radius, this.pos.y - this.radius, 30, 30);
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
}


class Pellet {
    constructor({ pos }) {
        this.pos = pos;
        this.radius = 4;
    }
    draw() {
        fill("white");
        circle(this.pos.x, this.pos.y, this.radius * 2);
    }
}

function circle_rect_collision({ circle, rect }) {
    return (circle.pos.y - circle.radius + circle.vel.y <= rect.pos.y + rect.height && circle.pos.x + circle.radius + circle.vel.x >= rect.pos.x && circle.pos.y + circle.radius + circle.vel.y >= rect.pos.y && circle.pos.x - circle.radius + circle.vel.x <= rect.pos.x + rect.width);
}

function displayTable() {
    let x = (innerWidth / 2) - innerWidth / 5;
    let y = (innerHeight / 2) - innerHeight / 6;

    for (let i = 0; i < table.getRowCount(); i++) {
        let row = table.getRow(i);

        for (let j = 0; j < table.getColumnCount(); j++) {
            let cell = row.getString(j);
            fill("white");
            textFont(font1);
            text(cell, x, y);
            x += 250;
        }

        x = (innerWidth / 2) - innerWidth / 5;
        y += 60;
    }
}

let yCenter = Math.ceil(innerHeight / innerWidth) * 2;

// Let's render our map :
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case "-":
                boundaries.push(new Boundary({
                    pos: {
                        x: Boundary.width * (j + 5),
                        y: Boundary.height * (i + yCenter)
                    }
                }))
                break;
            case ".":
                pellets.push(new Pellet({
                    pos: {
                        x: Boundary.width * (j + 5) + Boundary.width / 2,
                        y: Boundary.height * (i + yCenter) + Boundary.height / 2
                    }
                }))
                break;
            case "*":
                enemies.push(new Enemy({
                    pos: {
                        x: Boundary.width * (j + 5) + Boundary.width / 2,
                        y: Boundary.height * (i + yCenter) + Boundary.height / 2
                    },
                    vel: {
                        x: 0,
                        y: 5
                    }
                }))
                break;
        }
    })
})

// Creating our player : 
const pacman = new Pacman({ pos: { x: Boundary.width * 6.5, y: Boundary.height * (yCenter + 1.5) }, vel: { x: 0, y: 0 } });


function draw() {
    // Our game scene : 
    if (scene == "Game") {
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
        if (keys.arrowUp.pressed) {
            pacman.vel.y = -6;
        }
        else if (keys.arrowLeft.pressed) {
            pacman.vel.x = -6;
        }
        else if (keys.arrowDown.pressed) {
            pacman.vel.y = 6;
        }
        else if (keys.arrowRight.pressed) {
            pacman.vel.x = 6;
        }
        // Drawing boundaries : 
        boundaries.forEach(boundary => {
            boundary.draw();
            // Stop the pacman if it collides with a boundary : 
            if (circle_rect_collision({ circle: pacman, rect: boundary })) {
                pacman.vel.x = 0;
                pacman.vel.y = 0;
            }
        });
        // Drawing the pellets : 
        for (let i = pellets.length - 1; 0 < i; i--) {
            const pellet = pellets[i];
            pellet.draw();
            // If the pacman and the enemy colliding then remove the pellet and increase player score :  
            if (Math.hypot(pellet.pos.x - pacman.pos.x, pellet.pos.y - pacman.pos.y) < pellet.radius + pacman.radius) {
                pellets.splice(i, 1);
                score++;
            }
        }
        enemies.forEach((enemy, i) => {
            enemy.draw();
            // If the pacman and the enemy colliding then reset the game : 
            if (Math.hypot(enemy.pos.x - pacman.pos.x, enemy.pos.y - pacman.pos.y) < enemy.radius + pacman.radius) {
                // location.reload();
            }
            const collisions = [];
            // Creating enemy movement :
            boundaries.forEach((boundary) => {
                if (!collisions.includes("right") && circle_rect_collision({ circle: { ...enemy, vel: { x: 6, y: 0 } }, rect: boundary })) {
                    collisions.push("right");
                }
                if (!collisions.includes("left") && circle_rect_collision({ circle: { ...enemy, vel: { x: -6, y: 0 } }, rect: boundary })) {
                    collisions.push("left");
                }
                if (!collisions.includes("up") && circle_rect_collision({ circle: { ...enemy, vel: { x: 0, y: -6 } }, rect: boundary })) {
                    collisions.push("up");
                }
                if (!collisions.includes("down") && circle_rect_collision({ circle: { ...enemy, vel: { x: 0, y: 6 } }, rect: boundary })) {
                    collisions.push("down");
                }
            })
            if (collisions.length > enemy.prevCollisions.length) {
                enemy.prevCollisions = collisions;
            }
            if (JSON.stringify(collisions) !== JSON.stringify(enemy.prevCollisions)) {
                if (enemy.vel.x > 0) {
                    enemy.prevCollisions.push("right");
                }
                else if (enemy.vel.x < 0) {
                    enemy.prevCollisions.push("left");
                }
                else if (enemy.vel.y < 0) {
                    enemy.prevCollisions.push("up");
                }
                else if (enemy.vel.y > 0) {
                    enemy.prevCollisions.push("down");
                }
                const pathways = enemy.prevCollisions.filter((collision) => {
                    return !collisions.includes(collision);
                })
                const direction = random(pathways);
                switch (direction) {
                    case "down":
                        enemy.vel.y = 5;
                        enemy.vel.x = 0;
                        break;
                    case "up":
                        enemy.vel.y = -5;
                        enemy.vel.x = 0;
                        break;
                    case "right":
                        enemy.vel.y = 0;
                        enemy.vel.x = 5;
                        break;
                    case "left":
                        enemy.vel.y = 0;
                        enemy.vel.x = -5;
                        break;
                }
                enemy.prevCollisions = [];
            }
            console.log(pellets.length)
            // If the pacman has eaten all the pellets take the player on the leaderboard scene : 
            if (pellets.length == 120) {
                scene = "Leaderboard";
            }
        })
        // Drawing the pacman : 
        pacman.draw();
        // Handling pacman face direction : 
        if (pacman.vel.x > 0) {
            pacman.rotation = 0;
        }
        else if (pacman.vel.x < 0) {
            pacman.rotation = Math.PI;
        }
        else if (pacman.vel.y > 0) {
            pacman.rotation = Math.PI / 2;
        }
        else if (pacman.vel.y < 0) {
            pacman.rotation = Math.PI * 1.5;
        }
    }
    // Our leaderboard scene : 
    else if (scene == "Leaderboard") {
        background("black");
        // Using the table : 
        displayTable();
    }
}
    
addEventListener("keydown", ({ key }) => {
    if (key == "ArrowUp") {
        keys.arrowUp.pressed = true;
    }
    else if (key == "ArrowDown") {
        keys.arrowDown.pressed = true;
    }
    else if (key == "ArrowRight") {
        keys.arrowRight.pressed = true;
    }
    else if (key == "ArrowLeft") {
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