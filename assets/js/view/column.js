// kanbanAPI, Card & DropZone classes beig imported
import kanbanAPI from "../api/kanbanAPI.js";
import Card from "./card.js";
import DropZone from "./DropZone.js";

export default class Column {
    constructor(id, title) {
        const topDropZone = DropZone.createDropZone();

        // element objects defined
        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector(".kanban-column-title");
        this.elements.items = this.elements.root.querySelector(".kanban-column-cards");
        this.elements.addItem = this.elements.root.querySelector(".taskcard-add");

        this.elements.root.dataset.id = id;
        this.elements.title.textContent = title;
        this.elements.items.appendChild(topDropZone);

        // creating task card event listener for create task button
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

        // virtual DOM tree being made for kanban board HTML layout: JS dynamically creates the HTML 
        return range.createContextualFragment(`
        <<div class="kanban-column">
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