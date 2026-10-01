# Python test starter

Optional starting point for projects that already use pytest. Reuse the project's fixtures
and UI test tools (for example pytest-qt); do not add a test dependency without approval.
Translate an entry's observable Acceptance checks into tests before implementation. Never
weaken an existing failing assertion to make a change pass.

```python
import pytest

@pytest.mark.parametrize(
    ("given", "action", "expected"),
    [
        # Replace with one row per acceptance case from the selected entry.
    ],
)
def test_acceptance_case(given, action, expected):
    result = run_scenario(given, action)
    assert result == expected
```

For a paid-call guard, test observable boundaries with a fake provider:

```python
def test_double_confirm_dispatches_once(fake_provider, app):
    app.confirm_paid_operation(operation_id="op-1", estimate=0.12)
    app.confirm_paid_operation(operation_id="op-1", estimate=0.12)

    assert fake_provider.call_count == 1
```

For a desktop UI, test the owner's action and visible result, not private widget internals.
