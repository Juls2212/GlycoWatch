"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchChartData, fetchDashboardMetrics } from "@/features/dashboard/api";
import { ChartPoint, DashboardMetrics } from "@/features/dashboard/types";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { GlucoseChart } from "@/components/charts/glucose-chart";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [metricsData, chartPoints] = await Promise.all([
          fetchDashboardMetrics(),
          fetchChartData()
        ]);
        if (!mounted) return;
        setMetrics(metricsData);
        setChartData(chartPoints);
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudieron cargar los datos.";
        if (!mounted) return;
        setError(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const formattedLatest = useMemo(() => {
    if (!metrics?.latestMeasurement) return "Sin datos recientes";
    const date = new Date(metrics.latestMeasurement.measuredAt);
    return date.toLocaleString("es-CO");
  }, [metrics?.latestMeasurement]);

  return (
    <div className="dashboard-grid">
      <Section title="Resumen clínico" subtitle="Indicadores recientes para seguimiento inmediato">
        {error ? <p className="error-text">{error}</p> : null}
        <div className="stat-grid">
          <Card>
            <p className="metric-label">Última medición</p>
            <p className="metric-value">
              {metrics?.latestMeasurement ? `${metrics.latestMeasurement.glucoseValue} ${metrics.latestMeasurement.unit}` : "--"}
            </p>
            <p className="metric-meta">{formattedLatest}</p>
          </Card>

          <Card>
            <p className="metric-label">Promedio reciente</p>
            <p className="metric-value">{metrics?.averageGlucose ?? 0} mg/dL</p>
            <p className="metric-meta">Ventana reciente</p>
          </Card>

          <Card>
            <p className="metric-label">Rango reciente</p>
            <p className="metric-value">
              {metrics?.minGlucose ?? 0} - {metrics?.maxGlucose ?? 0}
            </p>
            <p className="metric-meta">Mínimo / Máximo</p>
          </Card>

          <Card>
            <p className="metric-label">Alertas acumuladas</p>
            <p className="metric-value">{metrics?.alertsCount ?? 0}</p>
            <p className="metric-meta">Eventos registrados</p>
          </Card>
        </div>
      </Section>

      <Section
        title="Tendencia glucémica"
        subtitle="Últimas mediciones válidas para visualización rápida"
        action={isLoading ? <span className="soft-text">Cargando...</span> : undefined}
      >
        <Card>
          <GlucoseChart data={chartData} />
        </Card>
      </Section>
    </div>
  );
}
