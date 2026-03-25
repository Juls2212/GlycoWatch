import { Card } from "@/components/ui/card";
import { MeasurementItem } from "@/features/measurements/types";

type Props = {
  measurements: MeasurementItem[];
  isLoading: boolean;
  error: string | null;
};

function resolveOrigin(item: MeasurementItem): string {
  if (item.origin) return item.origin;
  return item.deviceId ? "IOT" : "MANUAL";
}

export function MeasurementsTable({ measurements, isLoading, error }: Props) {
  return (
    <Card>
      {isLoading ? <p className="soft-text">Cargando mediciones...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!isLoading && !error && measurements.length === 0 ? (
        <p className="soft-text">No hay mediciones para mostrar.</p>
      ) : null}

      {!isLoading && !error && measurements.length > 0 ? (
        <div className="table-wrap">
          <table className="measurements-table">
            <thead>
              <tr>
                <th>Glucosa</th>
                <th>Unidad</th>
                <th>Fecha</th>
                <th>Origen</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((item) => (
                <tr key={item.id}>
                  <td>{item.glucoseValue}</td>
                  <td>{item.unit}</td>
                  <td>{new Date(item.measuredAt).toLocaleString("es-CO")}</td>
                  <td>{resolveOrigin(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}

