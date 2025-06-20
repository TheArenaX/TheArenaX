import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <Navigation />
        <div className="container mx-auto max-w-4xl">
        <Card className="bg-gray-900/50 border-gray-700 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Terms of Service</CardTitle>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">Last updated: June 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-300 text-sm sm:text-base md:text-lg">
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using TheArenaX platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. User Accounts</h2>
              <p className="mb-4">
                To participate in tournaments, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 13 years old to create an account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for all activities under your account</li>
                <li>You must notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Tournament Rules</h2>
              <p className="mb-4">
                All tournaments on TheArenaX are subject to specific rules and guidelines. By participating, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Follow fair play guidelines</li>
                <li>Not use any form of cheating or unfair advantage</li>
                <li>Respect other participants and tournament organizers</li>
                <li>Accept tournament results and prize distribution</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Credits and Payments</h2>
              <p className="mb-4">
                TheArenaX uses a credit system for tournament entry fees and rewards. Credits are non-refundable and non-transferable.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credits can be purchased through our platform</li>
                <li>Entry fees are deducted in credits</li>
                <li>Prize winnings are distributed in credits</li>
                <li>Credits cannot be exchanged for real currency</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Code of Conduct</h2>
              <p className="mb-4">
                We expect all users to maintain a respectful and professional environment. Prohibited behaviors include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Harassment or bullying of other users</li>
                <li>Use of offensive language or content</li>
                <li>Attempting to manipulate tournament results</li>
                <li>Sharing account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Termination</h2>
              <p className="mb-4">
                We reserve the right to terminate or suspend accounts that violate these terms. Grounds for termination include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent activity</li>
                <li>Abusive behavior</li>
                <li>Repeated violations of tournament rules</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Changes to Terms</h2>
              <p className="mb-4">
                We may update these terms from time to time. We will notify users of any material changes through our platform or via email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Contact</h2>
              <p className="mb-4">
                If you have any questions about these terms, please contact us at support@thearenax.com
              </p>
            </section>
              </CardContent>
            </Card>
      </div>
    </div>
  );
};

export default Terms;
