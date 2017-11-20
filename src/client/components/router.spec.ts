import { Router } from './router';
import { Component } from './component';

/**
 * Mocks a UI component.
 */
class MockComponent implements Component {
  /**
   * Reference to the router that registered the component.
   */
  public router: Router;

  /**
   * Indicates if the component is shown.
   */
  public shown = false;

  /**
   * Constructor.
   * @param id ID of the component. Must be unique.
   * @param title Title of the component.
   */
  public constructor(public id: string, public title: string) { }

  /**
   * Displays the UI component.
   * @param payload Payload passed to the component.
   */
  public show(payload?: {}): void {
    this.shown = true;
  }

  /**
   * Hides the UI component.
   */
  public hide(): void {
    this.shown = false;
  }
}

QUnit.module('Router');

QUnit.test('should navigate components correctly', (assert) => {
  const component1 = new MockComponent('1', '1');
  const component2 = new MockComponent('2', '2');
  const router = new Router(component1);
  router.register(component2);
  router.navigateTo('1');
  assert.ok(component1.shown);
  assert.notOk(component2.shown);
  router.navigateTo('2');
  assert.notOk(component1.shown);
  assert.ok(component2.shown);
  /*assert.throws(() => {
    router.navigateTo('3');
  });*/
});
