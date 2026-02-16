import React from "react";
import Header from "../components/Header";
import SpeacialityMenu from "../components/SpeacialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div className="animate-in fade-in duration-700 ease-out">
      {/* The Hero Section */}
      <Header />

      {/* Content wrapper to maintain consistent horizontal alignment */}
      <div className="flex flex-col gap-y-0">
        <SpeacialityMenu />

        <TopDoctors />

        <Banner />
      </div>
    </div>
  );
};

export default Home;
