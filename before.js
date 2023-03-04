// Pacman movement : 
if (keys.arrowUp.pressed) {
    // Some more collision detection code : 
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (circle_rect_collision({ circle: { ...pacman, vel: { x: 0, y: -6 } }, rect: boundary })) {
            pacman.vel.y = 0;
            break;
        }
        else {
            pacman.vel.y = -6;
        }
    }
}
else if (keys.arrowLeft.pressed) {
    // Some more collision detection code : 
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (circle_rect_collision({ circle: { ...pacman, vel: { x: -6, y: 0 } }, rect: boundary })) {
            pacman.vel.x = 0;
            break;
        }
        else {
            pacman.vel.x = -6;
        }
    }
}
else if (keys.arrowDown.pressed) {
    // Some more collision detection code : 
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (circle_rect_collision({ circle: { ...pacman, vel: { x: 0, y: 6 } }, rect: boundary })) {
            pacman.vel.y = 0;
            break;
        }
        else {
            pacman.vel.y = 6;
        }
    }
}
else if (keys.arrowRight.pressed) {
    // Some more collision detection code : 
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (circle_rect_collision({ circle: { ...pacman, vel: { x: 6, y: 0 } }, rect: boundary })) {
            pacman.vel.x = 0;
            break;
        }
        else {
            pacman.vel.x = 6;
        }
    }
}