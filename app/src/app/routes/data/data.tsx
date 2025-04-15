// Store
import { useAppSelector } from "@/lib/store/hooks";

// Components
import Visualizer from "./wireframe";
import { PWM } from "./timeseries/charts/pwm/pwm";
import { Impedance } from "./timeseries/charts/impedance/impedance";
import { Potentiostatic } from "./timeseries/charts/potentiostatic/potentiostatic";

export default function Faraday() {
  return (
    <Visualizer>
      <div className="bg-base-100">
        {/* <PWM />
      <Impedance data={data} />
      <Potentiostatic data={data} /> */}
      </div>
    </Visualizer>
  );
}
