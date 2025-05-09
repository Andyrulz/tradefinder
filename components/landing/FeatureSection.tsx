import {
  TrendingUp,
  ShieldAlert,
  Layers,
  BookOpen,
} from 'lucide-react';
import DiscoverScreener from './DiscoverScreener';

export function FeatureSection() {
  const features = [
    {
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      title: 'Basic Technical Analysis',
      description:
        'Get basic technical indicators and market analysis based on available data.',
    },
    {
      icon: <ShieldAlert className="h-10 w-10 text-chart-1" />,
      title: 'Market Context',
      description:
        'Understand the stock\'s sector, market cap, and current market position.',
    },
    {
      icon: <Layers className="h-10 w-10 text-chart-2" />,
      title: 'Simple Indicators',
      description:
        'Basic technical analysis using simple moving averages and price action.',
    },
    {
      icon: <BookOpen className="h-10 w-10 text-chart-3" />,
      title: 'Educational Insights',
      description:
        'Learn about basic technical analysis and market indicators.',
    },
  ];

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Trade Plans & Momentum Stock Discovery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Instantly generate actionable trade plans for any stock <b>or</b> discover today’s top momentum stocks using our free, data-driven tools. Make informed decisions with technical analysis and market context at your fingertips.
          </p>
        </div>
        <DiscoverScreener />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background rounded-lg p-6 shadow-sm border border-border/50"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}