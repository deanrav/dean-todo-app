const e = {
  taskInput: document.getElementById('taskInput'),
  deadlineInput: document.getElementById('deadlineInput'),
  prioritySelect: document.getElementById('prioritySelect'),
  categorySelect: document.getElementById('categorySelect'),
  addBtn: document.getElementById('addBtn'),
  taskList: document.getElementById('taskList'),
  searchInput: document.getElementById('searchInput'),
  langSelect: document.getElementById('langSelect'),
  themeToggle: document.getElementById('themeToggle'),
  progressFill: document.getElementById('progressFill'),
  progressText: document.getElementById('progressText'),
  toast: document.getElementById('toast'),
  tabs: document.querySelectorAll('.tab')
};

let tasks = JSON.parse(localStorage.getItem('dean-todo-tasks')) || [];
let currentLang = localStorage.getItem('lang') || 'id';
let deletedTask = null;

// TERJEMAHAN LENGKAP
const translations = {
  id: { title: "Tugas Saya", placeholder: "Tulis tugas baru...", all: "Semua", active: "Aktif", completed: "Selesai", undone: "Tugas dihapus", undo: "Undo" },
  en: { title: "My Tasks", placeholder: "Write a new task...", all: "All", active: "Active", completed: "Done", undone: "Task deleted", undo: "Undo" },
  ko: { title: "내 할 일", placeholder: "새로운 할 일 작성...", all: "전체", active: "진행중", completed: "완료", undone: "작업 삭제됨", undo: "실행 취소" },
  ja: { title: "私のタスク", placeholder: "新しいタスクを入力...", all: "すべて", active: "進行中", completed: "完了", undone: "タスクを削除", undo: "元に戻す" }
};

const labels = {
  priority: { id: { low: "Rendah", medium: "Sedang", high: "Tinggi", urgent: "Mendesak" }, en: { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" }, ko: { low: "낮음", medium: "보통", high: "높음", urgent: "긴급" }, ja: { low: "低", medium: "中", high: "高", urgent: "緊急" } },
  category: { id: { personal: "Pribadi", work: "Kerja", study: "Belajar", health: "Kesehatan" }, en: { personal: "Personal", work: "Work", study: "Study", health: "Health" }, ko: { personal: "개인", work: "업무", study: "학습", health: "건강" }, ja: { personal: "個人", work: "仕事", study: "勉強", health: "健康" } }
};

// UPDATE DROPDOWN
function updateSelects() {
  e.prioritySelect.innerHTML = '';
  e.categorySelect.innerHTML = '';
  Object.entries(labels.priority[currentLang]).forEach(([k,v]) => e.prioritySelect.add(new Option(v,k)));
  Object.entries(labels.category[currentLang]).forEach(([k,v]) => e.categorySelect.add(new Option(v,k)));
}

// TERJEMAHKAN
function translate() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    el.textContent = translations[currentLang][key] || el.textContent;
    if (el.tagName === 'INPUT') el.placeholder = translations[currentLang][key] || el.placeholder;
  });
  document.querySelectorAll('.tab').forEach(tab => {
    const filter = tab.dataset.filter;
    tab.textContent = translations[currentLang][filter] || tab.textContent;
  });
}

// INIT
document.documentElement.lang = currentLang;
e.langSelect.value = currentLang;
translate();
updateSelects();
renderTasks();

// GANTI BAHASA
e.langSelect.addEventListener('change', () => {
  currentLang = e.langSelect.value;
  localStorage.setItem('lang', currentLang);
  document.documentElement.lang = currentLang;
  translate();
  updateSelects();
  renderTasks();
});

// DARK MODE
e.themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

// TAMBAH TUGAS
function addTask() {
  const text = e.taskInput.value.trim();
  if (!text) return;
  tasks.push({
    id: Date.now(),
    text,
    completed: false,
    priority: e.prioritySelect.value,
    category: e.categorySelect.value,
    deadline: e.deadlineInput.value || null
  });
  e.taskInput.value = ''; e.deadlineInput.value = '';
  saveAndRender();
}

// RENDER
function renderTasks() {
  const filter = document.querySelector('.tab.active').dataset.filter;
  e.taskList.innerHTML = '';
  tasks
    .filter(t => filter === 'all' || (filter === 'active' && !t.completed) || (filter === 'completed' && t.completed))
    .forEach(task => {
      const li = document.createElement('li');
      li.className = `task ${task.priority} ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" ${task.completed?'checked':''}>
        <span class="task-text">${task.text}</span>
        <span class="category-tag">${labels.category[currentLang][task.category]}</span>
        ${task.deadline ? `<span class="deadline">Deadline: ${new Date(task.deadline).toLocaleString(currentLang === 'id' ? 'id-ID' : 'en-US')}</span>` : ''}
        <button class="delete">×</button>
      `;
      li.querySelector('input').onclick = () => { task.completed = !task.completed; saveAndRender(); if (tasks.every(t=>t.completed)) confetti(); };
      li.querySelector('.delete').onclick = () => { deletedTask = task; tasks = tasks.filter(t => t.id !== task.id); saveAndRender(); showToast(); };
      e.taskList.appendChild(li);
    });
  updateProgress();
}

// PROGRESS
function updateProgress() {
  const done = tasks.filter(t => t.completed).length;
  const pct = tasks.length ? Math.round((done/tasks.length)*100) : 0;
  e.progressFill.style.width = pct + '%';
  e.progressText.textContent = pct + '% selesai';
}

// TOAST UNDO
function showToast() {
  e.toast.classList.add('show');
  setTimeout(() => e.toast.classList.remove('show'), 5000);
}
e.toast.onclick = () => {
  if (deletedTask) { tasks.push(deletedTask); deletedTask = null; saveAndRender(); }
};

// TABS
e.tabs.forEach(tab => tab.addEventListener('click', () => {
  e.tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  renderTasks();
}));

// SAVE
function saveAndRender() {
  localStorage.setItem('dean-todo-tasks', JSON.stringify(tasks));
  renderTasks();
}

// EVENT
e.addBtn.onclick = addTask;
e.taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());
e.searchInput.addEventListener('input', renderTasks);