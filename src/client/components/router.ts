import { Component } from './component';
import { Emitter } from './emitter';

/**
 * A router that manages the navigation between components.
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
   * Navigates to a component.
   * @param id ID of the component to navigate to.
   * @param payload Optional payload to pass to the newly displayed component.
   */
  public navigateTo(id: string, payload?: {}): void {
    if (this.currentComponent) {
      this.currentComponent.hide();
    }
    this.currentComponent = this.components.get(id) || this.defaultComponent;
    this.currentComponent.show(payload);
    this.updateUrl(payload);
    this.dispatchRouteEvent();
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
   */
  private onPopState(event: PopStateEvent): void {
    console.log(window.location.pathname, event.state);
  }

  /**
   * Update the URL.
   */
  private updateUrl(payload: {}): void {
    window.history.pushState(payload || null,
                             this.currentComponent.title,
                             '/' + this.currentComponent.id);
  }
}
