import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: {
    regular: string
    gradient: string
  }
  description?: string
  ctaText?: string
  ctaHref?: string
  bottomImage?: {
    light: string
    dark: string
  }
  gridOptions?: {
    angle?: number
    cellSize?: number
    opacity?: number
    lightLineColor?: string
    darkLineColor?: string
  }
}

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
}: NonNullable<HeroSectionProps["gridOptions"]>) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]",
        "opacity-[var(--opacity)]",
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid absolute inset-0 h-[300vh] w-[600vw] [margin-left:-200%] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  )
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title = "Build products for everyone",
      subtitle = {
        regular: "Designing your projects faster with ",
        gradient: "the largest figma UI kit.",
      },
      description = "Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.",
      ctaText = "Browse courses",
      ctaHref = "#",
      bottomImage = {
        light: "https://farmui.vercel.app/dashboard-light.png",
        dark: "https://farmui.vercel.app/dashboard.png",
      },
      gridOptions,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <div className="absolute top-0 z-0 h-screen w-screen bg-emerald-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(45,212,191,0.18),rgba(255,255,255,0))] dark:bg-emerald-950/10 dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(45,212,191,0.28),rgba(255,255,255,0))]" />
        <section className="relative z-10 mx-auto max-w-full">
          <RetroGrid {...gridOptions} />
          <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col justify-center gap-12 px-4 py-28 md:px-8">
            <div className="mx-auto max-w-3xl space-y-5 text-center leading-5">
              <h1 className="group mx-auto w-fit rounded-3xl border-[2px] border-white/10 bg-gradient-to-tr from-zinc-300/10 via-emerald-300/10 to-transparent px-5 py-2 font-geist text-sm text-gray-200">
                {title}
                <ChevronRight className="ml-2 inline h-4 w-4 duration-300 group-hover:translate-x-1" />
              </h1>
              <h2 className="mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.55)_100%)] bg-clip-text text-4xl font-geist tracking-tighter text-transparent md:text-6xl">
                {subtitle.regular}
                <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-200 bg-clip-text text-transparent">
                  {subtitle.gradient}
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-gray-300">
                {description}
              </p>
              <div className="flex items-center justify-center">
                <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#D1FAE5_0%,#0F766E_50%,#D1FAE5_100%)]" />
                  <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-xs font-medium backdrop-blur-3xl">
                    <a
                      href={ctaHref}
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-gradient-to-tr from-zinc-300/10 via-emerald-400/20 to-transparent px-10 py-4 text-center text-white transition-all hover:from-zinc-300/20 hover:via-emerald-400/30 sm:w-auto"
                    >
                      {ctaText}
                    </a>
                  </span>
                </span>
              </div>
            </div>
            {bottomImage && (
              <div className="relative z-10 mt-16 mx-2 md:mx-10">
                <img
                  src={bottomImage.light}
                  className="w-full rounded-3xl border border-gray-200 shadow-lg dark:hidden"
                  alt="Dashboard preview"
                />
                <img
                  src={bottomImage.dark}
                  className="hidden w-full rounded-3xl border border-gray-800 shadow-2xl dark:block"
                  alt="Dashboard preview"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    )
  },
)

HeroSection.displayName = "HeroSection"

export { HeroSection }
