import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiSuccess } from "@/types/api";
import { DashboardMetrics, ChartPoint, RiskAnalysis } from "./types";

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await apiClient.get<ApiSuccess<DashboardMetrics>>(API_ENDPOINTS.analytics.dashboard);
  return response.data.data;
}

export async function fetchChartData(): Promise<ChartPoint[]> {
  const response = await apiClient.get<ApiSuccess<ChartPoint[]>>(API_ENDPOINTS.analytics.chart);
  return response.data.data;
}

export async function fetchRiskAnalysis(): Promise<RiskAnalysis> {
  const response = await apiClient.get<ApiSuccess<RiskAnalysis>>(API_ENDPOINTS.analytics.risk);
  return response.data.data;
}

