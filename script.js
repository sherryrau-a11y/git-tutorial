// 简单的本地存储封装
const STORAGE_KEY = "simple_todo_list";

function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 应用状态
let todos = loadTodos();
let currentFilter = "all"; // all | active | completed

// DOM
const inputEl = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const listEl = document.getElementById("todo-list");
const leftCountEl = document.getElementById("left-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

function render() {
  listEl.innerHTML = "";

  const filteredTodos = todos.filter((t) => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.completed) li.classList.add("completed");
    li.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    const delBtn = document.createElement("button");
    delBtn.className = "todo-delete";
    delBtn.innerHTML = "✕";

    checkbox.addEventListener("change", () => toggleTodo(todo.id));
    delBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    listEl.appendChild(li);
  });

  const leftCount = todos.filter((t) => !t.completed).length;
  leftCountEl.textContent = `${leftCount} 个未完成任务`;
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const newTodo = {
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
  };
  todos.unshift(newTodo);
  saveTodos(todos);
  render();
}

function toggleTodo(id) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos(todos);
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos(todos);
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos(todos);
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.filter === filter)
  );
  render();
}

// 事件绑定
addBtn.addEventListener("click", () => {
  addTodo(inputEl.value);
  inputEl.value = "";
  inputEl.focus();
});

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo(inputEl.value);
    inputEl.value = "";
  }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setFilter(btn.dataset.filter);
  });
});

// 初次渲染
render();
