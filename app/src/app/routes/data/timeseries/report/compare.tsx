// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { reportActions } from "@/lib/store/features/report";

// Components
import { Download } from "./download";

// Tools
import * as htmlToImage from "html-to-image";
import { uxActions } from "@/lib/store/features/ux";

// Types
import { NodeT } from "@/lib/types/warehouse";

export default function Compare() {
  // Store
  const storeDispatch = useAppDispatch();
  const comparison: Array<NodeT> = useAppSelector(
    (state) => state.report.comparison
  );
  const leaf: NodeT = useAppSelector((state) => state.warehouse.leaf!);
  const snackbar: boolean = useAppSelector((state) => state.ux.snackbar);

  const handleFab = () => {
    storeDispatch(uxActions.snackbar(!snackbar));
  };

  const addNode = () => {
    storeDispatch(reportActions.addComparison(leaf));

    const chart = document.getElementById("impedance-chart")! as HTMLElement;

    chart.style.stroke = "black";

    htmlToImage.toPng(chart).then((base64: string) => {
      storeDispatch(reportActions.addChart({ node: leaf, data: base64 }));
    });

    chart.style.stroke = "";
  };

  const removeNode = () => {
    storeDispatch(reportActions.removeComparison(leaf));
    storeDispatch(reportActions.removeChart(leaf));
  };

  return (
    <>
      <div className="card bg-base-200 w-1/2 absolute bottom-0 left-0 -z-10">
        <div className="card-body">
          <h2 className="card-title">
            <small>{leaf.name}</small>
          </h2>
          <div>
            <div className="grid grid-cols-12 justify-start">
              <div className="col-span-5">
                <div className="prose">
                  {comparison.length > 0 && comparison.includes(leaf) ? (
                    <p>Remove {leaf.name} from comparison</p>
                  ) : (
                    <p>Add {leaf.name} to comparison</p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="prose">
                  {comparison.length ? (
                    <p>Faraday is comparing these cells:</p>
                  ) : null}
                </div>
              </div>
              <div className="col-span-2">
                <div className="prose">
                  {comparison.length ? <p>Generate a report</p> : null}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-5">
                <div className="prose">
                  {!comparison.includes(leaf) ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={addNode}
                    >
                      Add {leaf.name}
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-error"
                      onClick={removeNode}
                    >
                      Remove {leaf.name}
                    </button>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="prose">
                  {comparison.map((node: NodeT, index: number) => {
                    return (
                      // Iterate through the array of selected cells strings, stripping out their quotation marks and give them a comma delimiter
                      <p key={index}>
                        {index > 0 ? ", " : null}
                        {node.name}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-2 justify-start">
                {comparison.length ? <Download /> : null}
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
