import React from 'react';

export default function CaseStudies() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Case Studies: Real Traders. Real Results.</h1>
        <p className="mb-4 text-lg">
          Discover how traders at different skill levels have transformed their trading outcomes using TradeCraft. 
          These in-depth case studies showcase real trade setups, decision-making processes, and key takeaways that led to success—or valuable lessons learned.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">📈 Case Study 1: Riding the Breakout — +25% in 3 Weeks</h2>
        <p className="mb-4">
          One TradeCraft user spotted a promising breakout setup: a midcap stock forming a classic volatility contraction pattern with volume drying up. 
          Using our screener to identify the setup and our trade planner to define precise entry, stop loss, and profit targets, they entered the trade at breakout confirmation. 
          Despite a minor pullback post-entry, the trader held on, trusting the volume signals and risk plan. The result? A solid 25% gain in just three weeks.
        </p>
        <p className="mb-4">
          In their journal, the trader reflected on the value of patience and execution discipline. This experience reinforced the importance of waiting for clear setups and not reacting emotionally to minor fluctuations.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">📉 Case Study 2: Turning a Loss into a Learning Opportunity</h2>
        <p className="mb-4">
          Another user entered a fast-moving stock based on a momentum breakout. However, the move failed, resulting in a 1% capital loss. 
          Because they used TradeCraft's trade planning module with strict risk controls, the downside was capped effectively. 
          Post-trade analysis revealed an overlooked earnings announcement that triggered the reversal.
        </p>
        <p className="mb-4">
          Through journaling and review, the trader identified a recurring blind spot—ignoring macro news and event dates. 
          As a result, they developed a personal checklist to cross-check earnings calendars and macro events before any new position. 
          A small loss became a powerful step forward in process refinement.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">📊 Case Study 3: From Random Trades to Consistent Performance</h2>
        <p className="mb-4">
          A beginner trader joined TradeCraft with little experience but a strong desire to improve. They committed to journaling every trade, reviewing educational content weekly, and interacting with community setups. 
          Over 3 months, their approach evolved from impulsive entries to rule-based decisions with defined risk-reward profiles.
        </p>
        <p className="mb-4">
          By tracking progress and studying trade patterns, they boosted their win rate from 30% to 55%, and their average R:R improved from 1:1 to nearly 2:1. 
          Today, they regularly contribute annotated charts to the community and have built a personal playbook of setups. 
          TradeCraft helped turn scattered efforts into a structured path of continuous improvement.
        </p>

        <div className="mt-12 border-t pt-6 text-sm text-gray-500">
          <p>
            <strong>Disclaimer:</strong> The information provided by TradeCraft (<a href="https://tradingsetup.pro" target="_blank" rel="noopener noreferrer" className="underline">tradingsetup.pro</a>) is for educational and informational purposes only. 
            It is not intended as financial, investment, or legal advice. You should consult with a qualified professional before making any investment decisions.
          </p>
        </div>
      </div>
    </main>
  );
}
