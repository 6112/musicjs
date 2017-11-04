export interface Component {
  id: string;
  title: string;

  show(): void;
  hide(): void;
}

export class BaseComponent {
  constructor(public id: string, public title: string) { }

  public show() {
    document.getElementById(this.id).removeAttribute('hidden');
  }

  public hide() {
    document.getElementById(this.id).setAttribute('hidden', '');
  }
}
