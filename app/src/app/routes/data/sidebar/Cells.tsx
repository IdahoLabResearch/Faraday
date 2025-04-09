// Hooks
import { useEffect } from "react";

// Functions
import { FetchCells } from "@/lib/client/warehouse";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Types
import { TypeT, BatchT, CellT, UserT } from "@/lib/types/warehouse";

const Cells = () => {
  // Hooks
  const type: TypeT = useAppSelector((state) => state.warehouse.type!);
  const batch: BatchT = useAppSelector((state) => state.warehouse.batch!);
  const cells: Array<CellT> | undefined = useAppSelector(
    (state) => state.warehouse.cells
  );

  const storeDispatch = useAppDispatch();
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data = await FetchCells(batch.id);
        storeDispatch(warehouseActions.cells(data));
      }
    };
    fetch();
  }, [storeDispatch, type, batch, user]);

  const handleCell = (cell: CellT) => {
    storeDispatch(warehouseActions.cell(cell));
  };

  return (
    <>
      <div className="p-4">
        <div className="prose flex flex-col justify-center align-center">
          <h3>Button Cells</h3>
          <p>Button cells in DeepLynx</p>
        </div>
        <div className="divider"></div>
        {cells ? (
          cells.map((cell: CellT) => {
            return (
              <>
                <button
                  key={cell.id}
                  style={{ display: "block", width: "100%" }}
                  className="btn"
                  onClick={() => handleCell(cell)}
                >
                  {cell.name}
                </button>
                <br />
              </>
            );
          })
        ) : (
          <>
            <div className="skeleton w-full h-[3rem]" />
            <br />
            <div className="skeleton w-full h-[3rem]" />
            <br />
            <div className="skeleton w-full h-[3rem]" />
          </>
        )}
      </div>
    </>
  );
};

export default Cells;
