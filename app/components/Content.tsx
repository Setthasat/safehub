"use client";
import React, { useEffect, useState } from "react";
import { data } from "../data/data";
import { Search } from "lucide-react";

function Content() {
  const [facts, setFacts] = useState<typeof data>([]);

  // pick 4 random facts
  useEffect(() => {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setFacts(shuffled.slice(0, 4));
  }, []);

  return (
    <section
      id="content"
      className="relative w-full bg-[#50D890] flex flex-col items-center px-4 py-16 scroll-smooth"
    >
      {/* Search Bar */}
      <div className="absolute -top-8 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
        <form className="flex items-center bg-[#EFFFFB] rounded-full shadow-lg overflow-hidden">
          <input
            type="text"
            placeholder="SEARCH FORM TAGS OR NAME"
            className="flex-1 p-4 bg-transparent focus:outline-none text-black font-bold"
          />
          <button
            type="submit"
            className="p-4 bg-transparent text-black hover:text-[#50D890]"
          >
            <Search />
          </button>
        </form>
      </div>

      {/* Random Fact Section */}
      <div className="mt-20 w-full max-w-6xl flex flex-col gap-6">
        <h2 className="text-[#EFFFFB] font-bold text-xl sm:text-2xl flex items-center gap-2">
          RANDOM FACT FOR YOU TODAY{" "}
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
        </h2>

        {/* Grid Layout */}
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: 2/3 */}
          <div className="sm:col-span-2 bg-[#EFFFFB] rounded-2xl p-6 flex flex-col justify-center items-center shadow-md hover:shadow-xl transition">
            <h3 className="text-lg font-bold mb-2">{facts[0]?.title}</h3>
            <p className="text-sm text-gray-700 text-center">
              {facts[0]?.description}
            </p>
          </div>

          {/* Card 2: 1/3 */}
          <div className="bg-[#EFFFFB] rounded-2xl p-6 flex flex-col justify-center items-center shadow-md hover:shadow-xl transition">
            <h3 className="text-lg font-bold mb-2">{facts[1]?.title}</h3>
            <p className="text-sm text-gray-700 text-center">
              {facts[1]?.description}
            </p>
          </div>

          {/* Card 3: 1/3 */}
          <div className="bg-[#EFFFFB] rounded-2xl p-6 flex flex-col justify-center items-center shadow-md hover:shadow-xl transition">
            <h3 className="text-lg font-bold mb-2">{facts[2]?.title}</h3>
            <p className="text-sm text-gray-700 text-center">
              {facts[2]?.description}
            </p>
          </div>

          {/* Card 4: 2/3 */}
          <div className="sm:col-span-2 bg-[#EFFFFB] rounded-2xl p-6 flex flex-col justify-center items-center shadow-md hover:shadow-xl transition">
            <h3 className="text-lg font-bold mb-2">{facts[3]?.title}</h3>
            <p className="text-sm text-gray-700 text-center">
              {facts[3]?.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Content;
