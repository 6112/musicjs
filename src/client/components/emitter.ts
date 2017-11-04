type Callback = (event: any) => any;

/**
 * Class for objects that can emit events that can be listened to from outside.
 */
export class Emitter {
  private delegate: DocumentFragment;

  constructor() {
    this.delegate = document.createDocumentFragment();
  }

  public addEventListener(type: string, callback: Callback) {
    return this.delegate.addEventListener(type, callback);
  }

  public removeEventListener(type: string, callback: Callback) {
    return this.delegate.removeEventListener(type, callback);
  }

  public dispatchEvent(event: any) {
    return this.delegate.dispatchEvent(event);
  }
}
