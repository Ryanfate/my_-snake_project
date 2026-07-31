def test_register_success(client):
    resp = client.post("/api/auth/register", json={
        "username": "testuser",
        "password": "password123",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["username"] == "testuser"
    assert "id" in data
    assert "password_hash" not in data


def test_register_duplicate_username(client):
    client.post("/api/auth/register", json={
        "username": "testuser",
        "password": "password123",
    })
    resp = client.post("/api/auth/register", json={
        "username": "testuser",
        "password": "anotherpass",
    })
    assert resp.status_code == 409
    assert "already taken" in resp.json()["detail"]


def test_register_short_username(client):
    resp = client.post("/api/auth/register", json={
        "username": "ab",
        "password": "password123",
    })
    assert resp.status_code == 422


def test_register_short_password(client):
    resp = client.post("/api/auth/register", json={
        "username": "validuser",
        "password": "12345",
    })
    assert resp.status_code == 422


def test_login_success(client):
    client.post("/api/auth/register", json={
        "username": "testuser",
        "password": "password123",
    })
    resp = client.post("/api/auth/login", json={
        "username": "testuser",
        "password": "password123",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "username": "testuser",
        "password": "password123",
    })
    resp = client.post("/api/auth/login", json={
        "username": "testuser",
        "password": "wrongpassword",
    })
    assert resp.status_code == 401


def test_login_non_existent_user(client):
    resp = client.post("/api/auth/login", json={
        "username": "nobody",
        "password": "password123",
    })
    assert resp.status_code == 401


def test_me_with_valid_token(client):
    client.post("/api/auth/register", json={
        "username": "testuser",
        "password": "password123",
    })
    login_resp = client.post("/api/auth/login", json={
        "username": "testuser",
        "password": "password123",
    })
    token = login_resp.json()["access_token"]

    resp = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}",
    })
    assert resp.status_code == 200
    assert resp.json()["username"] == "testuser"


def test_me_without_token(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 403
