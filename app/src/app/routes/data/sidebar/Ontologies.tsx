// Hooks
import { useEffect } from "react";

// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Types
import { OntologyT, UserT } from "@/lib/types/warehouse";

// Functions
import { FetchOntologies } from "@/lib/client/warehouse";

const Ontologies = () => {
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  // Store
  const ontologies = useAppSelector((state) => state.warehouse.ontologies);
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data: Array<OntologyT> = await FetchOntologies();
        storeDispatch(warehouseActions.ontologies(data));
      }
    };
    fetch();
  }, [storeDispatch, user]);

  const handleOntology = (ontology: OntologyT) => {
    storeDispatch(warehouseActions.ontology(ontology));
  };

  return (
    <>
      <div className="p-4">
        <div className="prose flex flex-col justify-center align-center">
          <h3>Data Providers</h3>
          <p>Select a dataset being exploring</p>
        </div>
        <div className="divider"></div>
        {ontologies ? (
          ontologies.map((ontology: OntologyT) => {
            return (
              <>
                <div key={ontology.id}>
                  <button
                    style={{ display: "block", width: "100%" }}
                    className="btn"
                    onClick={() => handleOntology(ontology)}
                  >
                    {ontology.name}
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

export default Ontologies;
