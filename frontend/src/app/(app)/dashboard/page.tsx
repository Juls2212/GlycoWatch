"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createManualMeasurement,
  fetchAlerts,
  fetchChartData,
  fetchDashboardMetrics,
  fetchRiskAnalysis
} from "@/features/dashboard/api";
import { AlertItem, ChartPoint, DashboardMetrics, RiskAnalysis } from "@/features/dashboard/types";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { GlucoseChart } from "@/components/charts/glucose-chart";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [risk, setRisk] = useState<RiskAnalysis | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [glucoseValueInput, setGlucoseValueInput] = useState("");
  const [measuredAtInput, setMeasuredAtInput] = useState("");

  const loadDashboardData = async (mountedRef?: { current: boolean }) => {
    setError(null);
    try {
      const [metricsData, chartPoints, riskData, alertsData] = await Promise.all([
        fetchDashboardMetrics(),
        fetchChartData(),
        fetchRiskAnalysis(),
        fetchAlerts()
      ]);
      if (mountedRef && !mountedRef.current) return;
      setMetrics(metricsData);
      setChartData(chartPoints);
      setRisk(riskData);
      setAlerts(alertsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudieron cargar los datos.";
      if (mountedRef && !mountedRef.current) return;
      setError(message);
    }
  };

  useEffect(() => {
    const mounted = { current: true };
    async function load() {
      setIsLoading(true);
      await loadDashboardData(mounted);
      if (mounted.current) setIsLoading(false);
    }

    void load();
    return () => {
      mounted.current = false;
    };
  }, []);

  const onManualSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const glucoseValue = Number(glucoseValueInput);
    if (!glucoseValue || glucoseValue <= 0) {
      setFormError("Ingresa un valor de glucosa válido.");
      return;
    }
    if (!measuredAtInput) {
      setFormError("Selecciona fecha y hora de medición.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createManualMeasurement({
        glucoseValue,
        unit: "mg/dL",
        measuredAt: new Date(measuredAtInput).toISOString()
      });
      setGlucoseValueInput("");
      setMeasuredAtInput("");
      setFormSuccess("Medición registrada correctamente.");
      await loadDashboardData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo guardar la medición.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <p className="metric-label">Mínimo / Máximo</p>
            <p className="metric-value">{metrics?.minGlucose ?? 0} / {metrics?.maxGlucose ?? 0}</p>
            <p className="metric-meta">Valores recientes</p>
          </Card>

          <Card>
            <p className="metric-label">Total de alertas</p>
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
          {chartData.length > 0 ? (
            <GlucoseChart data={chartData} />
          ) : (
            <p className="soft-text">No hay datos suficientes para mostrar la gráfica.</p>
          )}
        </Card>
      </Section>

      <Section title="Estado de riesgo" subtitle="Evaluación actual basada en tus datos recientes">
        <Card>
          <div className="risk-grid">
            <div>
              <p className="metric-label">Estado</p>
              <p className="metric-value">{risk?.currentStatus ?? "IN_RANGE"}</p>
            </div>
            <div>
              <p className="metric-label">Nivel de riesgo</p>
              <p className="metric-value">{risk?.riskLevel ?? "LOW"}</p>
            </div>
            <div>
              <p className="metric-label">Tendencia</p>
              <p className="metric-value">{risk?.trend ?? "STABLE"}</p>
            </div>
          </div>
          <p className="risk-message">{risk?.message ?? "Sin análisis disponible por el momento."}</p>
        </Card>
      </Section>

      <Section title="Alertas recientes" subtitle="Vista rápida de los últimos eventos detectados">
        <Card>
          {alerts.length === 0 ? (
            <p className="soft-text">No hay alertas registradas.</p>
          ) : (
            <ul className="alerts-list">
              {alerts.slice(0, 6).map((alert) => (
                <li key={alert.id} className="alert-row">
                  <div>
                    <p className="alert-type">{alert.type === "HIGH_GLUCOSE" ? "Glucosa alta" : "Glucosa baja"}</p>
                    <p className="alert-message">{alert.message}</p>
                  </div>
                  <div className={`alert-badge ${alert.isRead ? "read" : "unread"}`}>
                    {alert.isRead ? "Leída" : "Nueva"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Section>

      <Section title="Registro manual" subtitle="Añade una medición sin usar el dispositivo IoT">
        <Card>
          <form className="manual-form" onSubmit={onManualSubmit}>
            <label className="field">
              <span>Valor de glucosa (mg/dL)</span>
              <input
                type="number"
                step="0.1"
                min="1"
                value={glucoseValueInput}
                onChange={(event) => setGlucoseValueInput(event.target.value)}
                placeholder="Ej. 112.5"
              />
            </label>

            <label className="field">
              <span>Fecha y hora de medición</span>
              <input
                type="datetime-local"
                value={measuredAtInput}
                onChange={(event) => setMeasuredAtInput(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Unidad</span>
              <input type="text" value="mg/dL" disabled />
            </label>

            {formError ? <p className="error-text">{formError}</p> : null}
            {formSuccess ? <p className="success-text">{formSuccess}</p> : null}

            <div className="manual-actions">
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar medición"}
              </button>
            </div>
          </form>
        </Card>
      </Section>
    </div>
  );
}
