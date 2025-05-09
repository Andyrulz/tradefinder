import { ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Path',
      description: 'Enter a stock symbol to generate a trade plan, or click “Find Momentum Stocks” to discover today’s top setups.',
    },
    {
      number: '02',
      title: 'Get Instant Results',
      description: 'Receive a detailed trade plan with entry, targets, and risk—or see the top 10 actionable momentum stocks for today.',
    },
    {
      number: '03',
      title: 'Review Analysis',
      description: 'Explore technical indicators, market context, and actionable insights for your selected stock or screener results.',
    },
    {
      number: '04',
      title: 'Act with Confidence',
      description: 'Use the generated plan or screener results to make informed trading decisions, every day.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Instantly generate a trade plan <b>or</b> discover high momentum stocks in four simple steps.
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