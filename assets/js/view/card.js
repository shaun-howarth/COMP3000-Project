import kanbanAPI from "../api/kanbanAPI.js";

export default class Card {
    constructor(id, content) {
        this.elements = {};
        this.elements.root = Card.createRoot();
        this.elements.input = this.elements.root.querySelector(".taskcard-input");

        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;
        this.content = content;

        // updating the contents of a single task card: uses blur
        const onBlur = () => {
            const newContent = this.elements.input.textContent.trim();

            if (newContent == this.content) {
                return;
            }

            this.content = newContent;
            kanbanAPI.updateItem(id, {
                content: this.content
            });
        };

        this.elements.input.addEventListener("blur", onBlur);
        // deleting a single task card and it's contents from double clicking on card: uses blur
        this.elements.root.addEventListener("dblclick", () => {
            const check = confirm("Warning: Are you sure you want to delete this Task Card?");

            if (check) {
                kanbanAPI.deleteItem(id);

                this.elements.input.removeEventListener("blur", onBlur);
                this.elements.root.parentElement.removeChild(this.elements.root);
            }
        });
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="kanban-items" draggable="true">
                <div class="taskcard-input" contenteditable></div>
            </div>
        `).children[0];
    }
}