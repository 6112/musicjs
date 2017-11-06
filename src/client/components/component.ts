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
   * Hides the component.
   */
  hide(): void;

  /**
   * Displays the component.
   */
  show(): void;
}

/**
 * Base of the UI component.
 */
export class BaseComponent implements Component {
  /**
   * Constructor.
   * @param id ID of the component. Must be unique.
   * @param title Title of the component.
   */
  public constructor(public id: string, public title: string) { }

  /**
   * Displays the UI component.
   */
  public show(): void {
    document.getElementById(this.id).removeAttribute('hidden');
  }

  /**
   * Hides the UI component.
   */
  public hide(): void {
    document.getElementById(this.id).setAttribute('hidden', '');
  }
}
