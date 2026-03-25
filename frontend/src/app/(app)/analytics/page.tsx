"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { GlucoseChart } from "@/components/charts/glucose-chart";
import { fetchChartData, fetchDashboardMetrics, fetchRiskAnalysis } from "@/features/dashboard/api";
import { ChartPoint, DashboardMetrics, RiskAnalysis } from "@/features/dashboard/types";
import { ChartRangeFilter } from "@/features/dashboard/components/chart-range-filter";
import { ChartRange, filterChartByRange } from "@/features/dashboard/chart-range";
import {
  buildSpanishRiskMessage,
  translateRiskLevel,
  translateStatus,
  translateTrend
} from "@/features/dashboard/risk-text";

function formatMetric(value: number): string {
  return value.toLocaleString("es-CO", { maximumFractionDigits: 1 });
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [risk, setRisk] = useState<RiskAnalysis | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartRange, setChartRange] = useState<ChartRange>("MONTH");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mounted = { current: true };
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [metricsData, riskData, chartPoints] = await Promise.all([
          fetchDashboardMetrics(),
          fetchRiskAnalysis(),
          fetchChartData()
        ]);
        if (!mounted.current) return;
        setMetrics(metricsData);
        setRisk(riskData);
        setChartData(chartPoints);
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudo cargar el análisis.";
        if (!mounted.current) return;
        setError(message);
      } finally {
        if (mounted.current) setIsLoading(false);
      }
    }

    void load();
    return () => {
      mounted.current = false;
    };
  }, []);

  const filteredChartData = useMemo(() => filterChartByRange(chartData, chartRange), [chartData, chartRange]);
  const riskMessage = useMemo(() => (risk ? buildSpanishRiskMessage(risk) : "Sin análisis disponible por el momento."), [risk]);

  return (
    <div className="dashboard-grid">
      <Section
        title="Análisis de glucosa"
        subtitle="Panel dedicado para revisión de tendencias y comportamiento reciente"
        action={<ChartRangeFilter value={chartRange} onChange={setChartRange} />}
      >
        <Card>
          {isLoading ? <p className="soft-text">Cargando análisis...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
          {!isLoading && !error && filteredChartData.length > 0 ? <GlucoseChart data={filteredChartData} /> : null}
          {!isLoading && !error && filteredChartData.length === 0 ? (
            <p className="soft-text">No hay datos en el rango seleccionado.</p>
          ) : null}
        </Card>
      </Section>

      <Section title="Interpretación de riesgo" subtitle="Lectura clínica simplificada basada en tus datos">
        <div className="analytics-grid">
          <Card>
            <p className="metric-label">Estado actual</p>
            <p className="metric-value">{risk ? translateStatus(risk.currentStatus) : "EN RANGO"}</p>
            <p className="soft-text">{riskMessage}</p>
          </Card>
          <Card>
            <p className="metric-label">Nivel de riesgo</p>
            <p className="metric-value">{risk ? translateRiskLevel(risk.riskLevel) : "BAJO"}</p>
            <p className="soft-text">Tendencia: {risk ? translateTrend(risk.trend) : "ESTABLE"}</p>
          </Card>
        </div>
      </Section>

      <Section title="Resumen explicativo" subtitle="Indicadores clave para contextualizar la evolución">
        <div className="analytics-grid">
          <Card>
            <p className="metric-label">Promedio reciente</p>
            <p className="metric-value">{formatMetric(metrics?.averageGlucose ?? 0)} mg/dL</p>
            <p className="soft-text">Promedio calculado con mediciones válidas recientes.</p>
          </Card>
          <Card>
            <p className="metric-label">Rango reciente</p>
            <p className="metric-value">
              {formatMetric(metrics?.minGlucose ?? 0)} / {formatMetric(metrics?.maxGlucose ?? 0)}
            </p>
            <p className="soft-text">Mínimo y máximo observados en la ventana de análisis.</p>
          </Card>
        </div>
      </Section>
    </div>
  );
}

