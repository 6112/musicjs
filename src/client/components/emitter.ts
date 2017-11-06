/**
 * Class for objects that can emit events that can be listened to from outside.
 */
export class Emitter {
  /**
   * Document fragment used to register event listeners.
   */
  private delegate: DocumentFragment;

  public constructor() {
    this.delegate = document.createDocumentFragment();
  }

  /**
   * Adds an event listener.
   * @param type Event to listen to.
   * @param callback Callback called when the event is dispatched.
   */
  public addEventListener(type: string, callback: EventListenerOrEventListenerObject): void {
    this.delegate.addEventListener(type, callback);
  }

  /**
   * Removes an event listener.
   * @param type Event to listen to.
   * @param callback Callback to remove.
   */
  public removeEventListener(type: string, callback: EventListenerOrEventListenerObject): void {
    this.delegate.removeEventListener(type, callback);
  }

  /**
   * Dispatch an event to the listeners.
   * @param event Event to dispatch.
   * @return False if any listener called preventDefault(). True otherwise.
   */
  public dispatchEvent(event: Event): boolean {
    return this.delegate.dispatchEvent(event);
  }
}
