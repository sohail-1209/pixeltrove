

import Link from 'next/link';
import { FireArrowIcon } from './fire-arrow-icon';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/#" className="mr-6 flex items-center space-x-2 pl-[10px]">
          <span className="font-bold sm:inline-block font-headline">PiXelTrove</span>
          <FireArrowIcon className="h-4 w-8" />
        </Link>
      </div>
    </header>
  );
}
