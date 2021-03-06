/*
 * AGameState stores high level data and methods
 * 
 * Also contains stage (level) data as property AGameState.stage, see AStage below
 */
var AGameState = function() {
    this.level = 1;
    this.startingEnemyCount = 3;
    
    this.currentTextMessage = null;
    this.currentTextMessageTimeLeft = 0;
    this.currentTextMessagePriority = 0;
    this.currentTextMessageColor = 'black';
    
    this.stage = new AStage();
};

AGameState.prototype.renderLevelText = function() {
    ctx.save();
    ctx.font = '36px Helvetica';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
    ctx.fillStyle = 'black';
    ctx.fillText('Level ' + this.level, 5, 0);
    ctx.restore();
};

AGameState.prototype.renderMessageText = function() {
    if (this.currentTextMessageTimeLeft > 0 && this.currentTextMessage !== null) {
        ctx.save();
        ctx.font = '40px Helvetica';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = this.currentTextMessageColor;
        ctx.fillText(this.currentTextMessage, canvas.width / 2, 0);
        ctx.strokeText(this.currentTextMessage, canvas.width / 2, 0);
        ctx.restore();
    }
};

AGameState.prototype.respawnEnemies = function(newLevel) {
    if (newLevel === undefined) {
        newLevel = false;
    }
    
    for (var e = 0; e < allEnemies.length; e++) {
        allEnemies[e].spawn(newLevel);
    }
};

AGameState.prototype.resetEnemies = function() {
    allEnemies = [];
    for (var e = 0; e < this.startingEnemyCount; e++) {
        allEnemies[e] = new Enemy();
    }
};

AGameState.prototype.update = function(dt) {
    allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    player.update(dt);
    this.updateText(dt);
};

AGameState.prototype.updateText = function(dt) {
    this.currentTextMessageTimeLeft -= dt;
    if (this.currentTextMessageTimeLeft <= 0) {
        this.currentTextMessageTimeLeft = 0;
        this.currentTextMessage = null;
        this.currentTextMessagePriority = 0;
        this.currentTextMessageColor = 'black';
    }
};

AGameState.prototype.nextLevel = function() {
    this.level++;
    
    if (this.level > 50) {
        this.win();
        return;
    }
    
    this.stage.updateForLevel(this.level);
    
    if (allEnemies.length <= this.stage.numCols + 1 && (this.level - 1) % 15 == 0) {
        allEnemies.push(new Enemy());
        gameState.showTextMessage('+1 Enemy!', 1, 5, 'red');
    }
    
    for (var e = 0; e < allEnemies.length; e++) {
        // Increase the allowed range of enemy speeds up by 2 per level after level 1
        allEnemies[e].minSpeed = allEnemies[e].baseMinSpeed + ( (this.level - 1) * 2);
        allEnemies[e].maxSpeed = allEnemies[e].baseMaxSpeed + ( (this.level - 1) * 2);
    }
    
    this.respawnEnemies(true);
};

AGameState.prototype.reset = function() {
    this.level = 1;
    this.stage.updateForLevel(this.level);
    
    player.currentCharacter = Resources.getRandomInt(0, player.characters.length - 1);
    player.changeCharacter();
    
    this.resetEnemies();
    this.respawnEnemies(true);
    player.reset();
};

AGameState.prototype.showTextMessage = function(text, secondsToDisplay, priority, color) {
    if (priority === undefined) priority = 0;
    
    if (this.currentTextMessage === null ||
        this.currentTextMessageTimeLeft <= 0 ||
        priority >= this.currentTextMessagePriority) {
        this.currentTextMessage = text;
        this.currentTextMessageTimeLeft = secondsToDisplay;
        this.currentTextMessagePriority = priority;
        if (color !== undefined) this.currentTextMessageColor = color;
        else this.currentTextMessageColor = 'black';
    }
    
};

AGameState.prototype.lose = function() {
    this.reset();
    
    this.showTextMessage('You Lost', 2.5, 10, 'red');
};

AGameState.prototype.win = function() {
    gameState.showTextMessage('YOU WIN!', 5, 10, '#060');
    this.reset();
};



/*
 * Stores information and rendering code for levels
 */
var AStage = function() {
    this.numRows = 6;
    this.numCols = 5;
    
    // Data for enemy spawns
    this.firstStoneRow = 1;
    this.lastStoneRow = 3;
};

/*
 * Update the level layout based on AStage.levelData property
 */
