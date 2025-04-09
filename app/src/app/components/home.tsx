// Router
import { useNavigate } from "react-router";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Components
import Carousel from "./ux/carousel";

// Types
import { UserT } from "@/lib/types/warehouse";

export const Home = () => {
  // Router
  const navigate = useNavigate();

  const user: UserT | undefined = useAppSelector(
    (state) => state.warehouse.user
  );

  return (
    <>
      <div className="w-screen h-screen bg-base-100">
        <div className="grid grid-cols-12 h-full w-full">
          <div className="col-span-6 flex justify-center items-center">
            <div className="grid grid-rows-2 gap-8">
              <div className="row-span-1 flex justify-center">
                <img
                  src={"/faraday-white.png"}
                  alt="Faraday"
                  className="w-1/2"
                />
              </div>
              <div className="row-span-1 flex justify-center">
                {user ? (
                  <button
                    className="btn btn-md btn-accent w-1/4"
                    onClick={() => {
                      navigate("/data");
                    }}
                  >
                    <a>Start</a>
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-accent w-1/4"
                    onClick={() => {
                      navigate("/auth");
                    }}
                  >
                    <a>Login</a>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-6 flex justify-center items-center">
            <Carousel />
          </div>
        </div>
      </div>
    </>
  );
};
