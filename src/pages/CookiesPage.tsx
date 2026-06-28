import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
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
          <h1 className="text-4xl font-impact text-rebel mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: March 26, 2026</p>
        </div>
        
        <div className="prose prose-lg max-w-none space-y-8">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and understand how you use the site. This Cookie Policy explains how GREENRIOT SL, CORP ("Greenriot," "we") uses cookies on <a href="https://greenhunt.net" className="text-rebel underline">greenhunt.net</a>.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Types of Cookies We Use</h2>

            <h3 className="text-xl font-impact text-rebel mb-3">Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas. The website cannot function without these cookies.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Session management</li>
              <li>Authentication tokens</li>
              <li>Security features (CSRF protection)</li>
            </ul>

            <h3 className="text-xl font-impact text-rebel mb-3">Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors use our website by collecting anonymized data. This allows us to improve the site's performance and user experience.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Pages visited and time spent</li>
              <li>Traffic sources</li>
              <li>Device and browser information</li>
            </ul>

            <h3 className="text-xl font-impact text-rebel mb-3">Functional Cookies</h3>
            <p>
              These cookies remember your preferences (such as language selection) to provide a personalized experience.
            </p>

            <h3 className="text-xl font-impact text-rebel mb-3">Third-Party Cookies</h3>
            <p>
              Some cookies are placed by third-party services we use:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>Analytics providers:</strong> For anonymized usage data</li>
            </ul>
          </section>

          {/* Cookie Duration */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Cookie Duration</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Session cookies:</strong> Deleted when you close your browser.</li>
              <li><strong>Persistent cookies:</strong> Remain on your device for a set period (days to months) or until you delete them manually.</li>
            </ul>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">How to Manage Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>View what cookies are stored</li>
              <li>Delete individual or all cookies</li>
              <li>Block cookies from specific or all sites</li>
              <li>Set preferences for cookie acceptance</li>
            </ul>
            <p>Browser-specific instructions:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
            </ul>
            <p className="italic text-muted-foreground">
              Note: Disabling essential cookies may prevent certain website features from functioning properly.
            </p>
          </section>

          {/* Mobile App */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Cookies in Our Mobile App</h2>
            <p>
              Our mobile application does not use traditional browser cookies. However, the App may use similar technologies (such as local storage and device identifiers) to provide core functionality and improve your experience. The use of such technologies is covered in our <Link to="/privacy" className="text-rebel underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy to reflect changes in technology, legislation, or our practices. Please check this page periodically. Continued use of the website after changes constitutes acceptance.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-impact text-rebel mb-4">Contact</h2>
            <p>If you have questions about our use of cookies, contact us at:</p>
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
