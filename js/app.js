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
    
    this.yOffset = 25;
    
    this.sprite = 'images/enemy-bug.png';
}
Enemy.prototype = Object.create(Mortal.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.spawn = function() {
    this.speed = Resources.getRandomInt(150, 250);
    this.row = Resources.getRandomInt(1, 3);
    this.col = -1;
    this.y = this.row * rowHeight - this.yOffset;
    this.x = this.col * colWidth;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var distanceTraveled = this.speed * dt;
    
    // Don't let enemies overlap/overtake one another
    for (e = 0; e < allEnemies.length; e++) {
        if(allEnemies[e] !== this && allEnemies[e].row == this.row && allEnemies[e].x > this.x){
            var distanceApart = Math.abs(allEnemies[e].x - this.x) - colWidth;
            
            if (distanceTraveled > distanceApart){
                if (distanceApart > 0) distanceTraveled = distanceApart;
                else distanceTraveled = 0;
            }
        }
    }
    
    this.x += distanceTraveled;
    
    // Update current column if necessary
    if (this.x - this.col * colWidth > colWidth / 2) {
        this.col += 1;
    }
    
    this.checkCollision();
    
    if (this.col > 5) {
        this.spawn();
    }
}

Enemy.prototype.checkCollision = function() {
    // Check for collision with player
    if (this.row == player.row && this.col == player.col) {
        player.die();
    }
}



// The player
var APlayer = function() {
    Mortal.call(this);
    
    this.yOffset = 35;
    
    this.sprite = 'images/char-boy.png';
    
    this.col = 2;
    this.row = 5;
    this.upcomingMove = null;
}
APlayer.prototype = Object.create(Mortal.prototype);
APlayer.prototype.constructor = APlayer;

// Update the player's position
// Parameter: dt, a time delta between ticks
APlayer.prototype.update = function(dt) {
    if (this.upcomingMove !== null) {
        var newCol = this.col;
        var newRow = this.row;
        
        if (this.upcomingMove == 'up') newRow -= 1;
        else if (this.upcomingMove == 'down') newRow += 1;
        else if (this.upcomingMove == 'left') newCol -= 1;
        else if (this.upcomingMove == 'right') newCol += 1;
        
        this.upcomingMove = null;
        
        if (newCol < 5 && newRow < 6 && newCol >= 0 && newRow >= 0) {
            this.col = newCol;
            this.row = newRow;
        }
    }
    
    this.x = this.col * colWidth;
    this.y = this.row * rowHeight - this.yOffset;
}

// Receive key input from event listener
APlayer.prototype.handleInput = function(keyPressed) {
    if(keyPressed !== undefined) {
        this.upcomingMove = keyPressed;
    }
    else {
        this.upcomingMove = null;
    }
}

APlayer.prototype.die = function() {
    this.col = 2;
    this.row = 5;
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
player = new APlayer();
allEnemies = [new Enemy, new Enemy, new Enemy];


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
