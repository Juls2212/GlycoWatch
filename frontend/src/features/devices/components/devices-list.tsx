import { Card } from "@/components/ui/card";
import { DeviceRowActions } from "@/features/devices/components/device-row-actions";
import { DeviceItem } from "@/features/devices/types";

type Props = {
  devices: DeviceItem[];
  isLoading: boolean;
  error: string | null;
  togglingId: number | null;
  onToggle: (deviceId: number) => Promise<void>;
};

function resolveStatusLabel(status: DeviceItem["status"]): string {
  if (status === "ACTIVE") return "Activo";
  if (status === "DISABLED") return "Deshabilitado";
  return "Registrado";
}

function resolveStatusClass(status: DeviceItem["status"]): string {
  if (status === "ACTIVE") return "status-active";
  if (status === "DISABLED") return "status-disabled";
  return "status-registered";
}

export function DevicesList({ devices, isLoading, error, togglingId, onToggle }: Props) {
  return (
    <Card>
      {isLoading ? <p className="soft-text">Cargando dispositivos...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!isLoading && !error && devices.length === 0 ? (
        <p className="soft-text">No hay dispositivos vinculados.</p>
      ) : null}

      {!isLoading && !error && devices.length > 0 ? (
        <div className="table-wrap">
          <table className="measurements-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Identificador</th>
                <th>Estado</th>
                <th>Activo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.name}</td>
                  <td>{device.identifier}</td>
                  <td>
                    <span className={`status-pill ${resolveStatusClass(device.status)}`}>{resolveStatusLabel(device.status)}</span>
                  </td>
                  <td>{device.active ? "Sí" : "No"}</td>
                  <td>
                    <DeviceRowActions
                      deviceId={device.id}
                      active={device.active}
                      isLoading={togglingId === device.id}
                      onToggle={onToggle}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}

