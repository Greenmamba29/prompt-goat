import { SectionHeader } from '@/components/ui/section-header';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Privacy Policy"
          description="Last updated: December 2024"
        />

        <div className="max-w-3xl mx-auto mt-12 prose prose-invert prose-slate">
          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account,
                make a purchase, or contact us for support. This includes:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Email address</li>
                <li>Name (optional)</li>
                <li>Payment information (processed securely by our payment provider)</li>
                <li>Any other information you choose to provide</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Communicate with you about products, services, and events</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties.
                We may share information with trusted service providers who assist us in operating our
                website and conducting our business, so long as they agree to keep this information
                confidential.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal
                information. Your personal information is stored behind secured networks and is only
                accessible by a limited number of persons who have special access rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Cookies</h2>
              <p>
                We use cookies to enhance your experience on our site. Cookies are small files that a
                site transfers to your computer's hard drive through your web browser that enables the
                site to recognize your browser and capture certain information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Access and receive a copy of your personal data</li>
                <li>Request correction of any inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@promptgoat.com" className="text-cyan-400 hover:text-cyan-300">
                  privacy@promptgoat.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
