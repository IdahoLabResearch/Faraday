// Hooks
import { useEffect } from "react";

// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Types
import { NodeT, UserT, OntologyT } from "@/lib/types/warehouse";

// Functions
import { FetchRoots } from "@/lib/client/warehouse";

const Roots = () => {
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  // Store
  const ontology: OntologyT = useAppSelector(
    (state) => state.warehouse.ontology!
  );
  const roots: Array<NodeT> | undefined = useAppSelector(
    (state) => state.warehouse.roots
  );
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data: Array<NodeT> = await FetchRoots(ontology.id);
        storeDispatch(warehouseActions.roots(data));
      }
    };
    fetch();
  }, [storeDispatch, user, ontology]);

  const handleRoot = (root: NodeT) => {
    storeDispatch(warehouseActions.root(root));
  };

  return (
    <>
      <div className="p-4">
        <div className="prose flex flex-col justify-center align-center">
          <h3>Ontology Roots</h3>
          <p>Select a root to explore the related graph and data.</p>
        </div>
        <div className="divider"></div>
        {roots && roots.length ? (
          roots.map((root: NodeT) => {
            return (
              <>
                <div key={root.id}>
                  <button
                    style={{ display: "block", width: "100%" }}
                    className="btn"
                    onClick={() => handleRoot(root)}
                  >
                    {root.name}
                  </button>
                  <br />
                </div>
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

export default Roots;
