import { Coffee } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

const BuyMeCoffeeButton = () => (
  <a
    href="https://www.buymeacoffee.com/tradecraftapp"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-5 py-3 rounded-lg font-bold text-white bg-[#BD5FFF] hover:bg-[#a14fd1] transition-colors shadow-lg"
    style={{ fontFamily: 'Cookie, cursive', fontSize: '1.25rem' }}
  >
    <Coffee className="mr-2" size={22} />
    Buy me a coffee please
  </a>
);

export const BuyMeCoffeeIconButton = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href="https://www.buymeacoffee.com/tradecraftapp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full p-2 text-[#BD5FFF] hover:bg-[#f3e8ff] transition-colors"
          aria-label="Buy me a coffee"
        >
          <Coffee size={22} />
        </a>
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>
        Buy me a coffee
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default BuyMeCoffeeButton; 