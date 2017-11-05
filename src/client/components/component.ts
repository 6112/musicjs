export interface Component {
  id: string;
  title: string;

  hide(): void;
  show(): void;
}

export class BaseComponent {
  public constructor(public id: string, public title: string) { }

  public show(): void {
    document.getElementById(this.id).removeAttribute('hidden');
  }

  public hide(): void {
    document.getElementById(this.id).setAttribute('hidden', '');
  }
}
