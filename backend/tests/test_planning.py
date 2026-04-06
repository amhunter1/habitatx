def test_generate_plan_scenarios_and_report(client):
    create_response = client.post(
        "/planning-sessions",
        json={
            "selected_region_id": "deuteronilus_mensae",
            "crew_size": 44,
            "mission_duration_months": 84,
            "risk_profile": "dengeli",
        },
    )
    session_id = create_response.json()["session"]["id"]

    brief_response = client.patch(
        f"/planning-sessions/{session_id}/mission-brief",
        json={
            "mission_purpose": "kalici_habitat",
            "target_population": 120,
            "autonomy_level": 78,
            "robot_count": 30,
            "resupply_dependence": 35,
            "risk_tolerance": 40,
            "growth_target": "phase_3_expansion",
        },
    )
    assert brief_response.status_code == 200

    plan_response = client.post(f"/planning-sessions/{session_id}/generate-plan")
    assert plan_response.status_code == 200
    plan_payload = plan_response.json()
    assert plan_payload["plan"]["headline"]
    assert len(plan_payload["plan"]["modules"]) >= 3
    assert len(plan_payload["plan"]["phases"]) == 3
    assert plan_payload["score_card"]["survival_confidence"] > 0

    scenarios_response = client.post(f"/planning-sessions/{session_id}/generate-scenarios")
    assert scenarios_response.status_code == 200
    scenarios = scenarios_response.json()
    assert len(scenarios) == 3

    report_response = client.post(f"/planning-sessions/{session_id}/generate-report")
    assert report_response.status_code == 200
    report = report_response.json()
    assert report["executive_summary"]
    assert len(report["next_actions"]) >= 3
    assert len(report["report_payload"]["sections"]) >= 15
    assert len(report["report_payload"]["topic_briefs"]) >= 10

    section_titles = [section["title"].lower() for section in report["report_payload"]["sections"]]
    topic_titles = [topic["title"] for topic in report["report_payload"]["topic_briefs"]]

    assert any("isru" in title for title in section_titles)
    assert any("kaynak" in title for title in section_titles)
    assert "Psikolojik saglik ve ic guvenlik" in topic_titles
    assert "Haberlesme gecikmesi ve otonomi" in topic_titles

    session_response = client.get(f"/planning-sessions/{session_id}")
    assert session_response.status_code == 200
    session_payload = session_response.json()
    assert session_payload["session"]["status"] == "report_ready"
    assert session_payload["plan"] is not None
    assert session_payload["score_card"] is not None
    assert len(session_payload["scenarios"]) == 3
    assert session_payload["report"] is not None
