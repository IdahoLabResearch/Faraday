"use client";

// Hooks
import { useEffect } from "react";

// Functions
import { FetchGraph } from "@/lib/api/client";

// Store
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { serverActions } from "@/lib/store/features/server";

const Types = () => {
  // Hooks
  const category: { id: string; metatype_name: string } = useAppSelector(
    (state) => state.server.category!
  );
  const types: Array<{ id: string; class: string }> | undefined =
    useAppSelector((state) => state.server.types);

  const storeDispatch = useAppDispatch();
  const token: string | undefined = useAppSelector(
    (state) => state.user.auth.token
  );

  useEffect(() => {
    const fetch = async () => {
      if (token) {
        await FetchGraph(category.id, token).then(
          (data: Array<{ id: string; class: string }>) => {
            storeDispatch(serverActions.types(data));
          }
        );
      }
    };
    fetch();
  }, [storeDispatch, category, token]);

  const handleType = (type: { id: string; class: string }) => {
    storeDispatch(serverActions.batches(undefined));
    storeDispatch(serverActions.type(type));
  };

  return (
    <>
      <div className="p-4">
        <div className="prose flex flex-col justify-center align-center">
          <h3>{category.metatype_name}s</h3>
          <p>{category.metatype_name}s cataloged in DeepLynx</p>
        </div>
        <div className="divider"></div>
        {types ? (
          types.map((type: { id: string; class: string }) => {
            return (
              <>
                <div key={type.id}>
                  <button
                    style={{ display: "block", width: "100%" }}
                    className="btn"
                    onClick={() => handleType(type)}
                  >
                    {type.class}
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
