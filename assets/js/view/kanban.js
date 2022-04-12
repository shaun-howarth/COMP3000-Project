// Column class being imported
import Column from "./column.js";

// kanban data array class
export default class Kanban {
    constructor(root) {
        this.root = root;

        // kanban root being defined for new column: with column id and title Constants 
        Kanban.columns().forEach(column => {
            const columnView = new Column(column.id, column.title);
            this.root.appendChild(columnView.elements.root);
        });
    }
    // kanban columns being defined as an array of three data items
    static columns() {
        return [
            {
                id: 1,
                title: "Not Started"
            },
            {
                id: 2,
                title: "In Progress"
            },
            {
                id: 3,
                title: "Complete"
            }
        ];
    }
}