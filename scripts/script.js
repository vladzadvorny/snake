window.onload = function () {
    var size = {x: 42, y: 24};
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
        this.x = x;
        this.y = y;
    };

    Pixel.prototype.show = function () {
        document.querySelector('.display table tr:nth-child(' + (this.y + 1) + ')'
            + ' td:nth-child(' + (this.x + 1) + ')').classList.add('show');
    };

    Pixel.prototype.equal = function (otherPixel) {
        return this.x === otherPixel.x && this.y === otherPixel.y;
    };

    var clear = function () {
        var get = document.querySelectorAll('.display table td.show');
        for (var i = 0; i < get.length; i++) get[i].className = '';
    };

    /**
     *
     * @constructor
     */
    var Egg = function () {
        this.position = new Pixel(random(size.x - 1), random(size.y - 1));
        // проверку на совпадение
    };

    Egg.prototype.draw = function () {
        this.position.show();
    };

    Egg.prototype.move = function () {
        this.position = new Pixel(random(size.x - 1), random(size.y - 1));
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
        for (var i = 0; i < this.body.length; i++)
            this.body[i].show();
    };

    Snake.prototype.move = function () {
        var head = this.body[0];
        var nextStep;

        this.direction = this.nextDirection;

        if (this.direction === 'right')
            nextStep = new Pixel(head.x + 1, head.y);
        else if (this.direction === 'down')
            nextStep = new Pixel(head.x, head.y + 1);
        else if (this.direction === 'left')
            nextStep = new Pixel(head.x - 1, head.y);
        else if (this.direction === 'up')
            nextStep = new Pixel(head.x, head.y - 1);

        if (this.fail(nextStep)) {
            //   end();
            return;
        }

        this.body.unshift(nextStep);

        if (nextStep.equal(egg.position)) {
            score++;
            egg.move();
        } else {
            this.body.pop();
        }
    };

    Snake.prototype.fail = function (head) {
        var left = (head.x + 1 === 0);
        var top = (head.y + 1 === 0);
        var right = (head.x === size.x);
        var bottom = (head.y === size.y);
        var wallFail = left || top || right || bottom;
        var selfFail = false;
        for (var i = 0; i < this.body.length; i++) {
            if (head.equal(this.body[i])) {
                selfFail = true;
            }
        }
        return wallFail || selfFail;
    };

    Snake.prototype.setDirection = function (newDirection) {
        if (this.direction === 'up' && newDirection === 'down')
            return;
        else if (this.direction === 'right' && newDirection === 'left')
            return;
        else if (this.direction === 'down' && newDirection === 'up')
            return;
        else if (this.direction === 'left' && newDirection === 'right')
            return;

        this.nextDirection = newDirection;
    };

    document.body.focus();
    document.body.onkeydown = function (e) {
        e = e || window.event;
        var newDirection;

        if (e.keyCode === 37 || e.keyCode === 65) newDirection = 'left';
        else if (e.keyCode === 38 || e.keyCode === 87) newDirection = 'up';
        else if (e.keyCode === 39 || e.keyCode === 68) newDirection = 'right';
        else if (e.keyCode === 40 || e.keyCode === 83) newDirection = 'down';

        if (newDirection !== undefined) snake.setDirection(newDirection);
    };

    var snake = new Snake();
    var egg = new Egg();

    var intervalId = setInterval(function () {
        clear();
        snake.move();
        snake.draw();
        egg.draw();
    }, 100);

};