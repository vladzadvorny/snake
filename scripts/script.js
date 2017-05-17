window.onload = function () {
    var size = {x: 42, y: 24};

    // Draw display
    (function () {
        var table = document.createElement('table');
        for (var i = 0; i < size.y; i++) {
            var row = table.insertRow(i);
            for (var j = 0; j < size.x; j++) {
                row.insertCell(j);
            }
        }
        document.querySelector('.display').appendChild(table);
    })();

    var Pixel = function (x, y) {
        this.x = x;
        this.y = y;
    };

    Pixel.prototype.show = function () {
        document.querySelector('.display table tr:nth-child(' + (this.y + 1) + ')'
            + ' td:nth-child(' + (this.x + 1) + ')').classList.add('red');
    };

    Pixel.prototype.equal = function (otherPixel) {
        return this.x === otherPixel.x && this.y === otherPixel.y;
    };
    /**
     *
     * @constructor
     */
    var Egg = function () {
        this.position = new Pixel(10, 10);
    };

    Egg.prototype.draw = function () {
        this.position.show();
    };

    Egg.prototype.random = function () {
        return {x: Math.floor()}
    };

    var Snake = function () {
        this.body = [
            new Pixel(7, 4),
            new Pixel(6, 4),
            new Pixel(5, 4)
        ];

        this.direction = '→';
        this.nextDirection = '→';
    };

    Snake.prototype.draw = function () {
        for (var i = 0; i < this.body.length; i++)
            this.body[i].show();
    };

    Snake.prototype.move = function () {
        var head = this.body[0];
        var nextStep;

        this.direction = this.nextDirection;

        if (this.direction === '→')
            nextStep = new Pixel(head.x + 1, head.y);
        else if (this.direction === '↓')
            nextStep = new Pixel(head.x, head.y + 1);
        else if (this.direction === '←')
            nextStep = new Pixel(head.x - 1, head.y);
        else if (this.direction === '↑')
            nextStep = new Pixel(head.x, head.y - 1);

        if (this.fail(nextStep)) {
            end();
            return;
        }

        this.body.unshift(nextStep);
    };


};