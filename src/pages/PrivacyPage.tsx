import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-impact text-rebel mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 26, 2026</p>
        </div>
        
        <div className="prose prose-lg max-w-none space-y-8">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Introduction</h2>
            <p>
              GREENRIOT SL, CORP ("Greenriot," "we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application ("App") and website (<a href="https://greenhunt.net" className="text-rebel underline">greenhunt.net</a>).
            </p>
            <p>
              We only access your data when it's needed for core features. You stay in control of your permissions at all times.
            </p>
          </section>

          {/* Company Info */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Company Information</h2>
            <ul className="list-none space-y-1 pl-0">
              <li><strong>Company Name:</strong> GREENRIOT SL, CORP</li>
              <li><strong>EIN:</strong> 36-5060375</li>
              <li><strong>D-U-N-S® Number:</strong> 110845024</li>
              <li><strong>Address:</strong> 4751 Luminous Loop, 34746 Kissimmee, FL, United States</li>
              <li><strong>Email:</strong> hello@greenhunt.net</li>
            </ul>
          </section>

          {/* Location Data — CRITICAL SECTION */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">📍 Location Data</h2>
            <p className="font-semibold text-lg">
              Our App collects precise GPS location data from your device.
            </p>

            <h3 className="text-xl font-impact text-rebel mb-3">When We Collect Location Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>While using the App:</strong> Location is collected when you actively use the App to discover nearby street finds, post items on the map, or browse the local feed.</li>
              <li><strong>Not in background:</strong> We do not collect location data when the App is closed or running in the background, unless you explicitly enable background location for specific features.</li>
            </ul>

            <h3 className="text-xl font-impact text-rebel mb-3">Why We Need Your Location</h3>
            <p>
              Location data is essential for the core functionality of the App. Specifically, we use your precise GPS location to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Show nearby discarded items on an interactive map so you can discover free valuable items around you.</li>
              <li>Allow you to post the exact location of items you find on the street for others to collect.</li>
              <li>Calculate distances and provide directions to item locations.</li>
              <li>Display a localized feed of available items in your area.</li>
            </ul>
            <p className="italic text-muted-foreground">
              Without location access, the App cannot display nearby items or allow you to share item locations — these are the core features of the service.
            </p>

            <h3 className="text-xl font-impact text-rebel mb-3">How Location Data Is Used</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Linked to identity:</strong> Your location may be associated with your user account when you post items. Other users will see the item's location but not your personal identity.</li>
              <li><strong>Third-party sharing:</strong> We do not sell or share your precise location data with third parties for advertising. Anonymized, aggregated location data may be used for analytics to improve the service.</li>
            </ul>

            <h3 className="text-xl font-impact text-rebel mb-3">Your Control Over Location</h3>
            <p>
              You can enable or disable location permissions at any time through your device settings:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>iOS:</strong> Settings → Privacy & Security → Location Services → Greenhunt</li>
              <li><strong>Android:</strong> Settings → Apps → Greenhunt → Permissions → Location</li>
            </ul>
            <p>
              Disabling location will limit your ability to use map-based features, but you can still browse the App in a limited capacity.
            </p>
          </section>

          {/* Camera & Photos — CRITICAL SECTION */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">📷 Camera and Photos Access</h2>
            <p className="font-semibold text-lg">
              Our App requests access to your device camera.
            </p>

            <h3 className="text-xl font-impact text-rebel mb-3">Why We Need Camera Access</h3>
            <p>
              The camera is used to let you take photos of discarded items you find on the street, so other users can see what's available before traveling to the location. Your camera is used only when you choose to take a photo — we never activate the camera without your direct action.
            </p>

            <h3 className="text-xl font-impact text-rebel mb-3">How Photos Are Handled</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Upload:</strong> Photos you take are uploaded to our secure cloud servers so they can be displayed to other users alongside item listings.</li>
              <li><strong>Storage:</strong> Photos are stored on our servers for as long as the item listing is active. When you delete a listing, the associated photos are removed.</li>
              <li><strong>Processing:</strong> Photos may be resized and compressed for optimal display. No facial recognition or biometric analysis is performed.</li>
              <li><strong>Sharing:</strong> Photos are visible to other App users as part of item listings. They are not shared with third parties for advertising or any unrelated purpose.</li>
            </ul>

            <h3 className="text-xl font-impact text-rebel mb-3">Your Control Over Camera Access</h3>
            <p>
              You can enable or disable camera permissions at any time through your device settings:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>iOS:</strong> Settings → Privacy & Security → Camera → Greenhunt</li>
              <li><strong>Android:</strong> Settings → Apps → Greenhunt → Permissions → Camera</li>
            </ul>
          </section>

          {/* General Data Collection */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">General Data We Collect</h2>
            
            <h3 className="text-xl font-impact text-rebel mb-3">Personal Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email address (for account creation and communication)</li>
              <li>Username / nickname (displayed publicly on listings)</li>
              <li>Payment information (processed securely via Stripe — we do not store card details)</li>
            </ul>

            <h3 className="text-xl font-impact text-rebel mb-3">Device Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Device type, model, and operating system</li>
              <li>Unique device identifiers</li>
              <li>Browser type (for website access)</li>
            </ul>

            <h3 className="text-xl font-impact text-rebel mb-3">Usage Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Pages and screens viewed</li>
              <li>Features used and interactions</li>
              <li>Time spent on pages</li>
              <li>Crash reports and performance data</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> Payment processing. Stripe may receive your payment details and transaction data. See <a href="https://stripe.com/privacy" className="text-rebel underline" target="_blank" rel="noopener noreferrer">Stripe's Privacy Policy</a>.</li>
              <li><strong>Supabase:</strong> Backend infrastructure, authentication, and data storage.</li>
              <li><strong>Analytics tools:</strong> We may use analytics services to understand usage patterns. These services receive anonymized usage data only.</li>
            </ul>
            <p>
              <strong>Third-party access to location or images:</strong> Third-party services do not receive your precise location data or photos unless explicitly stated above. Analytics services receive only anonymized, aggregated data.
            </p>
          </section>

          {/* Data Usage Purposes */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Provide core functionality:</strong> Display nearby items, enable posting and purchasing of item locations, process transactions.</li>
              <li><strong>Improve the App:</strong> Analyze anonymized usage patterns to enhance features, fix bugs, and optimize performance.</li>
              <li><strong>Security and fraud prevention:</strong> Detect and prevent unauthorized access, abuse, or fraudulent transactions.</li>
              <li><strong>Communication:</strong> Send transactional emails (account verification, receipts) and, with your consent, promotional updates.</li>
              <li><strong>Legal compliance:</strong> Fulfill legal obligations and respond to lawful requests.</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Data Sharing</h2>
            <p className="font-semibold text-lg">We do not sell your personal data.</p>
            <p>We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>With other users:</strong> Item listings (including photos and approximate location) are visible to other users.</li>
              <li><strong>Service providers:</strong> Trusted third parties who help us operate the App (payment processing, hosting) under strict confidentiality agreements.</li>
              <li><strong>Legal obligations:</strong> When required by law, subpoena, court order, or to protect our rights and safety.</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, your data may be transferred to the successor entity.</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Children's Privacy</h2>
            <p>
              Our App is not intended for children under 13 years of age (or under 16 in the EU). We do not knowingly collect personal data from children. If we discover that a child under 13 has provided us with personal information, we will delete it immediately.
            </p>
            <p>
              If you are a parent or guardian and believe your child has provided us with personal data, please contact us at <strong>hello@greenhunt.net</strong> so we can take appropriate action.
            </p>
          </section>

          {/* GDPR & User Rights */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Your Rights (GDPR & Applicable Laws)</h2>
            <p>Depending on your location, you have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten").</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of how we process your data.</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for direct marketing.</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time without affecting prior processing.</li>
            </ul>
            <p>
              To exercise any of these rights, email us at <strong>hello@greenhunt.net</strong>. We will respond within 30 days.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> Retained while your account is active and for up to 12 months after deletion.</li>
              <li><strong>Location data:</strong> Associated with item listings for as long as the listing is active. Not stored independently beyond the session.</li>
              <li><strong>Photos:</strong> Retained for as long as the associated item listing exists. Deleted when the listing is removed.</li>
              <li><strong>Transaction data:</strong> Retained for up to 7 years to comply with financial and tax regulations.</li>
              <li><strong>Analytics data:</strong> Anonymized and aggregated data may be retained indefinitely.</li>
            </ul>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Security Measures</h2>
            <p>We implement industry-standard security measures to protect your data, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Encryption of data in transit (TLS/SSL) and at rest</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls limiting data access to authorized personnel</li>
              <li>Secure cloud infrastructure with trusted providers</li>
            </ul>
            <p>
              While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We encourage you to use strong passwords and keep your device secure.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the App after changes constitutes acceptance of the updated policy. We will notify you of material changes via email or in-app notification.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Contact Us</h2>
            <p>If you have questions about this Privacy Policy, your data, or wish to exercise your rights, contact us at:</p>
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
