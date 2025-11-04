export class Router {
  constructor(container, routes) {
    this.container = container;
    this.routes = routes;
    window.addEventListener('hashchange', () => this.render());
    window.addEventListener('load', () => this.render());
  }
  parseHash() {
    const raw = location.hash.slice(1) || 'users';
    const [path] = raw.split('?'); 
    const parts = path.split('#').filter(Boolean);
    return parts;
  }

  async render() {
    const parts = this.parseHash();
    const key = parts.join('#');
    const route = this.routes[key]  || this.routes[parts[0]] || this.routes['users'];
    this.container.innerHTML = '';
    const node = await route({ parts, router: this });
    this.container.append(node);
  }
  navigate(hash) { location.hash = hash; }
}