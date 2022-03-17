export default class Column {
    constructor(id, colTitle) {
        this.elements = {};
        this.elements.root = Column.createRoot();
        
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