export default class kanbanAPI {
    static getItems(columnId) {
        const column = read().find(column => column.id == columnId);

        if (!column) {
            return [];
        }

        return column.items;
    }

    static insertItem(columnId, content) {
        const data = read();
        const column = data.find(column => column.id == columnId);
        const item = {
            id: Math.floor(Math.random() * 1000000),
            content
        };

        if(!column) {
            console.error("There is no Column");
        }

        column.items.push(item);
        save(data);

        return item;
    }

    // GO BACK TO THIS FUNCTION
    static updateItem(itemId, newData) {
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

        item.column = newData.content == undefined ? item.content : newData.content;

        // Updating the column and position of the task card.
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

    static deleteItem(itemId) {
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

// read function
function read() {
    const json = localStorage.getItem("board-data");
    
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
// save function
function save(data) {
    localStorage.setItem("board-data", JSON.stringify(data));
}