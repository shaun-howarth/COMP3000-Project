import kanbanAPI from "../api/kanbanAPI.js";
import Card from "./card.js";

export default class Column {
    constructor(id, title) {
        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector(".kanban-column-title");
        this.elements.items = this.elements.root.querySelector(".kanban-column-cards");
        this.elements.addItem = this.elements.root.querySelector(".taskcard-add");

        this.elements.root.dataset.id = id;
        this.elements.title.textContent = title;

        this.elements.addItem.addEventListener ("click", () => {
            const newItem = kanbanAPI.insertItem(id, "");

            this.generateCard(newItem);
        });

        kanbanAPI.getItems(id).forEach(item => {
            this.generateCard(item);

        });
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

    generateCard(data) {
        const card = new Card(data.id, data.content);
        this.elements.items.appendChild(card.elements.root);
        
    }
}