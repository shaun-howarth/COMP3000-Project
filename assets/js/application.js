// Parent Kanban class being imported containing column array data structure
import Kanban from "./view/kanban.js";
// application JS file acting as intiator for kanban HTML div class "kanban"
new Kanban(
    document.querySelector(".kanban")
);