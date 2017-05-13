window.onload = function () {
    (function () {
        var table = document.createElement('table');
        for (var i = 0; i < 42; i++) { //24
            var row = table.insertRow(i);
            for (var j = 0; j < 42; j++) {
                row.insertCell(j);
            }
        }
        document.querySelector('.display').appendChild(table);
    })();

    var getPixel = function (x, y) {
        return document.querySelector(`.display table tr:nth-child(${y + 1}) td:nth-child(${x + 1})`);
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    setInterval(function () {
        var egg = [Math.floor((Math.random() * 42)), Math.floor((Math.random() * 42))];
        getPixel(egg[0], egg[1]).style.backgroundColor=getRandomColor();

    }, 1);
}