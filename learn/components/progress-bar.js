const progress = document.querySelector('#progress');
const bar = document.querySelector('#bar');

class ProgressBar {
    constructor(items, element = null) {
        this.items = items;
        this.element = element;
        this.render();
    }

    get total() {
        return this.items.length;
    }

    get completed() {
        return this.items.filter(item => item.done).length;
    }

    get percentage() {
        return (this.completed / this.total) * 100;
    }

    complete(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.done = true;
            this.render();
        }
    }

    render() {
        if (this.element) {
            this.element.style.width = this.percentage + '%';
        }
    }
}


const items = [
    { id: 1, done: false },
    { id: 2, done: false },
    { id: 3, done: false },
];

const progressBar = new ProgressBar(items, bar);


items.forEach(item => {
    const btn = document.getElementById(`item-${item.id}`);
    btn.addEventListener('click', () => {
        progressBar.complete(item.id);
    });
});

