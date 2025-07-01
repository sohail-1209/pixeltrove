import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </div>
  );
}
