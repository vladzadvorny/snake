window.onload = function () {
    var size = {x: 33, y: 20};
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
        top:
            do {
                this.position = new Pixel(random(size.x - 1), random(size.y - 1));

                for (var i = 0; i < snake.body.length; i++) {
                    if (snake.body[i].x !== this.position.x || snake.body[i].y !== this.position.y) {
                        break top;
                    }
                }
            } while (true);
    };

    var end = function () {
        clearInterval(intervalId);
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

    document.body.focus();
    document.body.onkeydown = function (e) {
        e = e || window.event;
        var newDirection;

        if (e.keyCode === 37 || e.keyCode === 65) {
            newDirection = 'left';
        }
        else if (e.keyCode === 38 || e.keyCode === 87) {
            newDirection = 'up';
        }
        else if (e.keyCode === 39 || e.keyCode === 68) {
            newDirection = 'right';
        }
        else if (e.keyCode === 40 || e.keyCode === 83) {
            newDirection = 'down';
        }

        if (newDirection !== undefined) snake.setDirection(newDirection);
    };

    var joystick = document.querySelectorAll('.left-btn, .up-btn, .right-btn, .down-btn');

    for (var i = 0; i < joystick.length; i++) {
        joystick[i].addEventListener('touchstart', function () {
            var direction = this.className.toString().replace(/-btn/g, '');
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

    var intervalId = setInterval(function () {
        clean();
        snake.move();
        snake.draw();
        egg.draw();
    }, 200);
};