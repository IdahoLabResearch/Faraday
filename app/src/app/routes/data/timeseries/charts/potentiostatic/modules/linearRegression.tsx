import { Dispatch, SetStateAction } from "react";

// Functions
import { LinearRegression } from "@/lib/api/server";

type PropsT = {
  setRegression: Dispatch<
    SetStateAction<
      | {
          regression: { time: number; regression: number }[];
          coefficients: number[];
        }
      | undefined
    >
  >;
  data: Array<any>;
  regression:
    | {
        regression: Array<{ time: number; regression: number }>;
        coefficients: Array<number>;
      }
    | undefined;
};

export const LinearRegressionModule = (props: PropsT) => {
  const data = props.data;
  const linear = props.regression;
  const setRegression = props.setRegression;

  // Handlers
  const handleRegression = async () => {
    const response = await LinearRegression(data);
    setRegression(response);
  };

  return (
    <>
      <button className="btn w-48" onClick={() => handleRegression()}>
        Calculate
      </button>
      <br />
      <br />
      {linear ? (
        <>
          <div className="grid grid-rows-2">
            <div className="row-span-1 prose">
              <h4>Linear Regression</h4>
            </div>
            <div className="row-span-1">
              <div>
                <div className="grid grid-rows-2 prose">
                  <small className="row-span-1">
                    Slope: {linear.coefficients[0].toExponential(2)}
                  </small>
                  <small className="row-span-1">
                    Intercept: {linear.coefficients[1].toExponential(2)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
