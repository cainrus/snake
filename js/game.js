'use strict';

/**
 * @constructor
 * @param {object} options
 * @param {HTMLElement} options.container
 *
 * @param {boolean} [options.autostart=true]
 * @param {number} [options.cellWidth=10]
 *
 * @param {object} [options.colors]
 * @param {string} [options.colors.cell="black"]
 * @param {string} [options.colors.bg="white"]
 * @param {string} [options.colors.stroke="white"]
 * @param {string} [options.colors.text="black"]
 *
 * @param {object} [options.snake]
 * @param {object} [options.speed.speed=60]
 *
 * @param {object} [options.map]
 * @param {object} [options.map.width=25]
 * @param {object} [options.map.height=25]
 *
 * @param {object} [options.food]
 * @param {number} [options.food.atOnce=5]
 */
function SnakeGame(options) {

    // Options.
    this.options = options || {};

    this.options.autostart = 'autostart' in this.options ? this.options.autostart : true;
    this.options.cellWidth = this.options.cellWidth || 10;

    this.options.snake = this.options.snake || {};
    this.options.snake.speed = parseInt(this.options.snake.speed) || 60;

    this.options.map = this.options.map || {};
    this.options.map.width = this.options.map.width || 25;
    this.options.map.height = this.options.map.height || 25;

    this.options.food = this.options.food || {};
    this.options.food.atOnce = this.options.food.atOnce || 5;

    this.options.colors = this.options.colors || {};
    this.options.colors.cell = this.options.colors.cell || 'black';
    this.options.colors.stroke = this.options.colors.stroke || 'white';
    this.options.colors.bg = this.options.colors.bg || 'white';
    this.options.colors.text = this.options.colors.text || 'black';

    var totalCells = this.options.map.width * this.options.map.height;
    if (this.options.food.atOnce > totalCells) {
        throw new Error('Too many food at once');
    }

    if (!this.options.container) {
        throw new Error('Unable to get container');
    }

    // Init canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.options.cellWidth * this.options.map.width;
    this.height = this.options.cellWidth * this.options.map.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.options.container.appendChild(this.canvas);

    // Init modules.
    this.modules = {};
    this.modules.map = new Map({
        width: this.options.map.width,
        height: this.options.map.height
    });
    this.modules.food = new Food();
    this.modules.snake = new Snake({
        listenEl: document
    });
    this.modules.score = new Score();

    this.start();
}


SnakeGame.prototype.tick = function () {

    var ctx = this.ctx;
    this.ctx.font = 'normal bold 10px sans-serif';
    this.drawBg();

    var snake = this.modules.snake;
    var food = this.modules.food;
    var map = this.modules.map;
    var score = this.modules.score;

    if (snake.getDirection()) {
        snake.move();
    }

    if (map.checkOutOfBounds(snake.list) || snake.checkCollision()) {
        //restart game
        if (this.options.autostart) {
            this.start();
        } else {
            this.showScore();
        }


        //Lets organize the code a bit now.
        return;
    }

    if (food.checkCollision(snake.list)) {
        score.addScore();
        snake.extend();
        food.addFood(map.getRandomCell());
    }

    // Draw snake.
    snake.list.map(function (cell) {
        this.paintCell(cell.x, cell.y);
    }, this);

    // Draw food.
    food.list.map(function (food) {
        this.paintCell(food.x, food.y);
    }, this);

    var scoreText = "Score: " + score.getScore();
    ctx.fillStyle = this.options.colors.text;
    ctx.fillText(scoreText, 5, this.height - 5);

    var highScoreText = "HighScore: " + score.getHighScore();
    ctx.fillStyle = this.options.colors.text;
    ctx.fillText(highScoreText, this.width - 70, this.height - 5);
};

SnakeGame.prototype.drawBg = function () {
    this.ctx.fillStyle = this.options.colors.bg;
    this.ctx.fillRect(0, 0, this.width, this.height);
};

SnakeGame.prototype.showScore = function () {
    this.drawBg();
    var textHeight = 25;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    this.ctx.font = 'normal bold ' + textHeight + 'px sans-serif';

    this.ctx.fillStyle = this.options.colors.text;

    this.ctx.fillText("Game Over", this.width / 2, this.height / 2 - textHeight);
    this.ctx.fillText("Your score: " + this.modules.score.getScore(), this.width / 2, this.height / 2);
    this.ctx.fillText("High score: " + this.modules.score.getHighScore(), this.width / 2, this.height / 2 + textHeight);


};

SnakeGame.prototype.paintCell = function (x, y) {
    var ctx = this.ctx;
    ctx.fillStyle = this.options.colors.cell;
    ctx.fillRect(x * this.options.cellWidth, y * this.options.cellWidth, this.options.cellWidth, this.options.cellWidth);
    ctx.strokeStyle = this.options.colors.stroke;
    ctx.strokeRect(x * this.options.cellWidth, y * this.options.cellWidth, this.options.cellWidth, this.options.cellWidth);
};


SnakeGame.prototype.reset = function () {

    clearInterval(this._tickInterval);

    for (var moduleName in this.modules) {
        if (this.modules.hasOwnProperty(moduleName)) {
            if (this.modules[moduleName].reset) {
                this.modules[moduleName].reset();
            }
        }
    }
};

SnakeGame.prototype.addFood = function () {
    var food = this.modules.food,
        map = this.modules.map,
        foodAtOnce;

    foodAtOnce = this.options.food.atOnce - food.list.length;
    foodAtOnce = Math.max(0, foodAtOnce);

    do {
        food.addFood(map.getRandomCell());
    } while (--foodAtOnce > 0);
};

SnakeGame.prototype.start = function () {

    this.reset();
    this.addFood();

    clearInterval(this._tickInterval);
    this._tickInterval = setInterval(this.tick.bind(this), this.options.snake.speed);
};

/**
 * Destructor.
 */
SnakeGame.prototype.destroy = function () {
    this.reset();
    for (var moduleName in this.modules) {
        if (this.modules.hasOwnProperty(moduleName)) {
            if (this.modules[moduleName].destroy) {
                this.modules[moduleName].destroy();
            }
            delete this.modules[moduleName];
        }
    }

    var parent = this.canvas.parentNode;
    if (parent) {
        parent.removeChild(this.canvas);
    }
};
