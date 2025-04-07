"use client";

// Hooks
import { useEffect } from "react";

// Functions
import { FetchBatches } from "@/lib/api/client";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { serverActions } from "@/lib/store/features/server";

const Batches = () => {
  // Hooks
  const type: { id: string; class: string } = useAppSelector(
    (state) => state.server.type!
  );
  const batches: Array<{ cell_batch: string }> | undefined = useAppSelector(
    (state) => state.server.batches
  );

  const storeDispatch = useAppDispatch();
  const token: string | undefined = useAppSelector(
    (state) => state.user.auth.token
  );

  useEffect(() => {
    const fetch = async () => {
      if (token)
        await FetchBatches(type.id, type.class, token).then(
          (data: { cell_batch: string }) => {
            storeDispatch(serverActions.batches(data));
          }
        );
    };
    fetch();
  }, [storeDispatch, type, token]);

  const handleBatch = (batch: { cell_batch: string }) => {
    storeDispatch(serverActions.cells(undefined));
    storeDispatch(serverActions.batch(batch));
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
          batches.map((batch: { cell_batch: string }) => {
            return (
              <>
                <button
                  key={batch.cell_batch}
                  style={{ display: "block", width: "100%" }}
                  className="btn"
                  onClick={() => handleBatch(batch)}
                >
                  {batch.cell_batch}
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
