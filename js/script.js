const taskForm = document.getElementById("taskForm");
const taskNameInput = document.getElementById("taskName");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskList = document.getElementById("taskList");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const emptyMessage = document.getElementById("emptyMessage");

const storageKey = "academicPlannerTasks";
let tasks = [];
let editingTaskId = null;

try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(savedTasks)) tasks = savedTasks;
} catch {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();
    emptyMessage.hidden = tasks.length > 0;

    tasks.forEach((task) => {
        const item = document.createElement("li");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        title.textContent = task.name;
        description.textContent = task.description;
        editButton.type = "button";
        editButton.textContent = "Edit";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        editButton.addEventListener("click", () => {
            editingTaskId = task.id;
            taskNameInput.value = task.name;
            taskDescriptionInput.value = task.description;
            saveButton.textContent = "Save Changes";
            cancelButton.hidden = false;
            taskNameInput.focus();
        });

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
            saveTasks();
            renderTasks();

            if (editingTaskId === task.id) resetForm();
        });

        item.append(title, description, editButton, deleteButton);
        taskList.appendChild(item);
    });
}

function resetForm() {
    taskForm.reset();
    editingTaskId = null;
    saveButton.textContent = "Save Task";
    cancelButton.hidden = true;
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = taskNameInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    if (!name || !description) return;

    if (editingTaskId) {
        const task = tasks.find((savedTask) => savedTask.id === editingTaskId);
        if (task) {
            task.name = name;
            task.description = description;
        }
    } else {
        tasks.push({
            id: Date.now().toString() + Math.random().toString(16).slice(2),
            name,
            description
        });
    }

    saveTasks();
    renderTasks();
    resetForm();
});

cancelButton.addEventListener("click", resetForm);

renderTasks();
