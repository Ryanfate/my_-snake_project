import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app

# Use a test database
TEST_DATABASE_URL = (
    f"mysql+pymysql://{os.environ.get('MYSQL_USER', 'root')}:"
    f"{os.environ.get('MYSQL_PASSWORD', '')}"
    f"@{os.environ.get('MYSQL_HOST', 'localhost')}:"
    f"{os.environ.get('MYSQL_PORT', '3306')}/snake_game_test"
)

# Create test database
import pymysql

conn = pymysql.connect(
    host=os.environ.get("MYSQL_HOST", "localhost"),
    user=os.environ.get("MYSQL_USER", "root"),
    password=os.environ.get("MYSQL_PASSWORD", ""),
)
conn.cursor().execute("CREATE DATABASE IF NOT EXISTS snake_game_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
conn.close()

test_engine = create_engine(TEST_DATABASE_URL)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def setup_db():
    """Create tables before each test and drop them after."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db():
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    from fastapi.testclient import TestClient

    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
