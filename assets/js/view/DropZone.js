// KanbanAPI class being imported
import kanbanAPI from "../api/kanbanAPI.js";

export default class DropZone {
    static createDropZone() {
        const range = document.createRange();

        range.selectNode(document.body);

        const dropZone = range.createContextualFragment(`
            <div class="kanban-dropzone"></div>
        `).children[0];

        // dragover task card event listener configuration
        dropZone.addEventListener("dragover", e => {
            e.preventDefault();
            dropZone.classList.add("kanban-dropzone--active");
        });

        // dragleave task card event listener configuration
        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("kanban-dropzone--active");
        });

        // dropzone for task card event listener configuration
        dropZone.addEventListener("drop", e => {
            e.preventDefault();
            dropZone.classList.remove("kanban-dropzone--active");

            // constants being declared for task card content being indexed when dropped
            const columnElement = dropZone.closest(".kanban-column");
            const columnId = Number(columnElement.dataset.id);
            const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban-dropzone"));
            const droppedIndex = dropZonesInColumn.indexOf(dropZone);
            const itemId = Number(e.dataTransfer.getData("text/plain"));
            const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
            const insertAfter = dropZone.parentElement.classList.contains("Kanban-items") ? dropZone.parentElement : dropZone;

            if (droppedItemElement.contains(dropZone)) {
                return;
            }

            // column id and position updated when task card is being dropped into new location
            insertAfter.after(droppedItemElement);
            kanbanAPI.updateItem(itemId, { 
                columnId,
                position: droppedIndex
            });
        });

        return dropZone;
    }
}