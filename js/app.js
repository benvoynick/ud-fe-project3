/*
 * AGameState stores high level data and methods
 * 
 * Also contains stage (level) data as property AGameState.stage, see AStage below
 */
var AGameState = function() {
    this.level = 1;
    this.startingEnemyCount = 3;
    
    this.stage = new AStage();
}

AGameState.prototype.renderLevelText = function() {
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
    for(e = 0; e < this.startingEnemyCount; e++) {
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
    
    for(e = 0; e < allEnemies.length; e++) {
        // Move the allowed range of enemy speeds up by 2 per level
        allEnemies[e].minSpeed = allEnemies[e].baseMinSpeed + (this.level * 2) - 2;
        allEnemies[e].maxSpeed = allEnemies[e].baseMaxSpeed + (this.level * 2) - 2;
    }
    
    this.respawnEnemies(true);
}

AGameState.prototype.reset = function() {
    this.level = 1;
    this.stage.updateForLevel(this.level);
    
    player.currentCharacter = Resources.getRandomInt(0, player.characters.length - 1);
    player.changeCharacter();
    
    this.resetEnemies();
    this.respawnEnemies(true);
    player.reset();
}

AGameState.prototype.lose = function() {
    this.reset();
}

AGameState.prototype.win = function() {
    this.reset();
}



/*
 * Stores information and rendering code for levels
 */
var AStage = function() {
    this.numRows = 6;
    this.numCols = 5;
    
    // Data for enemy spawns
    this.firstStoneRow = 1;
    this.lastStoneRow = 3;
}

/*
 * Update the level layout based on AStage.levelData property
 */
AStage.prototype.updateForLevel = function(level) {
    levelNumForData = level;
    
    // Level data is allowed to be sparse - that is, there does not need to be an entry for every level.
    // If there isn't data for this specific level, go back and use the most recent level layout preceding this one
    while (!(levelNumForData in this.levelData) && levelNumForData > 1) {
        levelNumForData--;
    }
    
    this.rowTypes = this.levelData[levelNumForData].rowTypes;
    this.rowEnemyDirection = this.levelData[levelNumForData].rowEnemyDirection;
}

AStage.prototype.render = function() {
    var row, col;
    
    for (row = 0; row < this.numRows; row++) {
        var rowType = this.rowTypes[row];
        if (rowType == 'water') cellSprite = 'images/water-block.png';
        else if (rowType == 'stone') cellSprite = 'images/stone-block.png';
        else if (rowType == 'grass') cellSprite = 'images/grass-block.png';
        
        for (col = 0; col < this.numCols; col++) {
            ctx.drawImage(Resources.get(cellSprite), col * colWidth, row * rowHeight);
        }
    }
}

/*
 * Defines level layouts and enemy directions
 *
 * Key is the first level number for which data will be used
 *
 * Each entry must have:
 * A "rowTypes" array setting the tile type for all six rows
 * A "rowEnemyDirection" array setting enemy direction as "left" or "right" for all stone tile rows
 */
AStage.prototype.levelData = {
    1 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'right',
            'right',
            'right',
            null,
            null
        ]
    },
    6 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'left',
            'right',
            'right',
            null,
            null
        ]
    },
    11 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'left',
            'left',
            'right',
            null,
            null
        ]
    },
    16 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'right',
            'right',
            'right',
            null,
            null
        ]
    },
    21 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'right',
            'left',
            'left',
            null,
            null
        ]
    },
    26 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'right',
            'right',
            'left',
            null,
            null
        ]
    },
    31 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'left',
            'left',
            'left',
            null,
            null
        ]
    },
    36 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'left',
            'right',
            'right',
            null,
            null
        ]
    },
    41 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'right',
            'left',
            'right',
            null,
            null
        ]
    },
    46 : {
        rowTypes : [
            'water',
            'stone',
            'stone',
            'stone',
            'grass',
            'grass'
        ],
        rowEnemyDirection : [
            null,
            'left',
            'right',
            'left',
            null,
            null
        ]
    }
}


/*
 * This superclass is used as the basis for the Player and Enemy classes
 */
var Mortal = function() {
    this.yOffset = 0; // How much to offset a sprite's y position when drawing it on a tile
    
    this.sprite = 'images/Gem Green.png';   // Fallback image, if this shows up in game a Mortal didn't set its sprite correctly
    this.spriteFlipped = false;   // If true, the render function will flip the sprite horizontally
}
Mortal.prototype.render = function() {
    ctx.save();
    
    if (this.spriteFlipped) {
        // If the sprite needs to be flipped horizontally, this .scale() call will reverse the sprite orientation
        ctx.scale(-1, 1);
        // This .scale(-1, 1) call also reverses the sprite's horizontal position
        // Because of this, sprite must render at the opposite horizontal position minus a column's width to end up in the correct spot
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
    this.baseMinSpeed = 150;   // The lowest speed an enemy can have
    this.baseMaxSpeed = 250;   // The highest speed an enemy can have
    // The below two variables are meant to be modified in the course of the game, as opposed to the base numbers above
    this.minSpeed = this.baseMinSpeed;
    this.maxSpeed = this.baseMaxSpeed;
    
    this.sprite = 'images/enemy-bug.png';
}
Enemy.prototype = Object.create(Mortal.prototype);
Enemy.prototype.constructor = Enemy;

/*
 * Give an enemy a new position & speed at random.
 *
 * If newLevel is set to true, the enemy will be allowed to spawn in any column that isn't already occupied by an enemy.
 * If newLevel is false (or not set) the enemy will be spawned in the proper offscreen column to make it traverse the row
 */
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

APlayer.prototype.reset = function() {
    this.health = this.maxHealth;
}

APlayer.prototype.die = function() {
    if (this.health > 1) {
        this.health--;
    }
    else {
        gameState.lose();
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
