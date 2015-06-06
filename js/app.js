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

AGameState.prototype.respawnEnemies = function(newLevel) {
    if (newLevel === undefined) {
        newLevel = false;
    }
    
    for(e = 0; e < allEnemies.length; e++) {
        allEnemies[e].spawn(newLevel);
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
    
    if (this.level > 50) {
        this.win();
        return;
    }
    
    this.stage.updateForLevel(this.level);
    
    if (allEnemies.length <= this.stage.numCols + 1 && (this.level - 1) % 15 == 0) {
        allEnemies.push(new Enemy());
    }
    
    for(e = 0; e < 3; e++) {
        allEnemies[e] = new Enemy();
        allEnemies[e].minSpeed = allEnemies[e].baseMinSpeed + (this.level * 2) - 2;
        allEnemies[e].maxSpeed = allEnemies[e].baseMaxSpeed + (this.level * 2) - 2;
    }
    
    this.respawnEnemies(true);
}

AGameState.prototype.lose = function() {
    this.level = 1;
    this.stage.updateForLevel(this.level);
    this.resetEnemies();
    this.respawnEnemies(true);
}

AGameState.prototype.win = function() {
    this.lose();
}



var AStage = function() {
    this.numRows = 6;
    this.numCols = 5;
    
    // Data for enemy spawns
    this.firstStoneRow = 1;
    this.lastStoneRow = 3;
}

AStage.prototype.updateForLevel = function(level) {
    if (level <= 5) {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'right',
            'right',
            'right',
            null,
            null
        ]
    }
    else if (level <= 10) {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'left',
            'right',
            'right',
            null,
            null
        ]
    }
    else if (level <= 15) {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'left',
            'left',
            'right',
            null,
            null
        ]
    }
    else if (level <= 20) {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'right',
            'right',
            'right',
            null,
            null
        ]
    }
    else if (level <= 25) {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'right',
            'left',
            'left',
            null,
            null
        ]
    }
    else if (level <= 30) {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'right',
            'right',
            'left',
            null,
            null
        ]
    }
    else if (level <= 35) {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'left',
            'left',
            'left',
            null,
            null
        ]
    }
    else if (level <= 40) {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'left',
            'right',
            'right',
            null,
            null
        ]
    }
    else if (level <= 45) {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'right',
            'left',
            'right',
            null,
            null
        ]
    }
    else {
        this.rowTypes = [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ]
        
        this.rowEnemyDirection = [
            null,
            'left',
            'right',
            'left',
            null,
            null
        ]
    }
}

AStage.prototype.render = function() {
    // Blank canvas to ensure there are no artifacts from previous frame
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var row, col;

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < this.numRows; row++) {
        var rowType = this.rowTypes[row];
        if (rowType == 'water') cellSprite = 'images/water-block.png';
        else if (rowType == 'stone') cellSprite = 'images/stone-block.png';
        else if (rowType == 'grass') cellSprite = 'images/grass-block.png';
        for (col = 0; col < this.numCols; col++) {
            /* The drawImage function of the canvas' context element
             * requires 3 parameters: the image to draw, the x coordinate
             * to start drawing and the y coordinate to start drawing.
             * We're using our Resources helpers to refer to our images
             * so that we get the benefits of caching these images, since
             * we're using them over and over.
             */
            ctx.drawImage(Resources.get(cellSprite), col * colWidth, row * rowHeight);
        }
    }
}


var Mortal = function() {
    this.yOffset = 0; // How much to offset y position when drawing sprite on tile
    
    this.sprite = 'images/Gem Green.png';   // Fallback image, should not be used in real game
    this.spriteFlipped = false;
}
Mortal.prototype.render = function() {
    ctx.save();
    if (this.spriteFlipped) {
        ctx.scale(-1, 1);
        posX = this.x * -1 - colWidth;
    }
    else {
        posX = this.x;
    }
    ctx.drawImage(Resources.get(this.sprite), posX, this.y - this.yOffset);
    ctx.restore();
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

Enemy.prototype.spawn = function(newLevel) {
    if (newLevel === undefined) {
        newLevel = false;
    }
    
    this.speed = Resources.getRandomInt(this.minSpeed, this.maxSpeed);
    this.row = Resources.getRandomInt(gameState.stage.firstStoneRow, gameState.stage.lastStoneRow);
    if(newLevel) {
        this.col = null;
        while (this.col === null) {
            possCol = Resources.getRandomInt(-1, gameState.stage.numCols);
            for(var e = 0; e < allEnemies.length; e++) {
                if (allEnemies[e] !== this && allEnemies[e].col == possCol) {
                    possCol = null;
                    break;
                }
            }
            this.col = possCol;
        }
    }
    else {
        if (gameState.stage.rowEnemyDirection[this.row] == 'right') this.col = -1;
        else if(gameState.stage.rowEnemyDirection[this.row] == 'left') this.col = gameState.stage.numCols + 1;
        else {
            console.log('Error: invalid enemy spawn row ' + this.row);
        }
    }
    
    if (gameState.stage.rowEnemyDirection[this.row] == 'right') this.spriteFlipped = false;
    else if (gameState.stage.rowEnemyDirection[this.row] == 'left') this.spriteFlipped = true;
    
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
    
    var enemyDirection = gameState.stage.rowEnemyDirection[this.row];
    
    // Don't let enemies overlap/overtake one another
    for (e = 0; e < allEnemies.length; e++) {
        if(allEnemies[e] !== this && allEnemies[e].row == this.row &&
           ( (enemyDirection == 'right' && allEnemies[e].x > this.x) ||
           (enemyDirection == 'left' && allEnemies[e].x < this.x) ) ){
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
    
    if(enemyDirection == 'right') this.x += distanceTraveled;
    else if(enemyDirection == 'left') this.x -= distanceTraveled;
    
    // Update current column if necessary
    if (enemyDirection == 'right' && this.x - this.col * colWidth > colWidth / 2) {
        this.col += 1;
    }
    else if (enemyDirection == 'left' && this.col * colWidth - this.x > colWidth / 2) {
        this.col -= 1;
    }
    
    this.checkCollision();
    
    if (this.col > 6 || this.col < -1) {
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
            if (gameState.stage.rowTypes[this.row] != 'stone') {
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
