// Hooks
import { useEffect } from "react";

// Functions
import { FetchTypes } from "@/lib/client/warehouse";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Types
import { CategoryT, TypeT, UserT } from "@/lib/types/warehouse";

const Types = () => {
  // Hooks
  const category: CategoryT = useAppSelector(
    (state) => state.warehouse.category!
  );
  const types: Array<TypeT> | undefined = useAppSelector(
    (state) => state.warehouse.types
  );

  const storeDispatch = useAppDispatch();
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data = await FetchTypes(category.id);
        storeDispatch(warehouseActions.types(data));
      }
    };
    fetch();
  }, [storeDispatch, category, user]);

  const handleType = (type: TypeT) => {
    storeDispatch(warehouseActions.batches(undefined));
    storeDispatch(warehouseActions.type(type));
  };

  return (
    <>
      <div className="p-4">
        <div className="prose flex flex-col justify-center align-center">
          <h3>{category.name}s</h3>
          <p>{category.name}s cataloged in DeepLynx</p>
        </div>
        <div className="divider"></div>
        {types ? (
          types.map((type: TypeT) => {
            return (
              <>
                <div key={type.id}>
                  <button
                    style={{ display: "block", width: "100%" }}
                    className="btn"
                    onClick={() => handleType(type)}
                  >
                    {type.name}
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

export default Types;
