// Hooks
import { useState, useEffect } from "react";

import Footer from "../footer";

// Carousel data
const carouselItems = [
  <div key={1} className="card bg-base-300 h-24">
    <div className="prose">
      <p>
        Faraday is a data warehousing and visualization platform for
        electrochemical impedance spectroscopy data
      </p>
    </div>
  </div>,
  <div key={2} className="card bg-base-300 h-24 flex">
    <div className="prose">
      <p>
        We catalog data from multiple providers in the INL open-source DeepLynx
        data warehouse
      </p>
    </div>
    <br />
  </div>,
  <div key={3} className="card bg-base-300 h-24 flex">
    <div className="prose">
      <p>
        Users can analyze button cell data using a library of scientific plugins
      </p>
    </div>
  </div>,
];

const Carousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => {
        return index === carouselItems.length - 1 ? 0 : index + 1;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="bg-base-300 relative overflow-hidden w-4/5">
      <div className="flex w-full">
        <div className="prose">
          <h1>Faraday</h1>
        </div>
      </div>
      <br />
      <div
        className={"flex transition-transform duration-500"}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {carouselItems.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {item}
          </div>
        ))}
        <div className="w-full flex-shrink-0">{carouselItems[index]}</div>
      </div>
      <Footer />
      <div className="w-full flex justify-center">
        <div className="prose">
          <small>Developed by the Idaho National Laboratory</small>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
