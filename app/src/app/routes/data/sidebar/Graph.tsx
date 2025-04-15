// Hooks
import { useEffect } from "react";

// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Types
import { GraphT, UserT } from "@/lib/types/warehouse";

// Functions
import { FetchGraph } from "@/lib/client/warehouse";

// Components
import { RenderTree } from "./Tree";

const Graph = () => {
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  // Store
  const root = useAppSelector((state) => state.warehouse.root!);
  const graph = useAppSelector((state) => state.warehouse.graph);
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data: GraphT = await FetchGraph(root.id);
        storeDispatch(warehouseActions.graph(data));
      }
    };
    fetch();
  }, [storeDispatch, user, root]);

  return (
    <>
      <div className="p-4">
        <div className="prose flex flex-col justify-center align-center">
          <h3>Graph</h3>
          <p>Here are entities related to {root.name} tests</p>
        </div>
        <div className="divider"></div>
        {graph ? (
          <>
            <RenderTree graph={graph} />
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
    </>
  );
};

export default Graph;
