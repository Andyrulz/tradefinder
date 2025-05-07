export default function DisclaimerPage() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
        <p className="mb-4">Last updated: 5 May 2025</p>
        <p className="mb-4">The information provided by TradeCraft (tradingsetup.pro) is for educational and informational purposes only. It is not intended as financial, investment, or legal advice. You should consult with a qualified professional before making any investment decisions.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">No Financial Advice</h2>
        <p className="mb-4">TradeCraft does not guarantee the accuracy, completeness, or reliability of any information on this site. All trading and investment decisions are made at your own risk.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">External Links</h2>
        <p className="mb-4">Our website may contain links to third-party sites. We are not responsible for the content or privacy practices of those sites.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
        <p>If you have questions about this disclaimer, please <a href="/contact" className="text-primary underline">contact us</a>.</p>
      </div>
    </main>
  );
}