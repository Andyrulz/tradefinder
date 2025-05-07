import { ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Enter Stock Symbol',
      description: 'Input any publicly traded stock symbol to get started.',
    },
    {
      number: '02',
      title: 'View Basic Analysis',
      description: 'Get basic technical indicators and market context for the stock.',
    },
    {
      number: '03',
      title: 'Understand Signals',
      description: 'Learn about the stock\'s current market position and technical score.',
    },
    {
      number: '04',
      title: 'Make Informed Decisions',
      description: 'Use the basic analysis to help inform your investment decisions.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started with basic stock analysis in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50">
                <div className="text-4xl font-bold text-primary mb-4">{step.number}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}