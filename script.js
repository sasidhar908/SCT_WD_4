const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDue = document.getElementById('task-due');
const prioritySelect = document.getElementById('priority-select');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const toggleThemeBtn = document.getElementById('toggle-theme');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const date = taskDue.value;
  const priority = prioritySelect.value;

  if (text) {
    const task = {
      id: Date.now(),
      text,
      date,
      priority,
      completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskForm.reset();
  }
});

function renderTasks(filter = '') {
  taskList.innerHTML = '';
  tasks
    .filter(task => task.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach(task => {
      const li = document.createElement('li');
      li.className = 'task' + (task.completed ? ' completed' : '');

      const content = document.createElement('div');
      content.className = 'task-content';
      content.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})" />
        <strong>${task.text}</strong>
        <div class="task-date">⏰ ${task.date ? new Date(task.date).toLocaleString() : 'No due date'}</div>
        <div class="priority-${task.priority}">Priority: ${task.priority}</div>
      `;

      const actions = document.createElement('div');
      actions.className = 'task-actions';
      actions.innerHTML = `
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      `;

      li.appendChild(content);
      li.appendChild(actions);
      taskList.appendChild(li);
    });
}

function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks(searchInput.value);
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks(searchInput.value);
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt('Edit task:', task.text);
  if (newText !== null && newText.trim() !== '') {
    task.text = newText.trim();
    saveTasks();
    renderTasks(searchInput.value);
  }
}

function sortByDate() {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveTasks();
  renderTasks(searchInput.value);
}

function sortByPriority() {
  const order = { high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => order[a.priority] - order[b.priority]);
  saveTasks();
  renderTasks(searchInput.value);
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks(searchInput.value);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

searchInput.addEventListener('input', () => {
  renderTasks(searchInput.value);
});

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

renderTasks();































