import Link from 'next/link';
import { BarChart2 } from 'lucide-react';
import BuyMeCoffeeButton from '@/components/ui/BuyMeCoffeeButton';
import BuyMeCoffeeMessage from '@/components/ui/BuyMeCoffeeMessage';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Wide, left-aligned support message and right-aligned button */}
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <BuyMeCoffeeMessage />
          <div className="md:self-start">
            <BuyMeCoffeeButton />
          </div>
        </div>
        {/* Footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground">
                Trade<span className="text-primary">Craft</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Educational trade plans for beginners and experienced traders alike.<br />
              <span className="font-semibold">A product of Labyrinth Ventures.</span><br />
              Contact: <a href="mailto:andrew.labyrinthventures@gmail.com" className="underline hover:text-primary">andrew.labyrinthventures@gmail.com</a>
            </p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-4">Education</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/education/trading-strategies-and-concepts" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Trading Strategies & Concepts
                </Link>
              </li>
              <li>
                <Link href="/education/case-studies-success-stories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Case Studies & Success Stories
                </Link>
              </li>
              <li>
                <Link href="/education/feature-breakdowns-updates" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Feature Breakdowns & Updates
                </Link>
              </li>
              <li>
                <Link href="/education/how-to-use-tradecraft" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How to Use TradeCraft
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-4">Company & Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4 text-left">
              The information provided by TradeCraft is for educational purposes only and should not be considered financial advice. Always do your own research before making investment decisions.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} TradeCraft. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Use
            </Link>
            <Link href="/disclaimer" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}