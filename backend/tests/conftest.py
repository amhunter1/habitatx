import importlib
import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


BACKEND_ROOT = Path(__file__).resolve().parents[1]


def _clear_app_modules() -> None:
    stale_modules = [name for name in sys.modules if name == "app" or name.startswith("app.")]
    for name in stale_modules:
        sys.modules.pop(name, None)


@pytest.fixture
def client(tmp_path: Path):
    if str(BACKEND_ROOT) not in sys.path:
        sys.path.insert(0, str(BACKEND_ROOT))

    db_path = tmp_path / "test.db"
    os.environ["HABITATX_DATABASE_URL"] = f"sqlite:///{db_path.as_posix()}"
    _clear_app_modules()

    main_module = importlib.import_module("app.main")
    app = main_module.app

    with TestClient(app) as test_client:
        yield test_client

    os.environ.pop("HABITATX_DATABASE_URL", None)
    _clear_app_modules()
