import { el } from './components.js';

const CRUMBS = {
	users: [{ text: 'Users', hash: '#users' }],
	'users#todos': [{ text: 'Users', hash: '#users' }, { text: 'Todos', hash: '#users#todos' }],
	'users#posts': [{ text: 'Users', hash: '#users' }, { text: 'Posts', hash: '#users#posts' }],
	'users#posts#comments': [{ text: 'Users', hash: '#users' }, { text: 'Posts', hash: '#users#posts' }, { text: 'Comments', hash: '#users#posts#comments' }]
};

export function Breadcrumbs(parts, router) {
	const key = parts.join('#') || 'users';
	const chain = CRUMBS[key] || CRUMBS['users'];
	const wrap = el('div', { cls: 'breadcrumbs' },
		chain.map((c, idx) => {
			const a = el('a', { href: c.hash, cls: 'small', on: { click: e => { e.preventDefault(); router.navigate(c.hash); } } }, c.text);
			return idx < chain.length - 1 ? el('span', {}, a, ' / ') : el('span', {}, a);
		})
	);
	return wrap;
}