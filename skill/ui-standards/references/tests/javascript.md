# JavaScript and TypeScript test starter

Optional starting point for projects that already use a JavaScript test runner. Reuse the
project's current test framework and UI test tools; do not add a dependency without approval.
Translate entry Acceptance checks into tests before implementation. Never weaken an existing
failing assertion to make a change pass.

```javascript
describe("selected acceptance behaviour", () => {
  test("given the starting state, when the owner acts, then the expected result is visible", async () => {
    // Arrange the user-visible starting state.
    // Perform the same action the owner would.
    // Assert the visible result and any persisted outcome.
  });
});
```

For a paid-call guard, inject a fake provider and assert one observable dispatch for a repeated
confirmation. For an Electron app, test the renderer-to-main boundary without exposing secrets
to the renderer.
