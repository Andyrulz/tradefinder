export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Last updated: 5 May 2025</p>
        <p className="mb-4">TradeCraft (tradingsetup.pro) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Personal information you provide (such as email address when signing in or contacting us).</li>
          <li>Usage data (pages visited, actions taken) collected via Google Analytics.</li>
          <li>Technical data (browser, device, IP address) for analytics and security.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>To provide and improve our services.</li>
          <li>To respond to your inquiries or requests.</li>
          <li>To analyze site usage and improve user experience.</li>
          <li>To display relevant ads via Google AdSense.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Cookies & Third-Party Services</h2>
        <p className="mb-4">We use cookies and similar technologies for analytics and advertising. Third-party services (such as Google Analytics and AdSense) may collect information in accordance with their own privacy policies.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Your Rights</h2>
        <p className="mb-4">You may request to access, update, or delete your personal information by contacting us. We do not sell your personal data.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
        <p>If you have any questions about this Privacy Policy, please <a href="/contact" className="text-primary underline">contact us</a>.</p>
      </div>
    </main>
  );
}