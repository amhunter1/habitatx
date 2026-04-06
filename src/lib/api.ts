const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export type BackendRegion = {
  id: string;
  display_name: string;
  sector: string;
  summary: string;
  slope: number;
  roughness: number;
  crater_density: number;
  radiation_estimate: number;
  dust_risk: number;
  ice_probability: number;
  thermal_range: number;
  solar_efficiency: number;
  landing_safety: number;
  expansion_area: number;
  construction_feasibility: number;
  map_position_x: number;
  map_position_y: number;
};

export type BackendAnalysis = {
  session_id: string;
  region_id: string;
  site_suitability_score: number;
  risk_index: number;
  expansion_score: number;
  logistics_score: number;
  strengths: string[];
  red_flags: string[];
  derived_metrics: Record<string, number>;
  analysis_summary: string;
};

export type BackendPlanModule = {
  id: string;
  module_code: string;
  module_name: string;
  category: string;
  phase_fit: string;
  capacity_note: string;
  energy_load: string;
  reason: string;
};

export type BackendPhase = {
  id: string;
  phase_order: number;
  phase_name: string;
  objective: string;
  deliverables: string[];
};

export type BackendPlan = {
  id: string;
  session_id: string;
  scenario_type: string;
  headline: string;
  top_recommendations: string[];
  key_constraints: string[];
  resource_bottlenecks: string[];
  planner_rationale: string;
  created_at: string;
  phases: BackendPhase[];
  modules: BackendPlanModule[];
};

export type BackendScoreCard = {
  session_id: string;
  site_suitability_score: number;
  mission_fit_score: number;
  resource_access_score: number;
  risk_index: number;
  construction_difficulty: number;
  resilience_score: number;
  autonomy_score: number;
  expansion_score: number;
  sustainability_score: number;
  survival_confidence: number;
};

export type BackendScenario = {
  id: string;
  session_id: string;
  scenario_name: string;
  optimization_target: string;
  mission_fit_score: number;
  risk_index: number;
  autonomy_score: number;
  cost_discipline_score: number;
  summary: string;
};

export type BackendReport = {
  id: string;
  session_id: string;
  executive_summary: string;
  technical_summary: string;
  next_actions: string[];
  report_payload: Record<string, unknown>;
  created_at: string;
};

export type BackendMissionBrief = {
  mission_purpose: string | null;
  target_population: number | null;
  energy_strategy: string | null;
  habitat_type: string | null;
  water_strategy: string | null;
  food_strategy: string | null;
  autonomy_level: number | null;
  robot_count: number | null;
  resupply_dependence: number | null;
  risk_tolerance: number | null;
  growth_target: string | null;
};

export type BackendSessionEnvelope = {
  session: {
    id: string;
    status: string;
    selected_region_id: string;
    crew_size: number;
    mission_duration_months: number;
    risk_profile: string;
    created_at: string;
    updated_at: string;
  };
  quickstart: {
    selected_region_id: string;
    crew_size: number;
    mission_duration_months: number;
    risk_profile: string;
  };
  mission_brief: BackendMissionBrief | null;
  region: BackendRegion | null;
  analysis: BackendAnalysis | null;
  plan: BackendPlan | null;
  score_card: BackendScoreCard | null;
  scenarios: BackendScenario[];
  report: BackendReport | null;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    ...options,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const habitatApi = {
  listRegions() {
    return request<BackendRegion[]>("/regions");
  },
  createPlanningSession(body: {
    selected_region_id: string;
    crew_size: number;
    mission_duration_months: number;
    risk_profile: string;
  }) {
    return request<BackendSessionEnvelope>("/planning-sessions", {
      method: "POST",
      body
    });
  },
  getPlanningSession(sessionId: string) {
    return request<BackendSessionEnvelope>(`/planning-sessions/${sessionId}`);
  },
  patchQuickstart(
    sessionId: string,
    body: Partial<{
      selected_region_id: string;
      crew_size: number;
      mission_duration_months: number;
      risk_profile: string;
    }>
  ) {
    return request<BackendSessionEnvelope>(`/planning-sessions/${sessionId}/quickstart`, {
      method: "PATCH",
      body
    });
  },
  patchMissionBrief(sessionId: string, body: Partial<BackendMissionBrief>) {
    return request<BackendSessionEnvelope>(`/planning-sessions/${sessionId}/mission-brief`, {
      method: "PATCH",
      body
    });
  },
  analyzeRegion(sessionId: string) {
    return request<BackendAnalysis>(`/planning-sessions/${sessionId}/analyze-region`, {
      method: "POST"
    });
  },
  generatePlan(sessionId: string) {
    return request<{ plan: BackendPlan; score_card: BackendScoreCard }>(
      `/planning-sessions/${sessionId}/generate-plan`,
      { method: "POST" }
    );
  },
  generateScenarios(sessionId: string) {
    return request<BackendScenario[]>(`/planning-sessions/${sessionId}/generate-scenarios`, {
      method: "POST"
    });
  },
  generateReport(sessionId: string) {
    return request<BackendReport>(`/planning-sessions/${sessionId}/generate-report`, {
      method: "POST"
    });
  }
};
