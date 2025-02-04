"use client"

import { useState, useMemo, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"
import { useTheme } from "next-themes"

const getLifeStage = (age: number) => {
  if (age < 30) return "Young Professional"
  if (age < 40) return "New Parent"
  if (age < 60) return "Mid-Career"
  return "Retirement"
}

const getColorForCost = (cost: number) => {
  const maxCost = 10000 // Adjust this value based on your expected maximum cost
  const percentage = Math.min(cost / maxCost, 1)
  const hue = ((1 - percentage) * 60).toFixed(0) // This will give a hue from 60 (yellow-green) to 0 (red)
  return `hsl(${hue}, 70%, 45%)`
}

export default function Home() {
  const [age, setAge] = useState(30)
  const [interacted, setInteracted] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const { theme } = useTheme()

  const averageHourlyRate = 285
  const baseAttorneyHours = 5

  const calculatedValues = useMemo(() => {
    const ageFactor = age / 30
    const attorneyHours = Math.round(baseAttorneyHours * ageFactor)
    const estimatedCost = attorneyHours * averageHourlyRate
    const intestateCost = estimatedCost * 2

    return { intestateCost, attorneyHours, estimatedCost }
  }, [age])

  const lifeStage = useMemo(() => getLifeStage(age), [age])
  const familyCostColor = useMemo(
    () => getColorForCost(calculatedValues.intestateCost),
    [calculatedValues.intestateCost],
  )

  const handleSliderChange = (value: number[]) => {
    setAge(value[0])
    setInteracted(true)
    if (!hasInteracted) {
      setAnimate(true)
      setHasInteracted(true)
    }
    setIsIdle(false)
  }

  const handleReset = () => {
    setAge(30)
    setInteracted(false)
    setHasInteracted(false)
    setIsIdle(false)
  }

  const handleDownloadPDF = () => {
    // Implement PDF download logic here
    console.log("Downloading 2025 Planning Guide PDF")
  }

  useEffect(() => {
    let idleTimer: NodeJS.Timeout
    let wobbleInterval: NodeJS.Timeout

    const resetTimers = () => {
      setIsIdle(false)
      clearTimeout(idleTimer)
      clearInterval(wobbleInterval)

      idleTimer = setTimeout(() => {
        setIsIdle(true)
        wobbleInterval = setInterval(() => {
          setIsIdle(false)
          setTimeout(() => setIsIdle(true), 300)
        }, 30000)
      }, 10000)
    }

    resetTimers()

    window.addEventListener("mousemove", resetTimers)
    window.addEventListener("keydown", resetTimers)

    return () => {
      clearTimeout(idleTimer)
      clearInterval(wobbleInterval)
      window.removeEventListener("mousemove", resetTimers)
      window.removeEventListener("keydown", resetTimers)
    }
  }, [])

  return (
    <main
      className={`flex min-h-screen items-center justify-center bg-[#111827] dark:bg-[#f9fafb] p-4 font-inter ${theme}`}
    >
      <Card
        className={`w-full max-w-[640px] rounded-3xl shadow-[0_20px_50px_rgba(17,_24,_39,_0.4)] bg-gradient-to-b from-[#1f2937] to-[#374151] dark:from-[#f9fafb] dark:to-[#e6f3ff] border border-gray-700 dark:border-gray-200 relative overflow-hidden transition-all duration-300 ease-in-out ${
          animate ? "scale-[1.02]" : "scale-100"
        } ${isIdle ? "animate-wobble" : ""}`}
      >
        <div className="absolute top-6 left-6">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wb-logo-black-Sb9Pe0tYRpaVmS9FkhmV0FNDxu75ts.png"
            alt="WealthBerry"
            className="h-8 w-auto dark:invert"
            width="160"
            height="32"
            style={{
              maxWidth: "160px",
              objectFit: "contain",
              objectPosition: "left",
            }}
          />
        </div>
        <ThemeToggle />
        <CardContent className="p-8 pt-20">
          <h1 className="text-3xl font-bold text-[#f9fafb] dark:text-[#111827] mb-8 text-center">
            Estate Planning Calculator
          </h1>

          <div className="grid grid-cols-3 gap-6 mb-8 text-center">
            <div className={`transition-all duration-300 ease-in-out ${animate ? "scale-[1.05]" : "scale-100"}`}>
              <div className="text-3xl font-bold text-[#f9fafb] dark:text-[#111827]">{age}</div>
              <div className="text-sm text-[#d1d5db] dark:text-[#6b7280]">
                Your Age
                <div className="text-xs">${calculatedValues.estimatedCost.toLocaleString()} est. cost</div>
              </div>
            </div>
            <div className={`transition-all duration-300 ease-in-out ${animate ? "scale-[1.05]" : "scale-100"}`}>
              <div className="text-5xl font-bold mb-2" style={{ color: familyCostColor }}>
                ${calculatedValues.intestateCost.toLocaleString()}
              </div>
              <div className="text-sm text-[#d1d5db] dark:text-[#6b7280]">
                Family Cost
                <div className="text-xs">Without planning</div>
              </div>
            </div>
            <div className={`transition-all duration-300 ease-in-out ${animate ? "scale-[1.05]" : "scale-100"}`}>
              <div className="text-3xl font-bold text-[#f9fafb] dark:text-[#111827]">
                {calculatedValues.attorneyHours}
              </div>
              <div className="text-sm text-[#d1d5db] dark:text-[#6b7280]">
                Attorney Hours
                <div className="text-xs">${averageHourlyRate}/hr</div>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <Slider min={18} max={100} step={1} value={[age]} onValueChange={handleSliderChange} className="mb-1" />
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-200 dark:text-gray-500 dark:hover:text-gray-700"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-xl font-semibold text-[#f9fafb] dark:text-[#111827] mb-2">Life Stage: {lifeStage}</div>
            <div className="text-sm text-[#d1d5db] dark:text-[#6b7280]">
              Adjust your age to see how estate planning needs evolve
            </div>
          </div>

          {interacted && (
            <div className="grid grid-cols-2 gap-6">
              <Button
                className={`w-full bg-purple-600 hover:bg-purple-700 text-[#f9fafb] text-lg py-3 rounded-md transition-all duration-300 ${
                  animate ? "scale-[1.05]" : "scale-100"
                }`}
              >
                Take Action Now
              </Button>
              <Button
                className={`w-full bg-blue-600 hover:bg-blue-700 text-[#f9fafb] text-lg py-3 rounded-md transition-all duration-300 ${
                  animate ? "scale-[1.05]" : "scale-100"
                }`}
                onClick={handleDownloadPDF}
              >
                <Download className="w-5 h-5 mr-2" />
                Download 2025 Guide
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

