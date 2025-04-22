// Store
import { useAppSelector } from "@/lib/store/hooks";

// Components
import Visualizer from "./wireframe";
import { PWM } from "./timeseries/charts/pwm/pwm";
import { Impedance } from "./timeseries/charts/impedance/impedance";
import { Potentiostatic } from "./timeseries/charts/potentiostatic/potentiostatic";

// Types
import { ImpedanceDataT, QueryResultT } from "@/lib/types/timeseries";

export default function Faraday() {
  const query: QueryResultT | undefined = useAppSelector(
    (state) => state.warehouse.data
  );

  return (
    <Visualizer>
      <div className="bg-base-100">
        {query ? (
          query.type === "Impedance" ? (
            <Impedance
              timeseries={query.timeseries.data as Array<ImpedanceDataT>}
            />
          ) : null
        ) : null}
      </div>
    </Visualizer>
  );
}
