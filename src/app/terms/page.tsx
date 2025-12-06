import { SectionHeader } from '@/components/ui/section-header';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Terms of Service"
          description="Last updated: December 2024"
        />

        <div className="max-w-3xl mx-auto mt-12 prose prose-invert prose-slate">
          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Prompt Goat ("Service"), you accept and agree to be bound by
                these Terms of Service. If you do not agree to these terms, please do not use our
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                Prompt Goat provides a library of AI prompts designed to enhance productivity and
                creativity when working with AI language models. The Service includes access to
                curated prompts, regular updates, and supporting materials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
              <p>
                To access certain features of the Service, you must create an account. You are
                responsible for maintaining the confidentiality of your account credentials and for
                all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Payment and Refunds</h2>
              <p>
                Purchases are processed securely through our payment provider. All sales are final,
                except as outlined in our Refund Policy. We offer a 7-day money-back guarantee for
                eligible purchases.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Intellectual Property</h2>
              <p>
                The prompts and content provided through Prompt Goat are for your personal and
                commercial use. You may use the prompts in your own projects but may not resell,
                redistribute, or share your account access with others.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Prohibited Uses</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Share your account credentials with others</li>
                <li>Redistribute or resell the prompts</li>
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Interfere with or disrupt the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Disclaimer of Warranties</h2>
              <p>
                The Service is provided "as is" without warranties of any kind, either express or
                implied. We do not guarantee that the prompts will produce specific results or
                outcomes when used with AI models.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p>
                In no event shall Prompt Goat be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any
                material changes by posting the new terms on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Contact</h2>
              <p>
                For any questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@promptgoat.com" className="text-cyan-400 hover:text-cyan-300">
                  legal@promptgoat.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
