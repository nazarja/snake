
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.prev = null;
        this.next = null;
        this.head = false;
    };
};

export default class Snake {
    constructor() {
        this.length = 0;
        this.head = null;
        this.tail = null;
        this.x = 0;
        this.y = 1;
    };

    createSnake() {
        const node = new Node(7, 8);
        node.head = true;
        this.head = node;
        this.tail = node;
        this.length++;

        [1, 2, 3].forEach(() => this.addSnake());
    };

    addSnake() {
        const node = new Node(this.tail.x - this.x, this.tail.y - this.y);
        node.next = this.tail;
        this.tail.prev = node;
        this.tail = node;
        this.length++;
    };
 
    moveSnake() {
        let current = this.tail;
        while (current) {
            if (current === this.head) {
                current.x += this.x;
                current.y += this.y;
            }
            else {
                current.x = current.next.x;
                current.y = current.next.y;
            };

            if (current.x > 14) current.x = 0;
            else if (current.x < 0) current.x = 14;
            else if (current.y > 14) current.y = 0;
            else if (current.y < 0) current.y = 14;

            current = current.next;
        };
    };

    getSnake() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current);
            current = current.prev;
        };
        return arr;
    };
};