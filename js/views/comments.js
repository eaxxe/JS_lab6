import { el, Input, List } from '../components.js';
import { getComments } from '../api.js';
import { Breadcrumbs } from '../breadcrumbs.js';

function commentCard(c) {
	return el('div', { cls: 'card' },
		el('div', {}, el('strong', {}, c.name)),
		el('div', { cls: 'small' }, c.email),
		el('div', { cls: 'meta' }, c.body)
	);
}

export default async function CommentsView({ parts }) {
	const container = el('div', {});
	container.append(Breadcrumbs(parts, { navigate: h => location.hash = h }));

	const header = el('div', { cls: 'header' }, el('div', { cls: 'brand' }, 'Comments'));
	const search = Input('Search name or body', { cls: 'input' });
	header.append(search);
	container.append(header);

	const listWrap = el('div', {});
	container.append(listWrap);

	async function refresh() {
		listWrap.innerHTML = '';
		const all = await getComments();
		const params = new URLSearchParams(location.hash.split('?')[1] || '');
		const postFilter = params.get('post');
		const q = search.value.trim().toLowerCase();
		let filtered = q ? all.filter(c => c.name.toLowerCase().includes(q) || c.body.toLowerCase().includes(q)) : all;
		if (postFilter) filtered = filtered.filter(c => String(c.postId) === String(postFilter));
		if (!filtered.length) listWrap.append(el('div', { cls: 'no-data' }, 'Ничего не найдено'));
		else listWrap.append(List(filtered.map(commentCard)));
	}

	let t;
	search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(refresh, 300); });

	await refresh();
	return container;
}
