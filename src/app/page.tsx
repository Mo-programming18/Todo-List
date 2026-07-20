import { getCurrentUser } from "@/lib/dal";
import { SiteHeader } from "@/components/marketing/landing/site-header";
import { Hero } from "@/components/marketing/landing/hero";
import { Features } from "@/components/marketing/landing/features";
import { Productivity } from "@/components/marketing/landing/productivity";
import { Workflow } from "@/components/marketing/landing/workflow";
import { Showcase } from "@/components/marketing/landing/showcase";
import { Testimonials } from "@/components/marketing/landing/testimonials";
import { Pricing } from "@/components/marketing/landing/pricing";
import { Faq } from "@/components/marketing/landing/faq";
import { FinalCta } from "@/components/marketing/landing/final-cta";
import { SiteFooter } from "@/components/marketing/landing/site-footer";

export default async function Home() {
  const user = await getCurrentUser();
  const authed = !!user;

  return (
    <div className="relative min-h-dvh bg-background">
      <SiteHeader authed={authed} />
      <main>
        <Hero authed={authed} />
        <Features />
        <Productivity />
        <Workflow />
        <Showcase />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta authed={authed} />
      </main>
      <SiteFooter />
    </div>
  );
}
