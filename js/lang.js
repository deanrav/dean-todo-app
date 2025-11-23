const translations = {
  id: { title: "Tugas Saya", placeholder: "Tulis tugas baru...", total: "tugas", completed: "selesai", emptyAlert: "Tugas tidak boleh kosong!", undone: "Tugas dihapus", undo: "Undo" },
  en: { title: "My Tasks", placeholder: "Write a new task...", total: "tasks", completed: "completed", emptyAlert: "Task cannot be empty!", undone: "Task deleted", undo: "Undo" },
  ja: { title: "私のタスク", placeholder: "新しいタスクを書く...", total: "件のタスク", completed: "完了", emptyAlert: "タスクを入力してください！", undone: "タスクを削除しました", undo: "元に戻す" },
  ko: { title: "내 할 일", placeholder: "새로운 할 일 작성...", total: "개 작업", completed: "완료됨", emptyAlert: "할 일을 입력해주세요!", undone: "작업이 삭제됨", undo: "실행 취소" }
};

let currentLang = localStorage.getItem('language') || 'id';
document.documentElement.lang = currentLang;

function translate() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    const text = translations[currentLang][key] || translations['id'][key];
    if (el.tagName === 'INPUT') el.placeholder = text;
    else el.textContent = text;
  });
  document.getElementById('langSelect').value = currentLang;
}