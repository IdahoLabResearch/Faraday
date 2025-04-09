// Hooks
import { useEffect } from "react";

// Functions
import { FetchTimeseries } from "@/lib/client/warehouse";

// Components
import Buttons from "./Buttons";
import Categories from "./Categories";
import Types from "./Types";
import Batches from "./Batches";
import Cells from "./Cells";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";

// Types
import { UserT, CellT, TypeT, CategoryT, BatchT } from "@/lib/types/warehouse";

export const Explorer = () => {
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );
  const category: CategoryT | undefined = useAppSelector(
    (state) => state.warehouse.category
  );
  const type: TypeT | undefined = useAppSelector(
    (state) => state.warehouse.type
  );
  const batch: BatchT | undefined = useAppSelector(
    (state) => state.warehouse.batch
  );
  const cell: CellT | undefined = useAppSelector(
    (state) => state.warehouse.cell
  );

  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      // Query timeseries data for a given test type based on the cell
    };

    if (type && batch && cell && user) {
      fetch();
    }
  }, [storeDispatch, type, batch, cell, user]);

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
