'use strict';

function Score() {
    this.score = 0;

}

Score.prototype.reset = function () {
    this.score = 0;
};

Score.prototype.addScore = function () {
    var highScore = this.getHighScore();
    this.score++;
    if (highScore < this.score) {
        this.saveHighScore(this.score);
    }

    return this.score;

};

Score.prototype.getScore = function () {

    return this.score;
};

Score.prototype.saveHighScore = function (score) {
    // localStorage can be disabled/broken.
    try {
        window.localStorage.setItem('highscore', score);
    } catch (e) {
    }
};

Score.prototype.getHighScore = function () {
    var highScore;
    // localStorage can be disabled/broken.
    try {
        highScore = Number(window.localStorage.getItem('highscore')) || 0;
    } catch (e) {
        highScore = 0;
    }

    return Math.max(highScore, this.score);
};


