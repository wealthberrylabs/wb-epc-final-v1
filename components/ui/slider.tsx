"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-8 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-[#22c55e] via-[#eab308] to-[#ef4444]">
      <SliderPrimitive.Range className="absolute h-full bg-transparent" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-12 w-20 rounded-full border-4 border-[#f9fafb] bg-[#f9fafb] shadow-lg transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    {/* Tick marks */}
    <div className="absolute bottom-full left-0 right-0 mb-2 flex justify-between px-1">
      {[18, 40, 60, 80, 100].map((tick) => (
        <div key={tick} className="h-1 w-0.5 bg-gray-300" />
      ))}
    </div>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

