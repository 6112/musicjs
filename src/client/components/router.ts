import { Component } from './component';
import { Emitter } from './emitter';

export class Router extends Emitter {
  private components = new Map<string, Component>();
  private currentComponent: Component;

  constructor(private defaultComponent: Component) {
    super();
  }

  public register(...components: Component[]) {
    for (const component of components) {
      this.components.set(component.id, component);
    }
  }

  public navigateTo(id: string) {
    if (this.currentComponent) {
      this.currentComponent.hide();
    }
    this.currentComponent = this.components.get(id) || this.defaultComponent;
    this.currentComponent.show();
    this.updateUrl();
    this.dispatchRouteEvent();
  }

  private dispatchRouteEvent() {
    const event = new CustomEvent('route-change', {
      detail: this.currentComponent.id
    });
    this.dispatchEvent(event);
  }

  private updateUrl() {
    window.history.pushState(
      {}, this.currentComponent.title, '/' + this.currentComponent.id);
  }
}
