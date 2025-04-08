// Hooks
import { useEffect } from "react";

// Functions
import { FetchCells } from "@/lib/client/deeplynx";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { serverActions } from "@/lib/store/features/server";

const Cells = () => {
  // Hooks
  const type: { id: string; class: string } = useAppSelector(
    (state) => state.server.type!
  );
  const batch: { cell_batch: string } = useAppSelector(
    (state) => state.server.batch!
  );
  const cells: Array<{ cell: string }> | undefined = useAppSelector(
    (state) => state.server.cells
  );

  const storeDispatch = useAppDispatch();
  const token: string | undefined = useAppSelector(
    (state) => state.user.auth.token
  );

  useEffect(() => {
    const fetch = async () => {
      if (token)
        await FetchCells(type.id, type.class, batch.cell_batch, token).then(
          (data: Array<{ cell: string }>) => {
            storeDispatch(serverActions.cells(data));
          }
        );
    };
    fetch();
  }, [storeDispatch, type, batch, token]);

  const handleCell = (cell: { cell: string }) => {
    storeDispatch(serverActions.cell(cell));
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
          cells.map((cell: { cell: string }) => {
            return (
              <>
                <button
                  key={cell.cell}
                  style={{ display: "block", width: "100%" }}
                  className="btn"
                  onClick={() => handleCell(cell)}
                >
                  {cell.cell}
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
