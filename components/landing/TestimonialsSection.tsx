import React from 'react';

const TestimonialsSection = () => {
  return (
    <section className="bg-gray-100 py-16 px-4 text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Trusted by Traders</h2>
        <p className="text-gray-600 mb-12 max-w-xl mx-auto">
          Hundreds of traders rely on our analysis to get clarity in the chaos — from swing setups to long-term holds.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-700 italic mb-4">
              "The technical analysis and trade plans have been spot on. I've seen consistent returns since I started following the recommendations."
            </p>
            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-500">
                <div className="font-semibold">Sarah K.</div>
                <div>Day Trader, New York</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-700 italic mb-4">
              "The stock screener has helped me identify opportunities I would have otherwise missed. It's become an essential part of my trading routine."
            </p>
            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-500">
                <div className="font-semibold">Michael R.</div>
                <div>Swing Trader, California</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-700 italic mb-4">
              "The combination of fundamental and technical analysis gives me confidence in my trades. The platform has transformed my trading strategy."
            </p>
            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-500">
                <div className="font-semibold">David L.</div>
                <div>Position Trader, Texas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 