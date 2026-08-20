import { getSiteConfig } from "@/lib/data";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { MobileStickyCta } from "@/components/public/mobile-sticky-cta";

export const revalidate = 3600;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();

  return (
    <>
      <SiteHeader studioName={config.studioName} />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <SiteFooter config={config} />
      <MobileStickyCta config={config} />
    </>
  );
}
