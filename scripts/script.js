window.onload = function () {
    var size = {x: 30, y: 18};
    var score = 0;

    // Draw display
    (function () {
        var table = document.createElement('table');
        for (var i = 0; i < size.y; i++) {
            var row = table.insertRow(i);
            for (var j = 0; j < size.x; j++) {
                row.insertCell(j).appendChild(document.createElement('div'));
            }
        }
        document.querySelector('.display').appendChild(table);
    })();

    var random = function (max) {
        return Math.floor(Math.random() * (max + 1));
    };

    var Pixel = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    Pixel.prototype.show = function () {
        document.querySelector('.display table tr:nth-child(' + (this.y + 1) + ')'
            + ' td:nth-child(' + (this.x + 1) + ')').classList.add('show');
    };

    Pixel.prototype.equal = function (otherPixel) {
        return this.x === otherPixel.x && this.y === otherPixel.y;
    };

    var clean = function () {
        var get = document.querySelectorAll('.display table td.show');
        for (var i = 0; i < get.length; i++) get[i].classList.remove('show');
    };

    var scoreUpdate = function () {
        document.querySelector('.score span').innerHTML = score.toString();
    };


    var Egg = function () {
        this.position = new Pixel();
    };

    Egg.prototype.draw = function () {
        this.position.show();
    };

    Egg.prototype.move = function () {
        var newPosition;
        var isSnake = function (newPosition) {
            for (var i = 0; i < snake.body.length; i++) {
                if (newPosition.equal(snake.body[i])) {
                    return true;
                }
            }
            return false;
        };

        do {
            newPosition = new Pixel(random(size.x - 1), random(size.y - 1));
        } while (isSnake(newPosition));

        this.position = newPosition;
    };

    var end = function () {
        interval.stop();
        timer.stop();
        document.querySelector('.gameover').style.display = 'block';
    };

    var Snake = function () {
        this.body = [
            new Pixel(7, 4),
            new Pixel(6, 4),
            new Pixel(5, 4)
        ];

        this.direction = 'right';
        this.nextDirection = 'right';
    };

    Snake.prototype.draw = function () {
        for (var i = 0; i < this.body.length; i++) {
            this.body[i].show();
        }
    };

    Snake.prototype.move = function () {
        var head = this.body[0];
        var nextStep;

        this.direction = this.nextDirection;

        if (this.direction === 'right') {
            nextStep = new Pixel(head.x + 1, head.y);
        } else if (this.direction === 'down') {
            nextStep = new Pixel(head.x, head.y + 1);
        }
        else if (this.direction === 'left') {
            nextStep = new Pixel(head.x - 1, head.y);
        }
        else if (this.direction === 'up') {
            nextStep = new Pixel(head.x, head.y - 1);
        }

        if (this.fail(nextStep)) {
            end();
            return;
        }

        this.body.unshift(nextStep);

        if (nextStep.equal(egg.position)) {
            score++;
            scoreUpdate();
            egg.move();
            window.navigator.vibrate(40);
        } else {
            this.body.pop();
        }
    };

    Snake.prototype.fail = function (head) {
        // left | top | right | bottom
        var wallFail = (head.x + 1 === 0) || (head.y + 1 === 0) || (head.x === size.x) || (head.y === size.y);
        var selfFail = false;
        for (var i = 0; i < this.body.length; i++) {
            if (head.equal(this.body[i])) {
                selfFail = true;
            }
        }
        return wallFail || selfFail;
    };

    Snake.prototype.setDirection = function (newDirection) {
        if (this.direction === 'up' && newDirection === 'down') {
            return;
        }
        else if (this.direction === 'right' && newDirection === 'left') {
            return;
        }
        else if (this.direction === 'down' && newDirection === 'up') {
            return;
        }
        else if (this.direction === 'left' && newDirection === 'right') {
            return;
        }

        this.nextDirection = newDirection;
    };

    var Timer = function () {
        this.sec = 0;
    };

    Timer.prototype.start = function () {
        var self = this;
        var format = function (num) {
            return (num < 10 ) ? '0' + num : num;
        };

        this.setInterval = setInterval(function () {
            self.sec++;
            document.querySelector('.time span').innerHTML =
                format(Math.floor(self.sec / 60)) + ':' + format(self.sec % 60);
        }, 1000);
    };

    Timer.prototype.stop = function () {
        clearInterval(this.setInterval);
    };

    var keyNames = {
        32: "space",
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    document.body.focus();
    document.body.onkeydown = function (e) {
        e = e || window.event;
        var keyName = keyNames[e.keyCode];

        if (keyName !== undefined) {
            if (keyName === 'space') {
                playPause();
            } else {
                snake.setDirection(keyName);
            }
        }
    };

    var joystick = document.querySelectorAll('.btn');

    for (var i = 0; i < joystick.length; i++) {
        joystick[i].addEventListener('touchstart', function () {
            var direction = this.getAttribute('data-direction');
            snake.setDirection(direction);
            this.classList.toggle('btn-active');
        }, false);

        joystick[i].addEventListener('touchend', function () {
            this.classList.toggle('btn-active');
        }, false);
    }

    var snake = new Snake();
    var egg = new Egg();
    egg.move();
    var timer = new Timer();
    timer.start();

    var Interval = function () {
        this._interval = null;
    };

    Interval.prototype.start = function () {
        this._interval = setInterval(function () {
            clean();
            snake.move();
            snake.draw();
            egg.draw();
        }, 200);
    };

    Interval.prototype.stop = function () {
        clearInterval(this._interval);
        timer.stop();
    };

    var interval = new Interval();
    interval.start();

    function restart() {
        playPause();
        flag = true;

        interval.stop();
        interval = null;
        interval = new Interval();
        score = 0;
        scoreUpdate();
        snake = new Snake();
        egg = new Egg();
        egg.move();
        timer = new Timer();
        timer.start();
        document.querySelector('.gameover').style.display = 'none';
        interval.start();
    }

    var flag = true;
    function playPause() {
        var child = document.querySelector('.play-pause').children[0];
        if (flag) {
            interval.stop();
            interval = null;
            timer.stop();
            child.classList.remove('glyphicon-pause');
            child.classList.add('glyphicon-play');
            flag = false;
        } else {
            interval = new Interval();
            interval.start();
            timer.start();
            child.classList.remove('glyphicon-play');
            child.classList.add('glyphicon-pause');
            flag = true;
        }
    }

    document.querySelector('.restart').onclick = restart;
    document.querySelector('.play-pause').onclick = playPause;
};