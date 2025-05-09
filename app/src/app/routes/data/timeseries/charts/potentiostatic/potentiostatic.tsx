// Hooks
import { useEffect, useState } from "react";

// Components
import { Visualization } from "./visualization";

// Modules
import { LinearRegressionModule } from "./modules/linearRegression";
import { SigmoidalRateExpressionModule } from "./modules/sigmoidalRateExpression";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Types
import { NodeT } from "@/lib/types/warehouse";
import { PotentiostaticDataT } from "@/lib/types/timeseries";

type Props = {
  timeseries: Array<PotentiostaticDataT>;
};

const analytics = ["Linear Regression", "Sigmoidal Rate Expression"];

export function Potentiostatic(props: Props) {
  const [module, setModule] = useState<string | undefined>(undefined);
  const [voltage, setVoltage] = useState<number>(1.3);
  const [regression, setRegression] = useState<
    | {
        fit: Array<{ time: number; regression: number }>;
        coefficients: Array<number>;
      }
    | undefined
  >();

  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  useEffect(() => {
    setModule("Select a Python Module");
    setRegression(undefined);
  }, [leaf]);

  return (
    <div className="grid grid-cols-12 px-12 py-6">
      <div className="col-span-6">
        <Visualization
          timeseries={props.timeseries}
          voltage={voltage}
          setVoltage={setVoltage}
          regression={regression}
        />
      </div>
      <div className="col-span-6">
        <div className="prose">
          <h2>Analytics</h2>
          <p>
            Compute statistical regressions for {leaf.name} at {voltage} volts
          </p>
        </div>
        <div className="divider w-3/4"></div>
        <div>
          <select
            className="select select-bordered w-full max-w-xs"
            value={module}
            onChange={(event) => {
              setModule(event.target.value);
            }}
          >
            <option disabled selected value={"Select a Python Module"}>
              Select a Python Module
            </option>
            {analytics.map((module) => {
              return (
                <option key={module} value={module}>
                  {module}
                </option>
              );
            })}
          </select>
          <br />
          <br />
          <div>
            <div>
              {module === "Linear Regression" ? (
                <LinearRegressionModule
                  setRegression={setRegression}
                  regression={regression}
                  timeseries={props.timeseries}
                />
              ) : null}
            </div>
            <div>
              {module === "Sigmoidal Rate Expression" ? (
                <SigmoidalRateExpressionModule timeseries={props.timeseries} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
