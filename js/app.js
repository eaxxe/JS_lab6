import UsersView from './views/users.js';
import TodosView from './views/todos.js';
import PostsView from './views/posts.js';
import CommentsView from './views/comments.js';
import { Router } from './router.js';

const root = document.getElementById('app');

const routes = {
	'users': UsersView,
	'users#todos': TodosView,
	'users#posts': PostsView,
	'users#posts#comments': CommentsView
};

const router = new Router(root, routes);
