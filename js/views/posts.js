import { el, Input, List } from '../components.js';
import { getPosts } from '../api.js';
import { Breadcrumbs } from '../breadcrumbs.js';

function postCard(p, router) {
	return el('div', { cls: 'card' },
		el('div', { cls: 'row' },
			el('div', {}, el('strong', {}, p.title)),
			el('div', { cls: 'meta' }, `user ${p.userId}`)
		),
		el('div', { cls: 'small' }, p.body),
		el('div', { cls: 'form-row' },
			el('button', {
				cls: 'btn-ghost',
				on: { click: () => router.navigate(`#users#posts#comments?post=${p.id}`) }
			}, 'comments')
		)
	);
}

export default async function PostsView({ parts, router }) {
	const container = el('div', {});
	container.append(Breadcrumbs(parts, router));

	const header = el('div', { cls: 'header' }, el('div', { cls: 'brand' }, 'Posts'));
	const search = Input('Search title or body', { cls: 'input' });
	header.append(search);
	container.append(header);

	const listWrap = el('div', {});
	container.append(listWrap);

	async function refresh() {
		listWrap.innerHTML = '';
		const posts = await getPosts();

		// достаём query-параметры
		const params = new URLSearchParams(location.hash.split('?')[1] || '');
		const userFilter = params.get('user');

		const q = search.value.trim().toLowerCase();
		let filtered = q
			? posts.filter(p =>
				p.title.toLowerCase().includes(q) ||
				p.body.toLowerCase().includes(q)
			)
			: posts;

		if (userFilter) {
			filtered = filtered.filter(p => String(p.userId) === String(userFilter));
		}

		if (!filtered.length) {
			listWrap.append(el('div', { cls: 'no-data' }, 'Ничего не найдено'));
		} else {
			listWrap.append(List(filtered.map(p => postCard(p, router))));
		}
	}

	let t;
	search.addEventListener('input', () => {
		clearTimeout(t);
		t = setTimeout(refresh, 300);
	});
	container.append(el('div', { cls: 'page-end' }));

	await refresh();
	return container;
}
