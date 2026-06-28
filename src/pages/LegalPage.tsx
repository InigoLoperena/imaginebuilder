import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LegalPage() {
  return (
    <div className="policy-page min-h-screen p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-impact text-rebel mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: March 26, 2026</p>
        </div>
        
        <div className="prose prose-lg max-w-none space-y-8">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using the Greenhunt mobile application ("App") or visiting our website at <a href="https://greenhunt.net" className="text-rebel underline">greenhunt.net</a> ("Website"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the App or Website.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you ("User," "you") and GREENRIOT SL, CORP ("Greenriot," "we," "us"), EIN 36-5060375, D-U-N-S® 110845024, located at 4751 Luminous Loop, 34746 Kissimmee, FL, United States.
            </p>
          </section>

          {/* Description of Services */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">2. Description of Services</h2>
            <p>
              Greenhunt is a mobile application that enables users to discover, share, and collect discarded items found on public streets. The App provides:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>An interactive map displaying nearby street finds posted by other users</li>
              <li>The ability to post item locations with photos and descriptions</li>
              <li>A marketplace for purchasing precise item coordinates</li>
              <li>A local feed of available items in your area</li>
              <li>User profiles and community features</li>
            </ul>
            <p>
              The Website (<a href="https://greenhunt.net" className="text-rebel underline">greenhunt.net</a>) is purely informational. All transactional features operate exclusively through the App.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">3. Eligibility</h2>
            <p>You must be at least:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>13 years old</strong> in the United States</li>
              <li><strong>16 years old</strong> in the European Union</li>
            </ul>
            <p>
              If you are under the applicable age, you may not use the App. By using the App, you represent and warrant that you meet these age requirements.
            </p>
          </section>

          {/* Account */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">4. User Accounts</h2>
            <p>To access certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Accept responsibility for all activity under your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms or are inactive for an extended period.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">5. Acceptable Use</h2>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post false, misleading, or fraudulent item listings</li>
              <li>Upload inappropriate, offensive, or illegal content (including photos)</li>
              <li>Use the App for any illegal purpose or in violation of local laws</li>
              <li>Attempt to reverse-engineer, hack, or disrupt the App</li>
              <li>Harvest data or scrape content from the App</li>
              <li>Impersonate another user or entity</li>
              <li>Use automated systems (bots) to interact with the App</li>
              <li>Post items that are stolen, hazardous, or illegal to possess</li>
            </ul>
          </section>

          {/* Camera & Content */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">6. Camera Usage and User Content</h2>
            <p>
              The App allows you to take and upload photos using your device camera. By using this feature, you agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are solely responsible for the content of photos you upload</li>
              <li>Photos must accurately represent the items being listed</li>
              <li>You must not include identifiable persons without their consent</li>
              <li>Photos must not contain offensive, illegal, or copyrighted material</li>
              <li>By uploading photos, you grant Greenriot a non-exclusive, worldwide, royalty-free license to display them within the App for the purpose of item listings</li>
            </ul>
            <p>
              We reserve the right to remove any content that violates these Terms without notice.
            </p>
          </section>

          {/* User-Generated Content */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">7. User-Generated Content</h2>
            <p>
              Users may create listings, upload photos, and share item locations ("User Content"). You retain ownership of your User Content but grant us a license to use, display, and distribute it within the App.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You represent that you have the right to share all User Content</li>
              <li>We may remove User Content at our discretion</li>
              <li>We are not responsible for the accuracy of User Content posted by others</li>
              <li>You acknowledge that items listed may no longer be available when you arrive at the location</li>
            </ul>
          </section>

          {/* Payments & Transactions */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">8. Payments and Transactions</h2>
            <p>
              The App facilitates peer-to-peer transactions for the exchange of location data (coordinates) related to items. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Greenriot is not a bank, financial institution, or escrow service</li>
              <li>Payments are processed by Stripe, a third-party payment provider</li>
              <li>Greenriot retains a service fee (currently 20%) on each successful transaction</li>
              <li>The remaining balance is disbursed to the user who posted the item coordinates</li>
              <li>All purchases are for access to real-world location data for physical, offline use</li>
              <li>Refunds are handled on a case-by-case basis</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">9. Intellectual Property</h2>
            <p>
              All trademarks, logos, designs, and content on the App and Website (excluding User Content) are the property of Greenriot or its licensors. You may not copy, modify, distribute, or create derivative works without prior written consent.
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The App is provided "AS IS" without warranties of any kind</li>
              <li>We do not guarantee the availability, accuracy, or quality of items listed</li>
              <li>We are not responsible for any loss, injury, or damage arising from the use of the App or the collection of items</li>
              <li>We are not responsible for interactions between users</li>
              <li>Our total liability shall not exceed the amount you paid to us in the 12 months preceding the claim</li>
            </ul>
            <p>
              You assume all risks associated with traveling to item locations and collecting discarded items, including but not limited to personal safety, item condition, and local regulations.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Greenriot, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the App, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">12. Termination</h2>
            <p>
              We may suspend or terminate your access to the App at any time, with or without cause, and with or without notice. Upon termination:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your right to use the App ceases immediately</li>
              <li>We may delete your account and User Content</li>
              <li>Pending payouts may be processed or forfeited depending on the reason for termination</li>
              <li>Provisions that by nature should survive termination will remain in effect</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Florida, United States, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of Osceola County, Florida.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">14. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the App after changes constitutes acceptance. We will notify you of material changes via email or in-app notification.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">15. Contact</h2>
            <p>For questions about these Terms, contact us at:</p>
            <ul className="list-none pl-0 space-y-1">
              <li>📧 <strong>hello@greenhunt.net</strong></li>
              <li>📍 4751 Luminous Loop, 34746 Kissimmee, FL, United States</li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground mt-8 border-t pt-4">
            Effective date: March 26, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
