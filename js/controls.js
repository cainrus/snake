'use strict';
(function () {
    var game;

    var options = document.getElementById('options');
    var startButton = document.getElementById('startButton');
    var optionsButton = document.getElementById('optionsButton');

    optionsButton.addEventListener('click', function () {
        if (options.style.display !== 'block') {
            options.style.display = 'block';
        } else {
            options.style.display = 'none';
        }
    });
    startButton.addEventListener('click', function () {

        if (game) {
            game.destroy();
        }

        startButton.innerHTML = 'Restart';
        var mapHeight = document.getElementById('map_height').value - 0;
        var mapWidth = document.getElementById('map_width').value - 0;
        var foodAtOnce = document.getElementById('food_at_once').value - 0;
        var speed = document.getElementById('speed').value - 0;
        var autostart = document.getElementById('autostart').checked;

        var bg_color = document.getElementById('bg_color').value;
        var cell_color = document.getElementById('cell_color').value;
        var text_color = document.getElementById('text_color').value;

        game = new SnakeGame({
            autostart: autostart,
            container: document.getElementById('container'),
            colors: {
                cell: cell_color,
                stroke: bg_color,
                bg: bg_color,
                text: text_color
            },
            cellWidth: 10,
            food: {
                atOnce: foodAtOnce
            },
            snake: {
                speed: 60 / speed
            },
            map: {
                width: mapWidth,
                height: mapHeight
            }
        });

    });

}());
