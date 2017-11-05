/**
 * Class for objects that can emit events that can be listened to from outside.
 */
export class Emitter {
  private delegate: DocumentFragment;

  public constructor() {
    this.delegate = document.createDocumentFragment();
  }

  public addEventListener(type: string, callback: EventListenerOrEventListenerObject): void {
    this.delegate.addEventListener(type, callback);
  }

  public removeEventListener(type: string, callback: EventListenerOrEventListenerObject): void {
    this.delegate.removeEventListener(type, callback);
  }

  public dispatchEvent(event: Event): boolean {
    return this.delegate.dispatchEvent(event);
  }
}
