// Components
import { Visualization } from "./visualization";

// Store
import { useAppSelector } from "@/lib/store/hooks";

export function PWM() {
  const data: Array<any> | undefined = useAppSelector(
    (state) => state.warehouse.data
  );

  return (
    <div className="grid grid-cols-12 px-12 py-6">
      <div className="col-span-6">
        <Visualization data={data} />
      </div>
      <div className="col-span-6"></div>
    </div>
  );
}
