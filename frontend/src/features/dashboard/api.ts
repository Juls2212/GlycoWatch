import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiSuccess } from "@/types/api";
import { DashboardMetrics, ChartPoint, RiskAnalysis, AlertItem, ManualMeasurementPayload } from "./types";

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

export async function fetchAlerts(): Promise<AlertItem[]> {
  const response = await apiClient.get<ApiSuccess<AlertItem[]>>(API_ENDPOINTS.alerts.base);
  return response.data.data;
}

export async function createManualMeasurement(payload: ManualMeasurementPayload): Promise<void> {
  await apiClient.post(`${API_ENDPOINTS.measurements.base}/manual`, payload);
}
