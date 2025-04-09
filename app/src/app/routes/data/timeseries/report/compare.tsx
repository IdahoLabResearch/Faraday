"use client";

// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { reportActions } from "@/lib/store/features/report";

// Components
import { Download } from "./download";

// Tools
import * as htmlToImage from "html-to-image";
import { uxActions } from "@/lib/store/features/ux";

export default function Compare() {
  // Store
  const storeDispatch = useAppDispatch();
  const comparedCells: Array<any> = useAppSelector(
    (state) => state.report.cells
  );
  const cell: { cell: string } = useAppSelector(
    (state) => state.warehouse.cell!
  );
  const snackbar: boolean = useAppSelector((state) => state.ux.snackbar);

  const handleFab = () => {
    storeDispatch(uxActions.snackbar(!snackbar));
  };

  const addCell = () => {
    storeDispatch(reportActions.addCell(cell.cell));

    const chart = document.getElementById("impedance-chart")! as HTMLElement;

    chart.style.stroke = "black";

    htmlToImage.toPng(chart).then((base64: string) => {
      storeDispatch(reportActions.addChart({ cell: cell.cell, data: base64 }));
    });

    chart.style.stroke = "";
  };
  const removeCell = () => {
    storeDispatch(reportActions.removeCell(cell.cell));
    storeDispatch(reportActions.removeChart(cell.cell));
  };

  return (
    <>
      <div className="card bg-base-200 w-1/2 absolute bottom-0 left-0">
        <div className="card-body">
          <h2 className="card-title">
            <small>{cell.cell}</small>
          </h2>
          <div>
            <div className="grid grid-cols-12 justify-start">
              <div className="col-span-5">
                <div className="prose">
                  {comparedCells.includes(cell.cell) ? (
                    <p>Remove {cell.cell} from comparison</p>
                  ) : (
                    <p>Add {cell.cell} to comparison</p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="prose">
                  {comparedCells.length ? (
                    <p>Faraday is comparing these cells:</p>
                  ) : null}
                </div>
              </div>
              <div className="col-span-2">
                <div className="prose">
                  {comparedCells.length ? <p>Generate a report</p> : null}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-5">
                <div className="prose">
                  {!comparedCells.includes(cell.cell) ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={addCell}
                    >
                      Add {cell.cell}
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-error"
                      onClick={removeCell}
                    >
                      Remove {cell.cell}
                    </button>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="prose">
                  {comparedCells.map((cell, index) => {
                    return (
                      // Iterate through the array of selected cells strings, stripping out their quotation marks and give them a comma delimiter
                      <p key={cell.cell}>
                        {index > 0 ? ", " : null}
                        {JSON.stringify(cell).replace(/['"]+/g, "")}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-2 justify-start">
                {comparedCells.length ? <Download /> : null}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={handleFab} className="btn bg-base-100 btn-sm w-48">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
