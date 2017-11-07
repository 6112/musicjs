import { MockFetcher } from './fetch';

QUnit.module('MockFetcher');

QUnit.test('basic example', async (assert) => {
  const mock = new MockFetcher();
  const r = new Response('404 - Not Found', { status: 404 });
  mock.pushResponse(r);
  assert.deepEqual(await mock.fetch('/'), r);
});

QUnit.test('two fetches in a row', async (assert) => {
  const mock = new MockFetcher();
  const r1 = new Response('404 - Not Found', { status: 404 });
  const r2 = new Response('200 - OK', { status: 200 });
  mock.pushResponse(r1);
  mock.pushResponse(r2);
  assert.deepEqual(await mock.fetch('/'), r1);
  assert.deepEqual(await mock.fetch('/foo.html'), r2);
});

QUnit.test('should return 500 when there are no responses', async (assert) => {
  const mock = new MockFetcher();
  const result = await mock.fetch('/');
  const internalErrorCode = 500;
  assert.deepEqual(result.status, internalErrorCode);
});
