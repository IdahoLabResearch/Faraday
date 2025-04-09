// Hooks
import { useEffect } from "react";

// Store
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { warehouseActions } from "@/lib/store/features/warehouse";

// Types
import { CategoryT, UserT } from "@/lib/types/warehouse";

// Functions
import { FetchCategories } from "@/lib/client/warehouse";

const Categories = () => {
  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  // Store
  const categories = useAppSelector((state) => state.warehouse.categories);
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data: Array<CategoryT> = await FetchCategories();
        storeDispatch(warehouseActions.categories(data));
      }
    };
    fetch();
  }, [storeDispatch, user]);

  const handleCategory = (category: CategoryT) => {
    storeDispatch(warehouseActions.types(undefined));
    storeDispatch(warehouseActions.category(category));
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
          categories.map((category: CategoryT) => {
            return (
              <>
                <div key={category.id}>
                  <button
                    style={{ display: "block", width: "100%" }}
                    className="btn"
                    onClick={() => handleCategory(category)}
                  >
                    {category.name}
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
