// Store
import { useAppSelector } from "@/lib/store/hooks";

// Components
import Visualizer from "./wireframe";
import { PWM } from "./timeseries/charts/pwm/pwm";
import { Impedance } from "./timeseries/charts/impedance/impedance";
import { Potentiostatic } from "./timeseries/charts/potentiostatic/potentiostatic";

// Types
import { QueryResultT } from "@/lib/types/timeseries";

export default function Faraday() {
  const data: QueryResultT | undefined = useAppSelector(
    (state) => state.warehouse.data
  );

  return (
    <Visualizer>
      <div className="bg-base-100">
        {data ? (
          data.type === "Impedance" ? (
            <Impedance timeseries={data.timeseries} />
          ) : null
        ) : null}
      </div>
    </Visualizer>
  );
}
