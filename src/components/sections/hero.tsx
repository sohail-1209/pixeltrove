import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen min-h-[600px] flex items-center justify-center">
      <div className="container px-4 md:px-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
            Creative Developer & Designer
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Building elegant digital experiences with a focus on clean code and user-centric design.
          </p>
          <div className="flex justify-center">
             <Button asChild size="lg" className="font-bold">
              <Link href="#projects">
                View My Work
                <ArrowDown className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 animate-bounce">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  );
}