AStage.prototype.updateForLevel = function(level) {
    levelNumForData = level;
    
    // Level data is allowed to be sparse - that is, there does not need to be an entry for every level.
    // If there isn't data for the current level, go back and use the most recent level layout preceding this one
    while (!(levelNumForData in this.levelData) && levelNumForData > 1) {
        levelNumForData--;
    }
    
    this.rowTypes = this.levelData[levelNumForData].rowTypes;
    this.rowEnemyDirection = this.levelData[levelNumForData].rowEnemyDirection;
};

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
};

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
};

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
};



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
};
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
    if (newLevel) {
        this.col = null;
        while (this.col === null) {
            this.row = Resources.getRandomInt(gameState.stage.firstStoneRow, gameState.stage.lastStoneRow);
            
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
        this.row = Resources.getRandomInt(gameState.stage.firstStoneRow, gameState.stage.lastStoneRow);
        
        if (gameState.stage.rowEnemyDirection[this.row] == 'right') this.col = -1;
        else if (gameState.stage.rowEnemyDirection[this.row] == 'left') this.col = gameState.stage.numCols + 1;
        else console.log('Error: invalid enemy spawn row ' + this.row);
    }
    
    if (gameState.stage.rowEnemyDirection[this.row] == 'right') this.spriteFlipped = false;
    else if (gameState.stage.rowEnemyDirection[this.row] == 'left') this.spriteFlipped = true;
    
    this.y = this.row * rowHeight;
    this.x = this.col * colWidth;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var distanceTraveled = Math.round(this.speed) * dt;
    
    var enemyDirection = gameState.stage.rowEnemyDirection[this.row];
    
    // Don't let this enemy overlap/overtake other enemies
    for (var e = 0; e < allEnemies.length; e++) {
        if (allEnemies[e] !== this && allEnemies[e].row == this.row &&
           ( (enemyDirection == 'right' && allEnemies[e].x > this.x) ||
           (enemyDirection == 'left' && allEnemies[e].x < this.x) ) ) {
            var distanceApart = Math.abs(allEnemies[e].x - this.x) - colWidth;
            
            if (distanceTraveled > distanceApart) {
                // Make an enemy behind a slower enemy boost the speed of the slower enemy
                // But only up to the actual difference between the two enemies
                if (allEnemies[e].speed < allEnemies[e].maxSpeed) {
                    var boost = 200 * dt;
                    var speedDifference = this.speed - allEnemies[e].speed;
                    
                    if (boost > speedDifference) boost = speedDifference;
                    allEnemies[e].speedBoost(boost);
                }
                
                //If there is some gap between the enemies, allow this enemy to travel the distance of the gap
                if (distanceApart > 0) distanceTraveled = distanceApart;
                else distanceTraveled = 0;
            }
        }
    }
    
    if (enemyDirection == 'right') this.x += distanceTraveled;
    else if (enemyDirection == 'left') this.x -= distanceTraveled;
    
    // Update current column once the majority of the enemy sprite has traveled over into another tile
    if (enemyDirection == 'right' && this.x - this.col * colWidth > colWidth / 2) {
        this.col += 1;
    }
    else if (enemyDirection == 'left' && this.col * colWidth - this.x > colWidth / 2) {
        this.col -= 1;
    }
    
    this.checkPlayerCollision();
    
    // Once enemy travels offscreen, respawn it
    if (this.col > 6 || this.col < -1) {
        this.spawn();
    }
};

Enemy.prototype.checkPlayerCollision = function() {
    if (this.row == player.row && this.col == player.col) {
        player.die();
    }
};

/*
 * Boost the speed of an enemy, but only up to its maximum speed
 */
Enemy.prototype.speedBoost = function(boost) {
    if (this.speed < this.maxSpeed) {
        if (this.speed + boost > this.maxSpeed) this.speed = this.maxSpeed;
        else this.speed += boost;
    }
};



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
    this.moveCooldown = 0;   // How many seconds are left before the player can move again
    this.moveCooldownTime = 0.25;   // How many seconds must pass between each player move
};
APlayer.prototype = Object.create(Mortal.prototype);
APlayer.prototype.constructor = APlayer;

APlayer.prototype.renderPlayerElements = function() {
    this.render();
    this.renderHealth();
};

/*
 * Display hearts at the top right of the canvas to show remaining player health
 */
APlayer.prototype.renderHealth = function() {
    for (var h = 1; h <= this.health; h++) {
        ctx.drawImage(Resources.get('images/Heart.png'), canvas.width - (22 * h), 0, 20, 34);
    }
};

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
        // The player made it across!
        gameState.nextLevel();
        this.backToStart();
        
        gameState.showTextMessage('Safe!', 1, 0, 'blue');
    }
    
    this.x = this.col * colWidth;
    this.y = this.row * rowHeight;
};

// Receive keyboard input from event listener
APlayer.prototype.handleInput = function(keyPressed) {
    if (keyPressed !== undefined) {
        if (keyPressed == 'up' || keyPressed == 'down' || keyPressed == 'left' || keyPressed == 'right') {
            this.upcomingMove = keyPressed;
        }
        else if(keyPressed == 'c') {
            // If player is still in grass, let them change character sprite
            if (gameState.stage.rowTypes[this.row] != 'stone') {
                this.changeCharacter();
            }
        }
    }
};

APlayer.prototype.changeCharacter = function() {
    this.currentCharacter++;
    if (this.currentCharacter > this.characters.length - 1) this.currentCharacter = 0;
    this.sprite = this.characters[this.currentCharacter];
};

APlayer.prototype.backToStart = function() {
    this.col = 2;
    this.row = 5;
};

APlayer.prototype.reset = function() {
    this.health = this.maxHealth;
};

APlayer.prototype.die = function() {
    if (this.health > 1) {
        this.health--;
        
        gameState.showTextMessage('Ouch!', 1.5, 0, 'red');
    }
    else {
        gameState.lose();
        this.changeCharacter();
    }
    
    this.backToStart();
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var gameState = new AGameState();
var player = new APlayer();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c'   // added to let the player change character sprite
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
