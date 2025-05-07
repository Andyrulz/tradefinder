'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScreenerFilters as FilterType } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';

interface ScreenerFiltersProps {
  onFilter: (filters: FilterType) => void;
}

export function ScreenerFilters({ onFilter }: ScreenerFiltersProps) {
  const [filters, setFilters] = useState<FilterType>({
    minTraits: 6,
    timeHorizon: 'swing',
  });

  const [showSectorFilter, setShowSectorFilter] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2.5">
          <Label className="text-sm font-medium">Minimum Traits</Label>
          <Select
            value={filters.minTraits.toString()}
            onValueChange={(value) => setFilters({ ...filters, minTraits: parseInt(value) })}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select minimum traits" />
            </SelectTrigger>
            <SelectContent>
              {[4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} or more traits
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Higher traits indicate stronger potential
          </p>
        </div>

        <div className="space-y-2.5">
          <Label className="text-sm font-medium">Time Horizon</Label>
          <Select
            value={filters.timeHorizon}
            onValueChange={(value: any) => setFilters({ ...filters, timeHorizon: value })}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select time horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="swing">Swing Trade (1-5 days)</SelectItem>
              <SelectItem value="positional">Positional (2-4 weeks)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose based on your trading style
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sector-filter" className="text-sm font-medium">Sector Filter</Label>
            <Switch
              id="sector-filter"
              checked={showSectorFilter}
              onCheckedChange={setShowSectorFilter}
            />
          </div>

          {showSectorFilter && (
            <Select
              value={filters.sector}
              onValueChange={(value) => setFilters({ ...filters, sector: value })}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="consumer">Consumer</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full md:w-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
        >
          <Search className="w-4 h-4 mr-2" />
          Find Matching Stocks
        </Button>
      </div>
    </form>
  );
}