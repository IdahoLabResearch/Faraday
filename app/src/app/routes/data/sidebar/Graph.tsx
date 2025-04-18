// Hooks
import { useEffect } from "react";

// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Types
import { GraphT, UserT, NodeT, OntologyT } from "@/lib/types/warehouse";

// Functions
import { FetchGraph } from "@/lib/client/warehouse";
import { FetchCellData } from "@/lib/client/timeseries";

// Components
import { RenderTree } from "./Tree";

const Graph = () => {
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  // Store
  const ontology: OntologyT = useAppSelector(
    (state) => state.warehouse.ontology!
  );
  const root: NodeT = useAppSelector((state) => state.warehouse.root!);
  const graph: Array<GraphT> | undefined = useAppSelector(
    (state) => state.warehouse.graph
  );
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data: Array<GraphT> = await FetchGraph(root.id);
        storeDispatch(warehouseActions.graph(data));
      }
    };
    fetch();
  }, [storeDispatch, user, root]);

  const handleLeaf = async (tree: GraphT, leaf: GraphT) => {
    if (leaf.cls === "Cell") {
      const data = await FetchCellData({
        test: tree.name,
        provider: leaf.ontology,
        cell: leaf.name,
        batch: leaf.parent,
      });
      console.log(data);
    }
  };

  return (
    <>
      <div className="p-4 h-full flex flex-col overflow-y-auto h-full">
        <div className="prose flex flex-col justify-center align-center">
          <h3>Graph</h3>
          <p>
            Here are entities organized under {root.name} tests in the{" "}
            {ontology.name} ontology.
          </p>
        </div>
        <div className="divider"></div>
        <div>
          {graph ? (
            <>
              {graph.map((node: GraphT) => {
                return <RenderTree graph={node} handleLeaf={handleLeaf} />;
              })}
            </>
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
      </div>
    </>
  );
};

export default Graph;
