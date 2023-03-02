// Pac-Man Game in p5.js

function preload() {

}
// Our canvas variable : 
let canvas;
const boundaries = [];

// Let's make our map : 
const map = [
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
]

function setup() {
    canvas = createCanvas(800, 600);
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
        noStroke();
        fill(3, 7, 255);
        rect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Pacman {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
    }
    draw() {
        fill("yellow");
        circle(this.position.x, this.position.y, this.radius * 2);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

function circle_rect_collision({ circle, rect }) {
    return (circle.position.y - circle.radius + circle.velocity.y <= rect.position.y + rect.height && circle.position.x + circle.radius + circle.velocity.x >= rect.position.x && circle.position.y + circle.radius + circle.velocity.y >= rect.position.y && circle.position.x - circle.radius + circle.velocity.x <= rect.position.x + rect.width);
}
// Let's render our map :
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case "-":
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    }
                }))
                break;
        }
    })
})

// Creating our player : 
const pacman = new Pacman({ position: { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 }, velocity: { x: 0, y: 0 } });

function draw() {
    background(0);
    // Pacman movement : 
    if (keys.arrowUp.pressed && lastKey == "ArrowUp") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circle_rect_collision({ circle: {...pacman,velocity:{x:0,y:-5}}, rect: boundary })) {
                pacman.velocity.y = 0;
                break;
            }
            else{
                pacman.velocity.y = -5;
            }
        }
    }
    else if (keys.arrowLeft.pressed && lastKey == "ArrowLeft") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circle_rect_collision({ circle: {...pacman,velocity:{x:-5,y:0}}, rect: boundary })) {
                pacman.velocity.x = 0;
                break;
            }
            else{
                pacman.velocity.x = -5;
            }
        }
    }
    else if (keys.arrowDown.pressed && lastKey == "ArrowDown") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circle_rect_collision({ circle: {...pacman,velocity:{x:0,y:5}}, rect: boundary })) {
                pacman.velocity.y = 0;
                break;
            }
            else{
                pacman.velocity.y = 5;
            }
        }
    }
    else if (keys.arrowRight.pressed && lastKey == "ArrowRight") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circle_rect_collision({ circle: {...pacman,velocity:{x:5,y:0}}, rect: boundary })) {
                pacman.velocity.x = 0;
                break;
            }
            else{
                pacman.velocity.x = 5;
            }
        }
    }
    boundaries.forEach(boundary => {
        boundary.draw();
        if (circle_rect_collision({ circle: pacman, rect: boundary })) {
            pacman.velocity.x = 0;
            pacman.velocity.y = 0;
        }
    });
    pacman.draw();

}


// function keyPressed() {
//     if (keyCode === UP_ARROW) {
//         // do something when the up arrow is pressed
//        pacman.velocity.x = 0;
//        pacman.velocity.y = -5;
//        console.log("Pressing up key.");

//     } else if (keyCode === DOWN_ARROW) {
//         // do something when the down arrow is pressed
//         pacman.velocity.y = 5;
//         pacman.velocity.x = 0;
//     }
//     else if (keyCode === RIGHT_ARROW) {
//         // do something when the down arrow is pressed
//         pacman.velocity.x = 5;
//         pacman.velocity.y = 0;
//     }
//     else if (keyCode === LEFT_ARROW) {
//         // do something when the down arrow is pressed
//         pacman.velocity.x = -5;
//         pacman.velocity.y = 0;
//     }
//     // console.log(pacman.velocity)
// }


// function keyup() {
//     if (keyCode === UP_ARROW) {
//        console.log("Releasing up key.");
//     }
//   }


addEventListener("keydown", ({ key }) => {
    console.log(key)
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
    console.log(pacman.velocity);
})

addEventListener("keyup", ({ key }) => {
    console.log(key)
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
    console.log(pacman.velocity);
})