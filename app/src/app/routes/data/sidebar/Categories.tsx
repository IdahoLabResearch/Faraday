"use client";

// Hooks
import { useEffect } from "react";
import { useCookies } from "react-cookie";

// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { serverActions } from "@/lib/store/features/server";

// Types
import { FetchCategories } from "@/lib/api/client";

const Categories = () => {
  // Auth
  const auth: { code: string | undefined; token: string | undefined } =
    useAppSelector((state) => state.user.auth);

  // Store
  const categories = useAppSelector((state) => state.server.categories);
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      if (auth.code && auth.token) {
        await FetchCategories(auth.code, auth.token).then(
          (
            data: Array<{
              id: string;
              metatype_name: string;
            }>
          ) => {
            storeDispatch(serverActions.categories(data));
          }
        );
      }
    };
    fetch();
  }, [storeDispatch, auth]);

  const handleCategory = (category: { id: string; metatype_name: string }) => {
    storeDispatch(serverActions.types(undefined));
    storeDispatch(serverActions.category(category));
  };

  return (
    <>
      <div className="p-4">
        <div className="prose flex flex-col justify-center align-center">
          <h3>Categories</h3>
          <p>Select a category to being exploring data</p>
        </div>
        <div className="divider"></div>
        {categories ? (
          categories.map((category: { id: string; metatype_name: string }) => {
            return (
              <>
                <div key={category.id}>
                  <button
                    style={{ display: "block", width: "100%" }}
                    className="btn"
                    onClick={() => handleCategory(category)}
                  >
                    {category.metatype_name}
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

export default Categories;
