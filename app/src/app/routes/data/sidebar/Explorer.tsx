// Hooks
import { useEffect } from "react";

// Functions
import { FetchTimeseries } from "@/lib/client/deeplynx";

// Components
import Buttons from "./Buttons";
import Categories from "./Categories";
import Types from "./Types";
import Batches from "./Batches";
import Cells from "./Cells";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { serverActions } from "@/lib/store/features/server";

export const Explorer = () => {
  const token = useAppSelector((state) => state.user.auth.token);
  const category = useAppSelector((state) => state.server.category);
  const type = useAppSelector((state) => state.server.type);
  const batch = useAppSelector((state) => state.server.batch);
  const cell = useAppSelector((state) => state.server.cell);

  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      // Query timeseries data for a given test type based on the cell
      await FetchTimeseries(
        type!.id,
        cell!.cell,
        batch!.cell_batch,
        type!.class,
        token!
      ).then((data) => {
        storeDispatch(serverActions.data(data));
      });
    };

    if (type && batch && cell && token) {
      fetch();
    }
  }, [storeDispatch, type, batch, cell, token]);

  return (
    <>
      <div className="bg-base-100 min-w-96 px-2 py-6 h-full">
        <Buttons />
        <div className="prose flex justify-center">
          <h2>Explore Faraday</h2>
        </div>
        {/* Render these components based on where the user is in the Faraday graph */}
        {/* Categories -> Types -> Batches -> Cells */}
        {!category ? <Categories /> : null}
        {category && !type ? <Types /> : null}
        {category && type && !batch ? <Batches /> : null}
        {category && type && batch ? <Cells /> : null}
      </div>
    </>
  );
};

export default Explorer;
