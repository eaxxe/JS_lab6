const BASE = 'https://jsonplaceholder.typicode.com';

async function fetchJSON(url) {
	const r = await fetch(url);
	if (!r.ok) throw new Error('Network error');
	return r.json();
}

export async function getUsers() {
	return fetchJSON(`${BASE}/users`);
}

export async function getTodos() {
	return fetchJSON(`${BASE}/todos`);
}

export async function getPosts() {
	return fetchJSON(`${BASE}/posts`);
}

export async function getComments() {
	return fetchJSON(`${BASE}/comments`);
}
