// Store
import { useAppSelector } from "@/lib/store/hooks";

// Components
import Visualizer from "./wireframe";
import { PWM } from "./timeseries/charts/pwm/pwm";
import { Impedance } from "./timeseries/charts/impedance/impedance";
import { Potentiostatic } from "./timeseries/charts/potentiostatic/potentiostatic";
import { Galvanostatic } from "./timeseries/charts/galvanostatic/galvanostatic";

// Types
import {
  ImpedanceDataT,
  PotentiostaticDataT,
  PWMDataT,
  GalvanostaticDataT,
  ElectrolysisCellQueryResultT,
  ElectrolysisStackQueryResultT,
} from "@/lib/types/timeseries";

export default function Faraday() {
  const query:
    | ElectrolysisCellQueryResultT
    | ElectrolysisStackQueryResultT
    | undefined = useAppSelector((state) => state.warehouse.data);

  return (
    <Visualizer>
      <div className="bg-base-100">
        {query ? (
          query.type === "Impedance" ? (
            <Impedance
              timeseries={query.timeseries.data as Array<ImpedanceDataT>}
            />
          ) : query.type === "Potentiostatic" ? (
            <Potentiostatic
              timeseries={query.timeseries.data as Array<PotentiostaticDataT>}
            />
          ) : query.type === "Pulse Width Modulation" ? (
            <PWM timeseries={query.timeseries.data as Array<PWMDataT>} />
          ) : query.type === "Galvanostatic" ? (
            <Galvanostatic
              timeseries={query.timeseries.data as Array<GalvanostaticDataT>}
            />
          ) : null
        ) : null}
      </div>
    </Visualizer>
  );
}
