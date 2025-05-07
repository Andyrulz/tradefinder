export default function TermsOfServicePage() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">Last updated: 5 May 2025</p>
        <p className="mb-4">By using TradeCraft (tradingsetup.pro), you agree to the following terms and conditions. Please read them carefully before using our website or services.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Use of Service</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>TradeCraft is for informational and educational purposes only. It does not provide financial, investment, or legal advice.</li>
          <li>You are responsible for your own investment decisions. Always do your own research.</li>
          <li>You must not misuse the site or attempt to disrupt its operation.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">User Accounts</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>You are responsible for maintaining the confidentiality of your account and credentials.</li>
          <li>We reserve the right to suspend or terminate accounts for misuse or violation of these terms.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Limitation of Liability</h2>
        <p className="mb-4">TradeCraft is not liable for any losses or damages resulting from the use of this site or its content.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Changes to Terms</h2>
        <p className="mb-4">We may update these Terms of Service at any time. Continued use of the site constitutes acceptance of the new terms.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
        <p>If you have questions about these terms, please <a href="/contact" className="text-primary underline">contact us</a>.</p>
      </div>
    </main>
  );
}