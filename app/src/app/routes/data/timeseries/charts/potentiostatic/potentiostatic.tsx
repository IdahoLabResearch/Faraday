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
import { CellT } from "@/lib/types/warehouse";

type Props = {
  data: Array<any>;
};

const analytics = ["Linear Regression", "Sigmoidal Rate Expression"];

export function Potentiostatic(props: Props) {
  const [data, setData] = useState<Array<any>>([]);
  const [module, setModule] = useState<string | undefined>(undefined);
  const [voltage, setVoltage] = useState<string>("1.3");
  const [regression, setRegression] = useState<
    | {
        regression: Array<{ time: number; regression: number }>;
        coefficients: Array<number>;
      }
    | undefined
  >();

  const cell: CellT = useAppSelector((state) => state.warehouse.cell!);

  useEffect(() => {
    if (props.data.length) {
      // Filter potentiostatic data for just the selected cell
      const subset = props.data.filter(
        (record: any) => record.voltage == voltage
      );
      setData(subset);
    }
  }, [props.data, voltage, cell]);

  useEffect(() => {
    setModule(undefined);
    setRegression(undefined);
  }, [cell]);

  return (
    <div className="grid grid-cols-12 px-12 py-6">
      <div className="col-span-6">
        <Visualization
          data={data}
          voltage={voltage}
          setVoltage={setVoltage}
          regression={regression}
        />
      </div>
      <div className="col-span-6">
        <div className="prose">
          <h2>Analytics</h2>
          <p>
            Compute statistical regressions for {cell.name} at {voltage} volts
          </p>
        </div>
        <div className="divider w-3/4"></div>
        <div>
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(event) => {
              setModule(event.target.value);
            }}
          >
            <option disabled selected>
              Select a Python Module
            </option>
            {analytics.map((module) => {
              return <option key={module}>{module}</option>;
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
                  data={data}
                />
              ) : null}
            </div>
            <div>
              {module === "Sigmoidal Rate Expression" ? (
                <SigmoidalRateExpressionModule data={data} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
