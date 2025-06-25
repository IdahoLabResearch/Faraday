// Components
import { Visualization } from "./visualization";

import { GalvanostaticDataT } from "@/lib/types/timeseries";

export const Galvanostatic = (props: {
  timeseries: Array<GalvanostaticDataT>;
}) => {
  return (
    <div className="grid grid-cols-12 px-12 py-6">
      <div className="col-span-6">
        <Visualization timeseries={props.timeseries} />
      </div>
      <div className="col-span-6"></div>
    </div>
  );
};
