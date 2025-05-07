export default function AboutPage() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">About TradeCraft</h1>
        <p className="mb-4">TradeCraft is dedicated to empowering traders and investors with institutional-grade trade plans, actionable analysis, and educational resources. Our mission is to make data-driven trading accessible to everyone, from beginners to experienced professionals.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Who We Are</h2>
        <p className="mb-4">TradeCraft is built by a passionate team of traders, technologists, and educators. We believe in transparency, education, and empowering users to make better decisions in the stock market.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">What We Offer</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Automated, data-driven trade plans for stocks</li>
          <li>Stock screener with multi-bagger traits</li>
          <li>Technical and fundamental analysis tools</li>
          <li>Educational content and resources</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Our Values</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Transparency and honesty</li>
          <li>Education and empowerment</li>
          <li>User privacy and data security</li>
        </ul>
        <p className="mt-8">For questions or feedback, please <a href="/contact" className="text-primary underline">contact us</a>.</p>
      </div>
    </main>
  );
}