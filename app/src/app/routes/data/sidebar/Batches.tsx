// Hooks
import { useEffect } from "react";

// Functions
import { FetchBatches } from "@/lib/client/warehouse";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Types
import { TypeT, BatchT, UserT } from "@/lib/types/warehouse";

const Batches = () => {
  // Hooks
  const type: TypeT = useAppSelector((state) => state.warehouse.type!);
  const batches: Array<BatchT> | undefined = useAppSelector(
    (state) => state.warehouse.batches
  );

  const storeDispatch = useAppDispatch();
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data = await FetchBatches();
        storeDispatch(warehouseActions.batches(data));
      }
    };
    fetch();
  }, [storeDispatch, type, user]);

  const handleBatch = (batch: BatchT) => {
    storeDispatch(warehouseActions.cells(undefined));
    storeDispatch(warehouseActions.batch(batch));
  };

  return (
    <>
      <div className="p-4">
        <div className="prose flex flex-col justify-center align-center">
          <h3>Cell Batches</h3>
          <p>Cell batches in DeepLynx</p>
        </div>
        <div className="divider"></div>
        {batches ? (
          batches.map((batch: BatchT) => {
            return (
              <>
                <button
                  key={batch.id}
                  style={{ display: "block", width: "100%" }}
                  className="btn"
                  onClick={() => handleBatch(batch)}
                >
                  {batch.name}
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

export default Batches;
