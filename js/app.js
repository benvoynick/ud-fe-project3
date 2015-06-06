var Mortal = function() {
    this.sprite = 'images/Gem Green.png';   // Fallback image, should not be used in real game
}
// Draw the enemy on the screen, required method for game
Mortal.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}



// Enemies our player must avoid
var Enemy = function() {
    Mortal.call(this);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}
Enemy.prototype = Object.create(Mortal.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
}



// The player
var APlayer = function() {
    Mortal.call(this);
    
    this.sprite = 'images/char-boy.png';
    
    this.xOffset = 35;
    
    this.col = 2;
    this.row = 5;
}
APlayer.prototype = Object.create(Mortal.prototype);
APlayer.prototype.constructor = APlayer;

// Update the player's position
// Parameter: dt, a time delta between ticks
APlayer.prototype.update = function(dt) {
    
    
    this.x = this.col * colWidth;
    this.y = this.row * rowHeight - this.xOffset;
}

// Receive key input from event listener
APlayer.prototype.handleInput = function(keyPressed) {
    
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
player = new APlayer();
allEnemies = [];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
