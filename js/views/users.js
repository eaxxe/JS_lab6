import { el, Input, Button, List, Card } from '../components.js';
import { getUsers } from '../api.js';
import { loadLocalUsers, addLocalUser, removeLocalUser } from '../storage.js';
import { Breadcrumbs } from '../breadcrumbs.js';

function userCard(u, router, refresh) {
	const userInfo = el('div', { cls: 'user-info' },
		el('div', { cls: 'user-photo' }, (u.name || '?').split(' ').map(s => s[0]).slice(0, 2).join('')),
		el('div', { cls: 'user-details' },
			el('div', { cls: 'user-name' }, u.name || u.username),
			el('div', { cls: 'user-email' }, u.email || '')
		)
	);

	const actions = el('div', { cls: 'user-actions' },
		el('div', { cls: 'action-column' },
			Button('Todos', {
				cls: 'btn-action',
				on: { click: () => router.navigate(`#users#todos?user=${u.id}`) }
			})
		),
		el('div', { cls: 'action-separator' }),
		el('div', { cls: 'action-column' },
			Button('Posts', {
				cls: 'btn-action',
				on: { click: () => router.navigate(`#users#posts?user=${u.id}`) }
			})
		)
	);

	const deleteBtn = el('button', {
		cls: 'btn-delete',
		on: {
			click: () => {
				if (confirm('Удалить пользователя?')) {
					removeLocalUser(u.id);
					refresh();
				}
			}
		}
	}, '×');

	return el('div', { cls: 'user-card' }, userInfo, actions, deleteBtn);
}

export default async function UsersView({ parts, router }) {
	const container = el('div', {});
	const crumbs = Breadcrumbs(parts, router);
	container.append(crumbs);

	const header = el('div', { cls: 'header' },
		el('div', { cls: 'brand' }, 'Users'),
		el('div', { cls: 'search' })
	);

	const input = Input('Поиск по имени или email', { cls: 'input', on: { input: () => { } } });
	const addName = Input('Имя', { cls: 'input-inline' });
	const addEmail = Input('Email', { cls: 'input-inline' });
	const addBtn = Button('Add user');

	header.querySelector('.search').append(input);
	container.append(header);

	const gridContainer = el('div', { cls: 'users-grid' });
	container.append(gridContainer);

	async function refresh() {
		gridContainer.innerHTML = '';
		const remote = await getUsers();
		const local = loadLocalUsers();
		const all = [...local, ...remote];
		const q = input.value.trim().toLowerCase();
		const filtered = q ? all.filter(u =>
			(u.name || '').toLowerCase().includes(q) ||
			(u.email || '').toLowerCase().includes(q)
		) : all;

		if (!filtered.length) {
			gridContainer.append(el('div', { cls: 'no-data' }, 'Ничего не найдено'));
		} else {
			filtered.forEach(u => gridContainer.append(userCard(u, router, refresh)));
		}
	}

	addBtn.addEventListener('click', () => {
		const name = addName.value.trim();
		const email = addEmail.value.trim();
		if (!name || !email) { alert('Введите имя и email'); return; }
		addLocalUser({ name, email });
		addName.value = ''; addEmail.value = '';
		refresh();
	});

	const form = el('div', { cls: 'card' },
		el('div', {}, el('strong', {}, 'Добавить пользователя')),
		el('div', { cls: 'form-row' }, addName, addEmail, addBtn)
	);
	container.append(form);

	let t;
	input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(refresh, 300); });
	container.append(el('div', { cls: 'page-end' }));

	await refresh();
	return container;
}