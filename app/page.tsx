import Content from "./components/Content";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center w-full min-h-screen bg-[#272727] overflow-x-hidden scroll-smooth">
      <Hero />
      <Content />
    </div>
  );
}
