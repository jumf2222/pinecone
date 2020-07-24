import { Schedule } from "./definitions";

/** Created by Mina */
class Heap {
    elements: Schedule[] = [];
    heapSize = 0;

    constructor() {
        this.elements = [];
        this.heapSize = 0;
    }

    parent(i) {
        return (i - 1) / 2;
    }

    child(i, j) {
        return (2 * i + j);
    }

    extractAndInsert(element) {
        if (this.heapSize < 10) { this.insert(element); return; }
        if (element > this.elements[0]) { return; }

        this.elements[0] = element;
        let i = 0;

        while ((this.child(i, 1) < this.heapSize || this.child(i, 2) < this.heapSize) &&
            (this.elements[this.child(i, 1)].score > this.elements[i].score ||
                this.elements[this.child(i, 2)].score > this.elements[i].score)) {

            if (this.child(i, 2) < this.heapSize) {
                const temp = this.elements[i];
                this.elements[i] = this.elements[this.child(i, 2)];
                this.elements[this.child(i, 2)] = temp;
                i = this.child(i, 2);
            } else {
                const temp = this.elements[i];
                this.elements[i] = this.elements[this.child(i, 1)];
                this.elements[this.child(i, 1)] = temp;
                i = this.child(i, 1);
            }
        }
    }

    extractMax() {
        if (this.heapSize === 0) { return null; }

        const max = this.elements[0];
        let i = 0;
        while ((this.child(i, 1) < this.heapSize || this.child(i, 2) < this.heapSize)) {
            if (this.child(i, 2) < this.heapSize) {
                const temp = this.elements[i];
                this.elements[i] = this.elements[this.child(i, 2)];
                this.elements[this.child(i, 2)] = temp;
                i = this.child(i, 2);
            } else {
                const temp = this.elements[i];
                this.elements[i] = this.elements[this.child(i, 1)];
                this.elements[this.child(i, 1)] = temp;
                i = this.child(i, 1);
            }
        }
        this.heapSize -= 1;
        return max;
    }

    insert(element) {
        this.elements.push(element);
        this.heapSize += 1;

        let i = this.heapSize - 1;
        while (i !== 0 && this.elements[this.parent(i)].score < this.elements[i].score) {
            const temp = this.elements[i];
            this.elements[i] = this.elements[this.parent(i)];
            this.elements[this.parent(i)] = temp;
            i = this.parent(i);
        }
    }
}
