'use strict';

function Map(options) {

    options = options || {};
    var defaults = {
        width: 25,
        height: 25
    };
    this.width = options.width || defaults.width;
    this.height = options.height || defaults.height;

    /**
     * @param {Array} list
     * @return {boolean}
     */
    this.checkOutOfBounds = function (list) {
        for (var i = 0, len = list.length, item; i < len; i++) {
            item = list[i];
            if (item.x < 0 || item.y < 0 || item.x > this.width - 1 || item.y > this.height - 1) {
                return true;
            }
        }
    };

    this.getRandomCell = function () {
        var cell = {
            x: Math.round(Math.random() * this.width),
            y: Math.round(Math.random() * this.height)
        };
        return cell;
    };

}