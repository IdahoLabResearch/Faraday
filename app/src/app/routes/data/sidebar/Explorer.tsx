// Hooks
import { useEffect } from "react";

// Functions
// import { FetchTimeseries } from "@/lib/client/warehouse";

// Components
import Buttons from "./Buttons";
import Ontologies from "./Ontologies";
import Roots from "./Roots";
import Graph from "./Graph";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";

// Types
import { UserT, OntologyT, NodeT } from "@/lib/types/warehouse";

export const Explorer = () => {
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  const ontology: OntologyT | undefined = useAppSelector(
    (state) => state.warehouse.ontology
  );
  const root: NodeT | undefined = useAppSelector(
    (state) => state.warehouse.root
  );

  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      // Query timeseries data for a given test type based on the cell
    };

    if (user) {
      fetch();
    }
  }, [storeDispatch, user]);

  return (
    <>
      <div className="bg-base-100 w-96 px-2 py-6 h-screen flex flex-col">
        <Buttons />
        <div className="prose flex justify-center">
          <h2>Explore Faraday</h2>
        </div>
        <br />
        {/* Render these components based on where the user is in the Faraday graph */}
        {/* Categories -> Types -> Batches -> Cells */}
        {!ontology ? <Ontologies /> : null}
        {ontology && !root ? <Roots /> : null}
        {ontology && root ? <Graph /> : null}
      </div>
    </>
  );
};

export default Explorer;
