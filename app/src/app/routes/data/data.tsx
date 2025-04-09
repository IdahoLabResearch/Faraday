// Store
import { useAppSelector } from "@/lib/store/hooks";

// Components
import Visualizer from "./wireframe";
import { PWM } from "./timeseries/charts/pwm/pwm";
import { Impedance } from "./timeseries/charts/impedance/impedance";
import { Potentiostatic } from "./timeseries/charts/potentiostatic/potentiostatic";

// Types
import { TypeT, CellT } from "@/lib/types/warehouse";

export default function Faraday() {
  const type: TypeT | undefined = useAppSelector(
    (state) => state.warehouse.type
  );
  const cell: CellT | undefined = useAppSelector(
    (state) => state.warehouse.cell
  );
  const data: Array<any> | undefined = useAppSelector(
    (state) => state.warehouse.data
  );

  return (
    <Visualizer>
      <div className="bg-base-100">
        {cell &&
        type &&
        type.name === "Pulse Width Modulation Accelerated Stress Test" ? (
          <PWM />
        ) : null}
        {data && cell && type ? (
          type.name === "Impedance Test" ? (
            <Impedance data={data} />
          ) : type.name === "Potentiostatic Test" ? (
            <Potentiostatic data={data} />
          ) : null
        ) : null}
      </div>
    </Visualizer>
  );
}
