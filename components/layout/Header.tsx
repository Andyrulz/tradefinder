'use client';

import Link from 'next/link';
import { BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BuyMeCoffeeIconButton } from '@/components/ui/BuyMeCoffeeButton';
import { signIn, signOut, useSession } from 'next-auth/react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-6 py-3',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm dark:bg-background/90'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BarChart2 className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl md:text-2xl text-foreground">
            Trade<span className="text-primary">Craft</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors">
            Contact Me
          </Link>
        </nav>
        <div className="flex items-center space-x-3">
          {/* Auth UI */}
          {status === 'loading' ? null : session ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground">{session.user?.name}</span>
              <Button size="sm" variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => signIn('google')}>
              Sign in with Google
            </Button>
          )}
          <div className="hidden md:block">
            <BuyMeCoffeeIconButton />
          </div>
        </div>
      </div>
    </header>
  );
}