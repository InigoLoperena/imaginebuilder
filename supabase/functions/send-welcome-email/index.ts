import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
}

const BETA_URL = "https://greenhunt.vercel.app/";

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/greenhuntstoopingapp/",
  tiktok: "https://www.tiktok.com/@greenhuntstoopingapp",
  youtube: "https://www.youtube.com/@GreenHuntStoopingApp",
  twitter: "https://x.com/StoopingApp",
  linkedin: "https://www.linkedin.com/company/greenhunt",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: WelcomeEmailRequest = await req.json();
    
    console.log("Sending welcome email to:", email);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #000000; font-family: Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000000;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden;">
                
                <!-- Header with Logo -->
                <tr>
                  <td align="center" style="padding: 40px 40px 20px 40px; background-color: #000000;">
                    <img src="https://greenhunt.net/lovable-uploads/greenhunt-logo-new.svg" alt="GreenHunt Logo" width="200" style="max-width: 200px; height: auto; display: block;" />
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 30px 40px;">
                    <h1 style="color: #b4fa74; font-size: 28px; margin: 0 0 20px 0; text-align: center;">
                      Welcome to the GreenHunt!
                    </h1>
                    
                    <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      You're now part of a community that's transforming the linear economy apocalypse
                    </p>
                    
                    <p style="color: #97c26c; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      With GreenHunt, you can:
                    </p>
                    
                    <ul style="color: #ffffff; font-size: 14px; line-height: 1.8; margin: 0 0 30px 20px; padding: 0;">
                      <li style="margin-bottom: 8px;">🛋 Hunt abandoned furniture and treasures on the street</li>
                      <li style="margin-bottom: 8px;">🌍 Save the planet avoiding treasures from becoming waste</li>
                    </ul>
                    
                    <!-- CTA Button -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${BETA_URL}" style="display: inline-block; background-color: #a2c041; color: #611a5a; font-size: 18px; font-weight: bold; text-decoration: none; padding: 16px 40px; border-radius: 8px;">
                            ACCESS THE BETA NOW
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                      Start exploring and Hunting!
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #000000; padding: 30px 40px; border-top: 1px solid #333333;">
                    <!-- Social Links -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding-bottom: 20px;">
                          <a href="${SOCIAL_LINKS.instagram}" style="display: inline-block; margin: 0 8px; color: #97c26c; text-decoration: none; font-size: 14px;">Instagram</a>
                          <span style="color: #333333;">|</span>
                          <a href="${SOCIAL_LINKS.tiktok}" style="display: inline-block; margin: 0 8px; color: #97c26c; text-decoration: none; font-size: 14px;">TikTok</a>
                          <span style="color: #333333;">|</span>
                          <a href="${SOCIAL_LINKS.youtube}" style="display: inline-block; margin: 0 8px; color: #97c26c; text-decoration: none; font-size: 14px;">YouTube</a>
                          <span style="color: #333333;">|</span>
                          <a href="${SOCIAL_LINKS.twitter}" style="display: inline-block; margin: 0 8px; color: #97c26c; text-decoration: none; font-size: 14px;">X</a>
                          <span style="color: #333333;">|</span>
                          <a href="${SOCIAL_LINKS.linkedin}" style="display: inline-block; margin: 0 8px; color: #97c26c; text-decoration: none; font-size: 14px;">LinkedIn</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #666666; font-size: 12px; text-align: center; margin: 0;">
                      © 2026 GreenHunt. Making local circular economy easy, fun and profitable.
                    </p>
                    <p style="color: #666666; font-size: 12px; text-align: center; margin: 10px 0 0 0;">
                      Contact: hello@greenhunt.net
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
      from: "GreenHunt <hello@greenhunt.net>",
        to: [email],
        subject: "Welcome to the GreenHunt! 🌿",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
