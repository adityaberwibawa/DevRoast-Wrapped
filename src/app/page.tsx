import { TopNav } from "@/components/landing/top-nav";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-canvas">
      <TopNav />
      <Hero />
      <Footer />
    </div>
  );
}
