// kanbanAPI data class
export default class kanbanAPI {
    static getItems(columnId) {
        const column = read().find(column => column.id == columnId);

        if (!column) {
            return [];
        }

        return column.items;
    }

    // insert LocalStorage data item function
    static insertItem(columnId, content) {
        // constants being declared
        const data = read();
        const column = data.find(column => column.id == columnId);
        const item = {
            id: Math.floor(Math.random() * 100000),
            content: content
        };

        if(!column) {
            console.error("There is no Column");
        }

        column.items.push(item);
        save(data);

        return item;
    }

    // update LocalStorage data item function
    static updateItem(itemId, newData) {
        // constants being declared
        const data = read();
        const [item, currentColumn] = (() => {
            for (const column of data) {
                const item = column.items.find(item => item.id == itemId);

                if (item) {
                    return [item, column];
                }
            }
        })();

        if (!item) {
            console.error("Item not found.");
        }

        item.content = newData.content === undefined ? item.content : newData.content;

        // Updating the column and positioning of the task card
        if (
            newData.columnId !== undefined
            && newData.position !== undefined
        ) {
            const selectedColumn = data.find(column => column.id == newData.columnId);

            if (!selectedColumn) {
                console.error("Selected column not found.");
            }

            // Delete the task card from it's current column.
            currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

            // Moving task card into it's new selected column & position.
            selectedColumn.items.splice(newData.position, 0, item);
        }

        save(data);
    }

    // delete LocalStorage data item function
    static deleteItem(itemId) {
        // constants being declared
        const data = read();

        for (const column of data) {
            const item = column.items.find(item => item.id == itemId);

            if (item) {
                column.items.splice(column.items.indexOf(item), 1);
            }
        }
        save(data);
    }
}

// read data function
function read() {
    // constants being declared
    const json = localStorage.getItem("kanban-data");
    
    if (!json) {
        return [
            {
                id: 1,
                items: []
            },
            {
                id: 2,
                items: []
            },
            {
                id: 3,
                items: []
            }
        ];
    }

    return JSON.parse(json);
}

// save data function
function save(data) {
    // Web LocalStorage location and key name being seta and defined.
    // name of storage key is "kanban-data" and data is being stored in JSON arrays. 
    localStorage.setItem("kanban-data", JSON.stringify(data));
}