import { Emitter } from './emitter';

QUnit.module('Emitter');

QUnit.test('should dispatch events properly', (assert) => {
  const done = assert.async();
  const emitter = new Emitter();
  emitter.addEventListener('test', () => {
    assert.ok(true);
    done();
  });
  emitter.dispatchEvent(new Event('test'));
});

QUnit.test('should not dispatch events to removed listeners', (assert) => {
  const done = assert.async();
  assert.expect(0);
  const emitter = new Emitter();
  const listener = () => {
    assert.ok(false);
  };
  emitter.addEventListener('test', listener);
  emitter.removeEventListener('test', listener);
  emitter.dispatchEvent(new Event('test'));
  const bufferTime = 3000;
  setTimeout(done, bufferTime);
});
