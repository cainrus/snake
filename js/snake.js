'use strict';

function Snake(options) {

    var self = this;
    this.length = 0;
    this.options = options || {};


    var listenerHandler = function (e) {
        var direction = self.getDirection();
        switch (e.keyCode) {
            case 37:
                if (direction !== 'right') {
                    self.setDirection('left');
                }
                break;
            case 38:
                if (direction !== 'down') {
                    self.setDirection('up');
                }
                break;
            case 39:
                if (direction !== 'left') {
                    self.setDirection('right');
                }
                break;
            case 40:
                if (direction !== 'up') {
                    self.setDirection('down');
                }
                break;
        }
    };

    this.stopListenKeys = function () {
        this.options.listenEl.removeEventListener('keydown', listenerHandler, true);
    };

    this.startListenKeys = function () {
        this.stopListenKeys();
        this.options.listenEl.addEventListener('keydown', listenerHandler, true);
    };

    this.startListenKeys();

}


Snake.prototype.setDirection = function (direction) {
    this.checkDirection(direction);
    this.direction = direction;
};

Snake.prototype.getDirection = function () {
    return this.direction;
};

Snake.prototype.checkCollision = function () {
    for (var x1 = 0, len1 = this.list.length; x1 < len1; x1++) {
        for (var x2 = 0, len2 = this.list.length; x2 < len2; x2++) {
            if (this.list[x1] !== this.list[x2] && this.list[x1].x == this.list[x2].x && this.list[x1].y == this.list[x2].y) {
                return true;
            }
        }
    }
};

Snake.prototype.reset = function () {
    this.list = [];
    this.length = this.options.length || 5;
    var isHorizontal = true;
    delete this.direction;
    if (this.options.direction) {
        this.setDirection(this.options.direction);
        isHorizontal = this.isHorizonal();
    }

    for (var i = this.length - 1; i >= 0; i--) {
        isHorizontal ? this.list.push({x: i, y: 0}) : this.list.push({x: 0, y: i});
    }
};


Snake.prototype.checkDirection = function (d) {
    if (['right', 'down', 'left', 'up'].indexOf(d) === -1) {
        throw new Error('Invalid direction: ' + d);
    }
};

Snake.prototype.isHorizonal = function () {
    var direction = this.getDirection();
    return direction === 'left' || direction === 'right';
};

Snake.prototype.move = function () {

    var direction = this.getDirection();
    var head = this.list[0];
    var x = head.x;
    var y = head.y;


    if (direction === "right") {
        x++;
    } else if (direction === "left") {
        x--;
    } else if (direction === "up") {
        y--;
    } else if (direction === "down") {
        y++;
    } else {
        throw new Error('Invalid direction');
    }

    var newHead;
    if (this.length === this.list.length) {
        newHead = this.list.pop();
        newHead.x = x;
        newHead.y = y;
    } else if (this.length > this.list.length) {
        newHead = {x: x, y: y};
    }

    this.list.unshift(newHead);
};

Snake.prototype.extend = function () {
    this.length++;
};