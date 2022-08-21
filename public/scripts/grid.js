
export default class Grid {
    constructor(rows, cells) {
        this.rows = rows;
        this.cells = cells;
        this.addGrid();
    };

    drawGrid() {
        const board = document.querySelector('#board');
        board.innerHTML = null;
        this.grid.forEach(row => row.forEach(cell => {
            const div = document.createElement('div');
            div.classList.add('cell', cell ?? 'empty');
            board.append(div);
        }));
    };

    addGrid() {
        this.grid = new Array(this.rows).fill(null).map(row => new Array(this.cells).fill(null));
    };

    addSnake(snake) {
        snake.forEach(cell => this.grid[cell.x][cell.y] = cell.head ? 'head' : 'snake');
    };

    addApple(seed = false) {
        if (seed) {
            const arr = [];
            this.grid.forEach((row, i) => row.forEach((cell, j) => cell ?? arr.push({x: i, y: j})));
            this.apple = arr[Math.floor(Math.random() * arr.length)];
        };
        this.grid[this.apple.x][this.apple.y] = 'apple';
    };
};