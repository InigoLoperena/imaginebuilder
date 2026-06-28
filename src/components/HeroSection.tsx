import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import heroBanner from "@/assets/hero-banner.webp";
import heroMobile from "@/assets/hero-mobile.webp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";

const emailSchema = z.string().email();

interface HeroSectionProps {
  className?: string;
}

export const HeroSection = ({ className }: HeroSectionProps) => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(t('landing.beta.invalidEmail'));
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore - waitlist table exists
      const { error } = await supabase
        // @ts-ignore
        .from('waitlist')
        // @ts-ignore
        .insert([{ email: email.toLowerCase().trim() }]);
      if (error) {
        if (error.code === '23505') {
          toast.error(t('landing.beta.emailExists'));
        } else {
          toast.error(t('landing.beta.error'));
        }
      } else {
        toast.success(t('landing.beta.success'));
        setEmail("");
        setWaitlistOpen(false);
      }
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast.error(t('landing.beta.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className={`relative w-full overflow-hidden ${className || ''}`}>
        {/* Desktop background */}
        <img 
          src={heroBanner} 
          alt="GreenHunt - Stooping Real World Game" 
          className="hidden md:block w-full h-auto"
        />
        {/* Mobile background */}
        <img 
          src={heroMobile} 
          alt="GreenHunt - Stooping Real World Game" 
          className="block md:hidden w-full h-auto"
        />
      </section>
      {/* Waitlist Dialog */}
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-white/10">
          <DialogHeader>
            <DialogTitle className="font-permanent-marker text-2xl" style={{ color: '#b4fa74' }}>
              Get the Beta
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="font-sedgwick-ave bg-white/5 border-white/20 text-white placeholder:text-white/40" 
            />
            <Button type="submit" disabled={loading} className="w-full bg-[#a2c041] hover:bg-[#8da836] font-permanent-marker btn-purple-text text-lg">
              {loading ? 'Sending...' : 'GET BETA'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="sm:max-w-4xl p-0 bg-black border-white/10">
          <div className="aspect-video">
            <iframe 
              width="100%" height="100%" 
              src={trailerOpen ? "https://www.youtube.com/embed/RHj_lCvC9xw?autoplay=1" : ""} 
              title="GreenHunt Trailer" frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen className="rounded-lg" 
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
