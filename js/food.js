'use strict';

/**
 *
 * @param {object} [options={}]
 * @param {object} [options.foodAtOnce=Function|number]
 *
 * @constructor
 */
function Food(options) {
    this.options = options || {};
    this.list = [];
}

/**
 * @param {{x:number,y:number}} cell
 */
Food.prototype.addFood = function (cell) {
    this.list.push(cell);
};

/**
 * Check collision.
 * Remove food if matched.
 *
 * @param {{x:number,y:number}[]} list
 * @returns {boolean}
 */
Food.prototype.checkCollision = function (list) {
    for (var i = 0, len = this.list.length; i < len; i++) {
        for (var i1 = 0, len1 = list.length; i1 < len1; i1++) {
            if (this.list[i].x === list[i1].x && this.list[i].y === list[i1].y) {
                this.list.splice(i, 1);
                return true;
            }
        }
    }
};

Food.prototype.reset = function () {
    this.list = [];
};