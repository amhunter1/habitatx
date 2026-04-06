def test_create_get_and_patch_session_flow(client):
    create_response = client.post(
        "/planning-sessions",
        json={
            "selected_region_id": "planum_boreum",
            "crew_size": 48,
            "mission_duration_months": 72,
            "risk_profile": "dengeli",
        },
    )
    assert create_response.status_code == 201
    created = create_response.json()
    session_id = created["session"]["id"]
    assert created["quickstart"]["selected_region_id"] == "planum_boreum"
    assert created["region"]["display_name"] == "Planum Boreum"

    patch_response = client.patch(
        f"/planning-sessions/{session_id}/mission-brief",
        json={
            "mission_purpose": "kalici_habitat",
            "autonomy_level": 74,
            "robot_count": 26,
            "risk_tolerance": 45,
        },
    )
    assert patch_response.status_code == 200
    patched = patch_response.json()
    assert patched["mission_brief"]["mission_purpose"] == "kalici_habitat"
    assert patched["mission_brief"]["autonomy_level"] == 74

    get_response = client.get(f"/planning-sessions/{session_id}")
    assert get_response.status_code == 200
    loaded = get_response.json()
    assert loaded["session"]["status"] == "draft"
    assert loaded["analysis"] is None
