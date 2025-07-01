import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/#" className="mr-6 flex items-center space-x-2 pl-[10px]">
          <span className="font-bold sm:inline-block font-headline">Noirfolio</span>
        </Link>
      </div>
    </header>
  );
}
