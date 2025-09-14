"use client";
import React, { useState } from "react";
import HandCursor from "../../public/HandCursor.png";
import { ChevronDown } from "lucide-react";
import { data } from "../data/data";

function Hero() {
  const [usedLinks, setUsedLinks] = useState<number[]>([]);

  const getRandomLink = () => {
    // if all links are used, reset
    if (usedLinks.length === data.length) {
      setUsedLinks([]);
    }

    // get unused links
    const available = data.filter((_, i) => !usedLinks.includes(i));
    const randomIndex = Math.floor(Math.random() * available.length);
    const chosen = available[randomIndex];

    // track used link
    setUsedLinks((prev) => [...prev, data.indexOf(chosen)]);

    // open in new tab
    window.open(chosen.link, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="flex flex-col justify-center items-center gap-8 relative min-h-screen -mb-[6rem] -mt-[12rem]">
      <h1 className="text-[#EFFFFB] font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
        WELCOME TO <span className="text-[#50D890]">SAFEHUB</span>
      </h1>

      <div className="flex justify-between items-center gap-4 text-[10px] sm:text-[12px] md:text-xl lg:text-2xl xl:text-3xl font-bold w-full relative">
        <p className="flex justify-center items-center p-2 py-3 bg-[#50D890] text-[#EFFFFB] rounded-full w-3/4">
          EXPLORE 100+ FUN FACTS
        </p>

        {/* NOW button */}
        <button
          title="Random Fact"
          onClick={getRandomLink}
          className="flex justify-center items-center p-2 py-3 w-1/4 bg-[#EFFFFB] rounded-full hover:bg-[#d9fff2] transition"
        >
          NOW
        </button>

        <img
          src={HandCursor.src}
          alt="Hand Cursor"
          className="absolute -right-12 sm:-right-16 md:-right-20 top-8 sm:top-12 md:top-16 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20"
        />
      </div>

      <a
        href="#content"
        className="absolute bottom-[18vh] animate-bounce text-[#EFFFFB] hover:text-[#50D890]"
      >
        <ChevronDown size={48} strokeWidth={3} />
      </a>
    </section>
  );
}

export default Hero;
