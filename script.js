const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
let currentFilter = "all";

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

// Format date as readable text
function formatDate(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-info">
        <strong>${task.text}</strong>
        <span class="task-date">${formatDate(task.date)}</span>
      </div>
      <div class="task-actions">
        <button class="complete-btn">
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Complete / Undo
    li.querySelector(".complete-btn").addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Delete
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  updateStats();
}

// Update statistics
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;
}

// Add new task
function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (text === "") {
    alert("Please enter a study task.");
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    date,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  // Clear inputs
  taskInput.value = "";
  taskDate.value = "";
  taskInput.focus();
}

// Event listeners
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Filter buttons
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// Initial render
renderTasks();