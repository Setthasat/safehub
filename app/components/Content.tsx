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
            className="flex-1 p-8 bg-transparent focus:outline-none text-black font-bold"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* 1 */}
          <Card fact={facts[0]} className="sm:col-span-2" />
          {/* 2 */}
          <Card fact={facts[1]} />
          {/* 3 */}
          <Card fact={facts[2]} />
          {/* 4 */}
          <Card fact={facts[3]} className="sm:col-span-2" />
        </div>
      </div>
    </section>
  );
}

export default Content;

// ✅ Card Component
function Card({
  fact,
  className = "",
}: {
  fact?: (typeof data)[0];
  className?: string;
}) {
  if (!fact) return null;

  return (
    <div
      className={`bg-[#EFFFFB] rounded-2xl flex flex-col shadow-md hover:shadow-xl transition overflow-hidden h-full relative ${className}`}
    >
      {/* Image with tags on top-right */}
      <div className="relative w-full h-48">
        <img
          src={fact.image}
          alt={fact.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-wrap gap-2">
          {fact.tags?.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs font-semibold bg-black/70 text-white rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex  justify-between gap-3 flex-grow">
        <h3 className="text-lg font-bold">{fact.title}</h3>
        <a
          href={fact.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-500 text-white text-xs px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition"
        >
          Visit
        </a>
      </div>
    </div>
  );
}
