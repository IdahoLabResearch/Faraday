// Hooks
import { useEffect, useState } from "react";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Functions
import { NoorSigmoidRegression } from "@/lib/client/faraday";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

// Types
import { PotentiostaticDataT } from "@/lib/types/timeseries";
import {
  SigmoidalRateExpressionI,
  SigmoidRegressionI,
} from "@/lib/types/statistics";
import { NodeT } from "@/lib/types/warehouse";

// Styles
import { charts } from "../../styles";

// Data
// import { sigmoid_data } from "./sigmoid";

type PropsT = {
  timeseries: Array<PotentiostaticDataT>;
};

function zip(
  x: Array<number>,
  y: Array<number>
): Array<{ time: number; value: number }> {
  if (x.length !== y.length) {
    throw new Error("Input arrays must be of the same length");
  }

  return x.map((time, index) => ({ time, value: y[index] }));
}

function zipMechanisms(
  arrays: Array<Array<{ time: number; value: number }>>
): Array<{ time: number; value: number }> {
  // Get the time values from the first inner array
  const timeValues = arrays[0].map((_, i) => arrays[0][i].time);

  // Initialize the result array
  const result: Array<{ time: number; value: number }> = [];

  // Iterate over the length of the first inner array
  for (let i = 0; i < arrays[0].length; i++) {
    // Initialize the sum of values for the current index
    let sum = 0;

    // Iterate over the inner arrays
    for (const array of arrays) {
      // If the current index is within the bounds of the inner array, add its value to the sum
      if (i < array.length) {
        sum += array[i].value;
      }
    }

    // Add the sum and the time at the current index to the result array
    result.push({ time: timeValues[i], value: sum });
  }

  return result;
}

export const SigmoidalRateExpressionModule = (props: PropsT) => {
  const timeseries = props.timeseries;
  const [ticks, setTicks] = useState<Array<number>>();

  // Sigmoid Data
  const [sigmoid, setSigmoid] = useState<
    SigmoidalRateExpressionI | undefined
  >();
  // Sigmoid Metadata
  const [regression, setRegression] = useState<
    | Array<{
        time: number;
        value: number;
      }>
    | undefined
  >();
  const [mechanisms, setMechanisms] = useState<
    Array<Array<{ time: number; value: number }>> | undefined
  >();
  const [total, setTotal] = useState<Array<{ time: number; value: number }>>();

  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);

  useEffect(() => {
    if (sigmoid) {
      const data: SigmoidRegressionI | undefined =
        sigmoid.data.results_data.find((n) => {
          return n.n_mechanisms == sigmoid.descriptors.best_mechanisms;
        });

      if (data) {
        // Processing
        const ticks = Array.from(
          new Set(
            timeseries.map((record: PotentiostaticDataT) => {
              const time = Math.round(record.data.time);
              return time % 25 === 0 ? time : 0;
            })
          )
        );

        // Downsample Regression
        const regression: Array<{ time: number; value: number }> = zip(
          data.downsampled_data.t_data_fit,
          data.downsampled_data.life_metric_data_fit
        );

        // Mechanisms
        const time = timeseries.map((record: PotentiostaticDataT) => {
          return record.data.time;
        });

        const m: Array<Array<{ time: number; value: number }>> =
          data.mechanisms.map((mechanism: Array<number>) => {
            const z = zip(time, mechanism);
            return z;
          });

        const total = zipMechanisms(m);
        setTotal(total);

        setTicks(ticks);
        setRegression(regression);
        setMechanisms(m);
      }
    }
  }, [sigmoid, timeseries]);

  const handleSigmoid = async () => {
    const response: SigmoidalRateExpressionI = await NoorSigmoidRegression(
      leaf.name,
      timeseries
    );
    setSigmoid(response);
  };

  return (
    <>
      <button className="btn w-48" onClick={() => handleSigmoid()}>
        Calculate
      </button>
      <br />
      <br />
      {regression ? (
        <>
          <div className="prose">
            <h4>Sigmoidal Rate Expression</h4>
          </div>
          <br />
          <LineChart
            width={730}
            height={250}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={charts.grid} />

            <XAxis
              dataKey="time"
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: ".75rem" }}
              ticks={ticks}
              stroke={charts.axis}
              type="number"
            >
              <Label
                value={"Time"}
                stroke={charts.label}
                position={"centerBottom"}
                dy={25}
              />
            </XAxis>
            <YAxis
              unit={"mA"}
              domain={["auto", "auto"]}
              tick={{ fontSize: ".75rem" }}
              tickFormatter={(value) => {
                return value.toFixed(2).toString();
              }}
              stroke={charts.axis}
              type={"number"}
            >
              <Label
                value={"Life Metric"}
                stroke={charts.label}
                position={"centerBottom"}
                angle={-90}
                dx={-40}
              />
            </YAxis>
            <Legend verticalAlign="top" align="right" />
            <Line
              data={regression}
              type="monotone"
              name="Life Metric"
              dot={false}
              dataKey="value"
              stroke="palegoldenrod"
            />
            {mechanisms
              ? mechanisms.map(
                  (
                    m: Array<{ time: number; value: number }>,
                    index: number
                  ) => {
                    return (
                      <Line
                        key={index}
                        data={m}
                        type="monotone"
                        name={`Mechanism ${index + 1}`}
                        dot={false}
                        dataKey="value"
                        stroke="white"
                      />
                    );
                  }
                )
              : null}
            {total ? (
              <Line
                data={total}
                type="monotone"
                name="Total"
                dot={false}
                dataKey="value"
                stroke="white"
              />
            ) : null}
          </LineChart>
        </>
      ) : null}
    </>
  );
};
