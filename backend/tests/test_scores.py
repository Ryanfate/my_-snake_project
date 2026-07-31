def register_and_login(client, username="testuser", password="password123"):
    """Helper: register and return a valid auth token."""
    client.post("/api/auth/register", json={"username": username, "password": password})
    resp = client.post("/api/auth/login", json={"username": username, "password": password})
    return resp.json()["access_token"]


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def test_create_score_success(client):
    token = register_and_login(client)
    resp = client.post("/api/scores/", json={"score": 100, "difficulty": "medium"}, headers=auth_header(token))
    assert resp.status_code == 201
    data = resp.json()
    assert data["score"] == 100
    assert data["difficulty"] == "medium"
    assert "played_at" in data


def test_create_score_requires_auth(client):
    resp = client.post("/api/scores/", json={"score": 100, "difficulty": "medium"})
    assert resp.status_code == 403


def test_create_score_negative_score(client):
    token = register_and_login(client)
    resp = client.post("/api/scores/", json={"score": -1, "difficulty": "medium"}, headers=auth_header(token))
    assert resp.status_code == 422


def test_create_score_invalid_difficulty(client):
    token = register_and_login(client)
    resp = client.post("/api/scores/", json={"score": 50, "difficulty": "impossible"}, headers=auth_header(token))
    assert resp.status_code == 422


def test_get_my_scores(client):
    token = register_and_login(client)
    # Submit two scores
    client.post("/api/scores/", json={"score": 50, "difficulty": "low"}, headers=auth_header(token))
    client.post("/api/scores/", json={"score": 100, "difficulty": "high"}, headers=auth_header(token))

    resp = client.get("/api/scores/", headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    # Most recent first
    assert data[0]["score"] == 100


def test_get_my_scores_empty(client):
    token = register_and_login(client)
    resp = client.get("/api/scores/", headers=auth_header(token))
    assert resp.status_code == 200
    assert resp.json() == []


def test_leaderboard(client):
    # Create two users with different scores
    token1 = register_and_login(client, "alice")
    client.post("/api/scores/", json={"score": 200, "difficulty": "high"}, headers=auth_header(token1))

    token2 = register_and_login(client, "bob")
    client.post("/api/scores/", json={"score": 300, "difficulty": "medium"}, headers=auth_header(token2))
    client.post("/api/scores/", json={"score": 50, "difficulty": "low"}, headers=auth_header(token2))

    resp = client.get("/api/scores/leaderboard")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 3
    # Bob's 300 should be first
    assert data[0]["score"] == 300
    assert data[0]["username"] == "bob"
    assert data[0]["rank"] == 1
    # Alice's 200 second
    assert data[1]["score"] == 200
    assert data[1]["username"] == "alice"
    # Bob's 50 third
    assert data[2]["score"] == 50


def test_leaderboard_max_10(client):
    token = register_and_login(client)
    for i in range(15):
        client.post("/api/scores/", json={"score": i * 10, "difficulty": "low"}, headers=auth_header(token))

    resp = client.get("/api/scores/leaderboard")
    assert resp.status_code == 200
    assert len(resp.json()) <= 10
