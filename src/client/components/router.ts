import { Component } from './component';
import { Emitter } from './emitter';

/**
 * A router that manages the navigation between components. Fires a
 * 'route-change' event when the route changes.
 */
export class Router extends Emitter {
  /**
   * Maps of IDs to their related components.
   */
  private components = new Map<string, Component>();

  /**
   * Currently displayed component.
   */
  private currentComponent: Component;

  /**
   * Constructor. Sets the default component of the router.
   * @param defaultComponent Default component of the router.
   */
  public constructor(private defaultComponent: Component) {
    super();
    this.register(defaultComponent);
    window.addEventListener('popstate', this.onPopState.bind(this));
  }

  /**
   * Register components.
   * @param components Components to register.
   */
  public register(...components: Component[]): void {
    for (const component of components) {
      this.components.set(component.id, component);
      component.router = this;
    }
  }

  /**
   * Navigate to a component: shows it, updates the URL, and fires an event.
   * @param id ID of the component to navigate to.
   * @param payload Optional payload to pass to the newly displayed component.
   */
  public navigateTo(id: string, payload?: {}): void {
    this.showComponent(id, payload);
    this.updateUrl(payload);
    this.dispatchRouteEvent();
  }

  /**
   * Show a component, and hide the previously active component.
   * @param id ID of the component to navigate to.
   * @param paylaod Optional payload to pass to the newly displayed component.
   */
  private showComponent(id: string, payload: {}): void {
    if (this.currentComponent) {
      this.currentComponent.hide();
    }
    this.currentComponent = this.components.get(id) || this.defaultComponent;
    this.currentComponent.show(payload);
  }

  /**
   * Dispatch a route-change event with the ID of the newly displayed component.
   */
  private dispatchRouteEvent(): void {
    const event = new CustomEvent('route-change', {
      detail: this.currentComponent.id
    });
    this.dispatchEvent(event);
  }

  /**
   * Called when the navigates in the history, e.g. by hitting the browser's
   * "back" button.
   * @param event Event object from the browser.
   */
  private onPopState(event: PopStateEvent): void {
    const id = window.location.pathname.substr(1);
    const payload = event.state;
    this.showComponent(id, payload);
    this.dispatchRouteEvent();
  }

  /**
   * Update the URL.
   * @param payload Payload to save along with the URL in the browser's history.
   */
  private updateUrl(payload: {}): void {
    window.history.pushState(payload || null,
                             this.currentComponent.title,
                             '/' + this.currentComponent.id);
  }
}
