def test_analyze_region_generates_scores_and_updates_session(client):
    create_response = client.post(
        "/planning-sessions",
        json={
            "selected_region_id": "arcadia_planitia",
            "crew_size": 36,
            "mission_duration_months": 48,
            "risk_profile": "korunakli",
        },
    )
    session_id = create_response.json()["session"]["id"]

    analysis_response = client.post(f"/planning-sessions/{session_id}/analyze-region")
    assert analysis_response.status_code == 200
    analysis = analysis_response.json()
    assert analysis["region_id"] == "arcadia_planitia"
    assert analysis["site_suitability_score"] > 0
    assert len(analysis["red_flags"]) >= 1

    session_response = client.get(f"/planning-sessions/{session_id}")
    assert session_response.status_code == 200
    payload = session_response.json()
    assert payload["session"]["status"] == "analysis_ready"
    assert payload["analysis"]["region_id"] == "arcadia_planitia"
