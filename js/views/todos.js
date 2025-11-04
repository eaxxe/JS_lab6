import { el, Input, Button, List } from '../components.js';
import { getTodos, getUsers } from '../api.js';
import { loadLocalTodos, addLocalTodo } from '../storage.js';
import { Breadcrumbs } from '../breadcrumbs.js';

function todoItem(t) {
	return el('div', { cls: 'todo-item' },
		el('div', { cls: 'todo-header' },
			el('div', { cls: 'todo-title' }, t.title),
			el('div', { cls: `status-badge ${t.completed ? 'status-completed' : 'status-pending'}` },
				t.completed ? 'Completed' : 'Pending')
		),
		el('div', { cls: 'todo-meta' },
			el('div', { cls: 'user-badge' }, `User: ${t.userId}`),
			el('div', { cls: 'meta' }, t.completed ? '✓ Done' : '⌛ Pending')
		)
	);
}

export default async function TodosView({ parts, router }) {
	const container = el('div', {});
	container.append(Breadcrumbs(parts, router));

	const header = el('div', { cls: 'header' },
		el('div', { cls: 'brand' }, 'Todos'),
		el('div', { cls: 'search' })
	);

	const search = Input('Поиск по title', { cls: 'input' });
	header.querySelector('.search').append(search);
	container.append(header);

	const listWrap = el('div', { cls: 'list' });
	container.append(listWrap);

	const addTitle = Input('Title', { cls: 'input-inline' });
	const addUser = el('select', { cls: 'input-inline' });
	const addBtn = Button('Add todo');

	container.append(
		el('div', { cls: 'card' },
			el('div', {}, el('strong', {}, 'Добавить todo')),
			el('div', { cls: 'form-row' }, addTitle, addUser, addBtn)
		)
	);

	async function refresh() {
		listWrap.innerHTML = '';
		const remote = await getTodos();
		const local = loadLocalTodos();
		const users = await getUsers();
		const params = new URLSearchParams(location.hash.split('?')[1] || '');
		const userFilter = params.get('user');
		const all = [...local, ...remote];
		const q = search.value.trim().toLowerCase();
		let filtered = q ? all.filter(t => (t.title || '').toLowerCase().includes(q)) : all;
		if (userFilter) filtered = filtered.filter(t => String(t.userId) === String(userFilter));

		if (!filtered.length) {
			listWrap.append(el('div', { cls: 'no-data' }, 'Ничего не найдено'));
		} else {
			filtered.forEach(t => listWrap.append(todoItem(t)));
		}

		addUser.innerHTML = '';
		users.forEach(u => addUser.append(new Option(u.name, u.id)));
	}

	addBtn.addEventListener('click', () => {
		const title = addTitle.value.trim();
		const userId = addUser.value;
		if (!title || !userId) { alert('Заполните поля'); return; }
		addLocalTodo({ title, userId: Number(userId), completed: false });
		addTitle.value = '';
		refresh();
	});

	let t;
	search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(refresh, 300); });

	await refresh();
	return container;
}