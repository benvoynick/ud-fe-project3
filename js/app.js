var AGameState = function() {
    this.level = 1;
    
    this.stage = new AStage();
}

AGameState.prototype.renderLevel = function() {
    ctx.save();
    ctx.font = "36px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
    ctx.fillStyle = 'black';
    ctx.fillText('Level ' + this.level, 5, 0);
    ctx.restore();
}

AGameState.prototype.respawnEnemies = function() {
    for(e = 0; e < allEnemies.length; e++) {
        allEnemies[e].spawn();
    }
}

AGameState.prototype.resetEnemies = function() {
    allEnemies = [];
    for(e = 0; e < 3; e++) {
        allEnemies[e] = new Enemy();
    }
}

AGameState.prototype.nextLevel = function() {
    this.level++;
    
    if (this.level == 100) {
        this.win();
        return;
    }
    
    if (allEnemies.length <= 6 && this.level % 20 == 0) {
        allEnemies.push(new Enemy());
    }
    
    for(e = 0; e < 3; e++) {
        allEnemies[e] = new Enemy();
        allEnemies[e].minSpeed = allEnemies[e].baseMinSpeed + (this.level) - 1;
        allEnemies[e].maxSpeed = allEnemies[e].baseMaxSpeed + (this.level) - 1;
    }
    
    this.respawnEnemies();
}

AGameState.prototype.lose = function() {
    this.level = 1;
    this.resetEnemies();
    this.respawnEnemies();
}

AGameState.prototype.win = function() {
    this.lose();
}



var AStage = function() {
    
}

AStage.prototype.render = function() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ],
        numRows = 6,
        numCols = 5,
        row, col;

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
            /* The drawImage function of the canvas' context element
             * requires 3 parameters: the image to draw, the x coordinate
             * to start drawing and the y coordinate to start drawing.
             * We're using our Resources helpers to refer to our images
             * so that we get the benefits of caching these images, since
             * we're using them over and over.
             */
            ctx.drawImage(Resources.get(rowImages[row]), col * colWidth, row * rowHeight);
        }
    }
}


var Mortal = function() {
    this.yOffset = 0; // How much to offset y position when drawing sprite on tile
    
    this.sprite = 'images/Gem Green.png';   // Fallback image, should not be used in real game
}
Mortal.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - this.yOffset);
}



// Enemies our player must avoid
var Enemy = function() {
    Mortal.call(this);
    
    this.yOffset = 25;
    this.baseMinSpeed = 150;
    this.baseMaxSpeed = 250;
    this.minSpeed = this.baseMinSpeed;
    this.maxSpeed = this.baseMaxSpeed;
    
    this.sprite = 'images/enemy-bug.png';
}
Enemy.prototype = Object.create(Mortal.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.spawn = function() {
    this.speed = Resources.getRandomInt(this.minSpeed, this.maxSpeed);
    this.row = Resources.getRandomInt(1, 3);
    this.col = -1;
    this.y = this.row * rowHeight;
    this.x = this.col * colWidth;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var distanceTraveled = Math.round(this.speed) * dt;
    
    // Don't let enemies overlap/overtake one another
    for (e = 0; e < allEnemies.length; e++) {
        if(allEnemies[e] !== this && allEnemies[e].row == this.row && allEnemies[e].x > this.x){
            var distanceApart = Math.abs(allEnemies[e].x - this.x) - colWidth;
            
            if (distanceTraveled > distanceApart){
                // An enemy behind a slower enemy will boost the speed of the slower enemy
                if(allEnemies[e].speed < allEnemies[e].maxSpeed) {
                    var boost = 200 * dt;
                    var speedDifference = this.speed - allEnemies[e].speed;
                    
                    if (boost > speedDifference) boost = speedDifference;
                    allEnemies[e].speedBoost(boost);
                }
                
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

Enemy.prototype.speedBoost = function(boost) {
    if (this.speed < this.maxSpeed) {
        if (this.speed + boost > this.maxSpeed) this.speed = this.maxSpeed;
        else this.speed += boost;
    }
}



// The player
var APlayer = function() {
    Mortal.call(this);
    
    this.yOffset = 35; // How much to offset y position when drawing sprite on tile
    
    this.characters = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
    ];
    this.currentCharacter = -1;
    this.changeCharacter();
    
    this.maxHealth = 3;
    this.health = this.maxHealth;
    
    this.backToStart();
    
    this.upcomingMove = null;
    this.moveCooldown = 0;
    this.moveCooldownTime = 0.25;
}
APlayer.prototype = Object.create(Mortal.prototype);
APlayer.prototype.constructor = APlayer;

APlayer.prototype.renderPlayerElements = function() {
    this.render();
    this.renderHealth();
}

APlayer.prototype.renderHealth = function() {
    for(h = 1; h <= this.health; h++) {
        ctx.drawImage(Resources.get('images/Heart.png'), canvas.width - (22 * h), 0, 20, 34);
    }
}

// Update the player's position
// Parameter: dt, a time delta between ticks
APlayer.prototype.update = function(dt) {
    if (this.moveCooldown > 0) {
        this.moveCooldown -= dt;
    }
    
    if (this.upcomingMove !== null && this.moveCooldown <= 0) {
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
            this.moveCooldown = this.moveCooldownTime;
        }
    }
    
    if (this.row == 0) {
        gameState.nextLevel();
        this.backToStart();
    }
    
    this.x = this.col * colWidth;
    this.y = this.row * rowHeight;
}

// Receive key input from event listener
APlayer.prototype.handleInput = function(keyPressed) {
    this.upcomingMove = null;
    
    if(keyPressed !== undefined) {
        if (keyPressed == 'up' || keyPressed == 'down' || keyPressed == 'left' || keyPressed == 'right') {
            this.upcomingMove = keyPressed;
        }
        else if(keyPressed == 'c') {
            // If player is still in grass, change character sprite
            if (this.row > 3) {
                this.changeCharacter();
            }
        }
    }
}

APlayer.prototype.changeCharacter = function() {
    this.currentCharacter++;
    if (this.currentCharacter > this.characters.length - 1) this.currentCharacter = 0;
    this.sprite = this.characters[this.currentCharacter];
}

APlayer.prototype.backToStart = function() {
    this.col = 2;
    this.row = 5;
}

APlayer.prototype.die = function() {
    if (this.health > 1) {
        this.health--;
    }
    else {
        gameState.lose();
        this.health = this.maxHealth;
        this.changeCharacter();
    }
    this.backToStart();
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
gameState = new AGameState();
player = new APlayer();
gameState.resetEnemies();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
