'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Info, Loader2 } from 'lucide-react';
import { validateStockSymbol } from '@/lib/api';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Form schema
const formSchema = z.object({
  stockSymbol: z
    .string()
    .min(1, { message: 'Stock symbol is required' })
    .max(10, { message: 'Stock symbol cannot exceed 10 characters' })
    .regex(/^[A-Za-z0-9.]+$/, { message: 'Only letters, numbers, and periods are allowed' }),
  timeHorizon: z.string({
    required_error: 'Please select a time horizon',
  }),
});

export function StockForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const router = useRouter();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stockSymbol: '',
      timeHorizon: 'swing',
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setValidationError('');
    
    try {
      const isValid = await validateStockSymbol(values.stockSymbol);
      
      if (!isValid) {
        setValidationError('Invalid stock symbol. Please enter a valid NYSE or NASDAQ symbol.');
        setIsLoading(false);
        return;
      }
      
      // Navigate to trade plan page with query parameters
      router.push(`/trade-plan?symbol=${values.stockSymbol.toUpperCase()}&horizon=${values.timeHorizon}`);
    } catch (error) {
      setValidationError('Error validating stock symbol. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="stockSymbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Symbol</FormLabel>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="AAPL, MSFT, GOOGL..."
                    className="pl-9"
                    list="stock-suggestions"
                    aria-label="Stock Symbol"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                  <datalist id="stock-suggestions">
                    <option value="AAPL" />
                    <option value="MSFT" />
                    <option value="GOOGL" />
                    <option value="AMZN" />
                    <option value="TSLA" />
                    <option value="NVDA" />
                    <option value="META" />
                    <option value="NFLX" />
                    <option value="ADBE" />
                    <option value="INTC" />
                  </datalist>
                </div>
              </FormControl>
              {validationError && (
                <p className="text-sm font-medium text-destructive">{validationError}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeHorizon"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Time Horizon</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer" aria-label="Time Horizon Info" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <span>
                        <b>Swing Trade:</b> 1-5 days<br />
                        <b>Positional:</b> 2-4 weeks<br />
                        <b>Long Term:</b> 1+ months
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time horizon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="swing">Swing Trade (1-5 days)</SelectItem>
                  <SelectItem value="positional">Positional (2-4 weeks)</SelectItem>
                  <SelectItem value="longterm">Long Term (1+ months)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-lg py-3 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          disabled={isLoading}
          aria-label="Generate Trade Plan"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <></>}
          {isLoading ? 'Analyzing...' : 'Generate Trade Plan'}
        </Button>
      </form>
    </Form>
  );
}