"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import { createManualMeasurement } from "@/features/measurements/api";

type Props = {
  onCreated: () => Promise<void>;
};

export function ManualMeasurementForm({ onCreated }: Props) {
  const [glucoseValue, setGlucoseValue] = useState("");
  const [measuredAt, setMeasuredAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const parsedValue = Number(glucoseValue);
    if (!parsedValue || parsedValue <= 0) {
      setError("Ingresa un valor de glucosa válido.");
      return;
    }
    if (!measuredAt) {
      setError("Selecciona fecha y hora de medición.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createManualMeasurement({
        glucoseValue: parsedValue,
        unit: "mg/dL",
        measuredAt: new Date(measuredAt).toISOString()
      });
      setGlucoseValue("");
      setMeasuredAt("");
      setSuccess("Medición guardada correctamente.");
      await onCreated();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo guardar la medición.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form className="manual-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Valor de glucosa (mg/dL)</span>
          <input
            type="number"
            step="0.1"
            min="1"
            value={glucoseValue}
            onChange={(event) => setGlucoseValue(event.target.value)}
            placeholder="Ej. 110.5"
          />
        </label>

        <label className="field">
          <span>Fecha y hora de medición</span>
          <input type="datetime-local" value={measuredAt} onChange={(event) => setMeasuredAt(event.target.value)} />
        </label>

        <label className="field">
          <span>Unidad</span>
          <input type="text" value="mg/dL" disabled />
        </label>

        {error ? <p className="error-text">{error}</p> : null}
        {success ? <p className="success-text">{success}</p> : null}

        <div className="manual-actions">
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Registrar medición"}
          </button>
        </div>
      </form>
    </Card>
  );
}

