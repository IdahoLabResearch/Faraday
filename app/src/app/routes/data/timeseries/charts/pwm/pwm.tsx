// Components
import { Visualization } from "./visualization";

// Types
import { PWMDataT } from "@/lib/types/timeseries";
type PropsT = {
  timeseries: Array<PWMDataT> | undefined;
};

export function PWM(props: PropsT) {
  return (
    <div className="grid grid-cols-12 px-12 py-6">
      <div className="col-span-6">
        <Visualization timeseries={props.timeseries} />
      </div>
      <div className="col-span-6"></div>
    </div>
  );
}
