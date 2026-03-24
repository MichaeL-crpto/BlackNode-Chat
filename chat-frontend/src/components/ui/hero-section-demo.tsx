import { HeroSection } from "@/components/ui/hero-section-dark"

function HeroSectionDemo() {
  return (
    <HeroSection
      title="Michael Security Services"
      subtitle={{
        regular: "Protect teams, sites, and operations with ",
        gradient: "reliable security coordination.",
      }}
      description="Monitor incidents, organize group communication, review settings, and track operations from one secure dashboard built for day-to-day response work."
      ctaText="Open Dashboard"
      ctaHref="#dashboard"
      bottomImage={{
        light:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
        dark:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
      }}
      gridOptions={{
        angle: 65,
        opacity: 0.35,
        cellSize: 50,
        lightLineColor: "#4a4a4a",
        darkLineColor: "#2a2a2a",
      }}
    />
  )
}

export { HeroSectionDemo }
