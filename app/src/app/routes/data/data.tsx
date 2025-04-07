// Store
import { useAppSelector } from "@/lib/store/hooks";

// Components
import Visualizer from "./wireframe";
import { PWM } from "./timeseries/charts/pwm/pwm";
import { Impedance } from "./timeseries/charts/impedance/impedance";
import { Potentiostatic } from "./timeseries/charts/potentiostatic/potentiostatic";

export default function Faraday() {
  const type = useAppSelector((state) => state.server.type);
  const cell = useAppSelector((state) => state.server.cell);
  const data: Array<any> | undefined = useAppSelector(
    (state) => state.server.data
  );

  return (
    <Visualizer>
      <div className="bg-base-100">
        {cell &&
        type &&
        type.class === "Pulse Width Modulation Accelerated Stress Test" ? (
          <PWM />
        ) : null}
        {data && cell && type ? (
          type.class === "Impedance Test" ? (
            <Impedance data={data} />
          ) : type.class === "Potentiostatic Test" ? (
            <Potentiostatic data={data} />
          ) : null
        ) : null}
      </div>
    </Visualizer>
  );
}
