import { MockFetcher } from "../fetch";

QUnit.module("MockFetcher");
QUnit.test("basic example", async (t) => {
  const mock = new MockFetcher();
  const r = new Response("404 - Not Found", { status: 404 });
  mock.pushResponse(r);
  t.equal(await mock.fetch("/"), r);
});

QUnit.test("two fetches in a row", async (t) => {
  const mock = new MockFetcher();
  const r1 = new Response("404 - Not Found", { status: 404 });
  const r2 = new Response("200 - OK", { status: 200 });
  mock.pushResponse(r1);
  mock.pushResponse(r2);
  t.equal(await mock.fetch("/"), r1);
  t.equal(await mock.fetch("/foo.html"), r2);
});
