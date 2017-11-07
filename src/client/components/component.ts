import { Router } from './router';

/**
 * Interface for a UI component.
 */
export interface Component {
  /**
   * ID of the component.
   */
  id: string;

  /**
   * Title of the component.
   */
  title: string;

  /**
   * Reference to the router that registered the component.
   */
  router: Router;

  /**
   * Hides the component.
   */
  hide(): void;

  /**
   * Displays the component.
   * @param payload Payload passed to the component.
   */
  show(payload?: {}): void;
}

/**
 * Base of the UI component.
 */
export class BaseComponent implements Component {
  /**
   * Reference to the router that registered the component.
   */
  public router: Router;

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
    document.getElementById(this.id).removeAttribute('hidden');
  }

  /**
   * Hides the UI component.
   */
  public hide(): void {
    document.getElementById(this.id).setAttribute('hidden', '');
  }
}
