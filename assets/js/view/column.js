export default class Column {
    constructor(id, title) {
        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector(".kanban-column-title");
        this.elements.items = this.elements.root.querySelector(".kanban-column-cards");
        this.elements.addItem = this.elements.root.querySelector(".taskcard-add");
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="kanban-column">
                <span class="kanban-column-title"></span>
                <div class="kanban-column-cards"></div>
                <button class="taskcard-add" type="button">+Create Card</button>
            </div>
        `).children[0];
    }
}