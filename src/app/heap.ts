export class Heap<T> {
    items: T[] = [];
    compareFn = (a: T, b: T): boolean => a < b;

    constructor(items?: T[], compareFn?) {

    }

    insert(item: T) {
        this.items.push(item);

        let ind = this.items.length;
        while (this.compareFn(this.items[ind], this.items[Math.floor((ind - 1) / 2)])) {
            let temp = this.items[ind];

        }
    }
}