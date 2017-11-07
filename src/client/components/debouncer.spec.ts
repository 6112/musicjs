import { Debouncer } from './debouncer';

QUnit.module('Debouncer');

QUnit.test('should debounce the execution of the callback appropriately', (assert) => {
  const done = assert.async();
  const delay = 3000;
  const bufferTime = 1000;
  const debouncer = new Debouncer(delay);
  const startTime = new Date().getTime();
  const numberOfCalls = 3;
  for (let i = 0; i < numberOfCalls; ++i) {
    debouncer.debounce(() => {
      const endTime = new Date().getTime();
      assert.ok(endTime - startTime >= delay);
      assert.ok(endTime - startTime <= delay + bufferTime);
      done();
    });
  }
});
