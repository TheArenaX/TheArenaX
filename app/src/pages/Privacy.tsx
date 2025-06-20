import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <Navigation />
        <div className="container mx-auto max-w-4xl">
        <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Privacy Policy</CardTitle>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">Last updated: June 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-300 text-sm sm:text-base md:text-lg">
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="mb-4">
                TheArenaX is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information to provide and improve our services. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (username, email, password)</li>
                <li>Profile information (game preferences, skill level)</li>
                <li>Tournament participation history</li>
                <li>Payment and credit transaction history</li>
                <li>Device and usage information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process tournament registrations and payments</li>
                <li>Send important notifications and updates</li>
                <li>Improve our platform and user experience</li>
                <li>Prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tournament organizers and participants</li>
                <li>Payment processors and service providers</li>
                <li>Law enforcement when required by law</li>
                <li>Other users as part of tournament participation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage and transmission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences</li>
                <li>Analyze platform usage</li>
                <li>Improve our services</li>
                <li>Provide personalized content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Children's Privacy</h2>
              <p className="mb-4">
                Our services are not intended for children under 13. We do not knowingly collect information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Changes to Privacy Policy</h2>
              <p className="mb-4">
                We may update this privacy policy from time to time. We will notify you of any material changes through our platform or via email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this privacy policy, please contact us at privacy@thearenax.com
              </p>
            </section>
              </CardContent>
            </Card>
      </div>
    </div>
  );
};

export default Privacy;
