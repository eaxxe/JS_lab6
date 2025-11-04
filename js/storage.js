const USERS_KEY = 'lab_users_custom';
const TODOS_KEY = 'lab_todos_custom';

export function loadLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveLocalUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

export function addLocalUser(user) {
  const list = loadLocalUsers();
  user.id = Date.now() + Math.floor(Math.random()*1000);
  list.unshift(user);
  saveLocalUsers(list);
  return user;
}

export function removeLocalUser(userId) {
  const list = loadLocalUsers().filter(u => u.id !== userId);
  saveLocalUsers(list);
}

export function loadLocalTodos() {
  try { return JSON.parse(localStorage.getItem(TODOS_KEY) || '[]'); } 
  catch { return []; }
}

export function saveLocalTodos(list) { localStorage.setItem(TODOS_KEY, JSON.stringify(list)); }

export function addLocalTodo(todo) {
  const list = loadLocalTodos();
  todo.id = Date.now() + Math.floor(Math.random()*1000);
  list.unshift(todo);
  saveLocalTodos(list);
  return todo;
}
