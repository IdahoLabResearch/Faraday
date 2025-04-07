// Router
import { useNavigate } from "react-router";

// Store
import { useAppSelector } from "@/lib/store/hooks";

// Components
import Carousel from "./ux/carousel";

export const Home = () => {
  // Router
  const navigate = useNavigate();

  const auth = useAppSelector((state) => state.user.auth);

  return (
    <>
      <div className="h-screen w-screen">
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-6 flex justify-center">
            <div>
              <img
                src={"/faraday-white.png"}
                alt="Faraday"
                className="w-72 p-4"
              />
              <br />
              <br />
              <div className="justify-center flex">
                {auth.token ? (
                  <button
                    className="btn btn-md"
                    onClick={() => {
                      navigate("/data");
                    }}
                  >
                    <a>Start</a>
                  </button>
                ) : (
                  <button
                    className="btn btn-md btn-accent w-1/2"
                    onClick={() => {
                      navigate("/auth");
                    }}
                  >
                    <a>Login</a>
                  </button>
                )}
              </div>
              <br />
            </div>
          </div>
          <div className="col-span-6 flex h-full">
            Carousel{/* <Carousel /> */}
          </div>
        </div>
      </div>
    </>
  );
};
