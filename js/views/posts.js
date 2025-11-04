import { el, Input, List } from '../components.js';
import { getPosts } from '../api.js';
import { Breadcrumbs } from '../breadcrumbs.js';

function postCard(p, router) {
	return el('div', { cls: 'post-item' },
		el('div', { cls: 'post-header' },
			el('div', { cls: 'post-title' }, p.title),
			el('div', { cls: 'user-badge' }, `User ${p.userId}`)
		),
		el('div', { cls: 'post-body' }, p.body),
		el('div', { cls: 'actions' },
			el('button', {
				cls: 'btn-ghost',
				on: { click: () => router.navigate(`#users#posts#comments?post=${p.id}`) }
			}, '💬 Comments')
		)
	);
}

export default async function PostsView({ parts, router }) {
	const container = el('div', {});
	container.append(Breadcrumbs(parts, router));

	const header = el('div', { cls: 'header' },
		el('div', { cls: 'brand' }, 'Posts'),
		el('div', { cls: 'search' })
	);

	const search = Input('Search title or body', { cls: 'input' });
	header.querySelector('.search').append(search);
	container.append(header);

	const listWrap = el('div', { cls: 'list' });
	container.append(listWrap);

	async function refresh() {
		listWrap.innerHTML = '';
		const posts = await getPosts();
		const q = search.value.trim().toLowerCase();
		const filtered = q ? posts.filter(p =>
			p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
		) : posts;

		if (!filtered.length) {
			listWrap.append(el('div', { cls: 'no-data' }, 'Ничего не найдено'));
		} else {
			filtered.forEach(p => listWrap.append(postCard(p, router)));
		}
	}

	let t;
	search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(refresh, 300); });

	await refresh();
	return container;
}