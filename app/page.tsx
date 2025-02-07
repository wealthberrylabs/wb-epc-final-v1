"use client"

import { useState, useMemo, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Info } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

const getLifeStage = (age: number) => {
  if (age < 30) return "Young Professional"
  if (age < 40) return "New Parent"
  if (age < 55) return "Mid-Career"
  if (age < 70) return "Pre-Retirement"
  return "Golden Years"
}

export default function Home() {
  const [age, setAge] = useState(30)
  const [interacted, setInteracted] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const { theme } = useTheme()

  const averageHourlyRate = 285
  const baseAttorneyHours = 15 // Minimum hours for basic estate

  const calculatedValues = useMemo(() => {
    const ageFactor = Math.pow(age / 30, 1.5)
    const attorneyHours = Math.round(Math.min(baseAttorneyHours * ageFactor, 40))
    const attorneyCost = attorneyHours * averageHourlyRate
    const intestateCost = attorneyCost * 2

    return { intestateCost, attorneyCost }
  }, [age])

  const lifeStage = useMemo(() => getLifeStage(age), [age])

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
    console.log("Downloading 2025 Planning Guide PDF")
  }

  const handleTooltipClick = (tooltipId: string) => {
    setActiveTooltip(tooltipId)
  }

  const closeTooltip = () => {
    setActiveTooltip(null)
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

  const TooltipContent = ({ id, title, content }: { id: string; title: string; content: string }) => (
    <AnimatePresence>
      {activeTooltip === id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeTooltip}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{content}</p>
            <button
              onClick={closeTooltip}
              className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <main
      className={`flex min-h-screen items-center justify-center bg-[#111827] dark:bg-[#f9fafb] p-4 font-segoe ${theme}`}
    >
      <Card
        className={`w-full max-w-[640px] rounded-3xl shadow-[0_20px_50px_rgba(17,_24,_39,_0.4)] bg-gradient-to-b from-[#1f2937] to-[#374151] dark:from-[#f9fafb] dark:to-[#e6f3ff] relative overflow-hidden transition-all duration-300 ease-in-out z-[1] ${
          animate ? "scale-[1.02]" : "scale-100"
        } ${isIdle ? "animate-wobble" : ""}`}
      >
        <div className="absolute top-2 left-4">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wb-logo-black-KyM3yfA9uFJ5qaBIXXSOMrTeJcWqBc.png"
            alt="WealthBerry"
            className="h-20 w-auto hidden dark:block"
            width="400"
            height="80"
          />
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wb-logo-white-np4PNx269d9wxZf3AhUf5DcZsPhoM3.png"
            alt="WealthBerry"
            className="h-20 w-auto dark:hidden block"
            width="400"
            height="80"
          />
        </div>
        <ThemeToggle />
        <CardContent className={`p-8 pt-24 ${activeTooltip ? "blur-sm" : ""}`}>
          <div className="sr-only">
            This calculator estimates the potential cost to your family if you don't have an estate plan, as well as the
            estimated attorney cost for intestate cases. Adjust your age using the slider to see how these costs change.
          </div>
          <h1 className="text-3xl text-[#f9fafb] dark:text-[#111827] mb-6 text-center">Estate Planning Calculator</h1>
          <div className="grid grid-cols-3 gap-6 mb-12 text-center">
            <div
              className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${animate ? "scale-[1.05]" : "scale-100"}`}
            >
              <div className="text-3xl font-bold text-[#f9fafb] dark:text-[#111827]">{age}</div>
              <div className="text-sm text-[#d1d5db] dark:text-[#6b7280] flex items-center justify-center">
                Your Age
                <button
                  onClick={() => handleTooltipClick("age")}
                  className="p-1 ml-1 rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Info className="w-4 h-4 text-[#d1d5db] dark:text-[#6b7280]" />
                </button>
              </div>
            </div>
            <div
              className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${animate ? "scale-[1.05]" : "scale-100"}`}
            >
              <div
                className="text-5xl font-bold mb-2 text-[#f9fafb] dark:text-[#111827]"
                aria-live="polite"
                aria-atomic="true"
              >
                ${calculatedValues.intestateCost.toLocaleString()}
              </div>
              <div className="text-sm text-[#d1d5db] dark:text-[#6b7280] flex items-center justify-center">
                Family Cost
                <button
                  onClick={() => handleTooltipClick("familyCost")}
                  className="p-1 ml-1 rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Info className="w-4 h-4 text-[#d1d5db] dark:text-[#6b7280]" />
                </button>
              </div>
              <div className="text-xs text-[#d1d5db] dark:text-[#6b7280]">Without planning</div>
              <div className="sr-only">
                Estimated family cost without estate planning: ${calculatedValues.intestateCost.toLocaleString()}
              </div>
            </div>
            <div
              className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${animate ? "scale-[1.05]" : "scale-100"}`}
            >
              <div className="text-3xl font-bold text-[#f9fafb] dark:text-[#111827]">
                ${calculatedValues.attorneyCost.toLocaleString()}
              </div>
              <div className="text-sm text-[#d1d5db] dark:text-[#6b7280] flex items-center justify-center">
                Attorney Cost
                <button
                  onClick={() => handleTooltipClick("attorneyCost")}
                  className="p-1 ml-1 rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Info className="w-4 h-4 text-[#d1d5db] dark:text-[#6b7280]" />
                </button>
              </div>
              <div className="text-xs text-[#d1d5db] dark:text-[#6b7280]">For Intestate Cases</div>
              <div className="sr-only">
                Estimated attorney cost for intestate cases: ${calculatedValues.attorneyCost.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mb-2">
            <Slider
              min={18}
              max={100}
              step={1}
              value={[age]}
              onValueChange={handleSliderChange}
              className="mb-1 [&>.bg-primary]:bg-gradient-to-r [&>.bg-primary]:from-[hsl(120,70%,45%)] [&>.bg-primary]:to-[hsl(0,70%,45%)]"
              aria-label="Adjust age for estate planning calculation"
            />
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
                className={`w-full bg-purple-600 hover:bg-purple-700 text-[#f9fafb] text-lg py-3 rounded-xl transition-all duration-300 ${
                  animate ? "scale-[1.05]" : "scale-100"
                }`}
              >
                Get Started
              </Button>
              <Button
                className={`w-full bg-blue-600 hover:bg-blue-700 text-[#f9fafb] text-lg py-3 rounded-xl transition-all duration-300 ${
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
      <TooltipContent
        id="age"
        title="Your Age"
        content="Starting estate planning early is crucial. By age 30, 55% of Americans don't have a will. Early planning: 1. Protects young families 2. Is less complex and costly 3. Provides peace of mind. Don't wait - secure your legacy today."
      />
      <TooltipContent
        id="familyCost"
        title="Family Cost"
        content="Family Cost is calculated as 2x the Attorney Cost for intestate cases. This accounts for potential legal fees, court costs, and other expenses that may arise when settling an estate without proper planning."
      />
      <TooltipContent
        id="attorneyCost"
        title="Attorney Cost"
        content="Attorney Cost is calculated based on an average hourly rate of $285 and estimated hours required. The hours increase with age, reflecting the growing complexity of estate planning needs over time. This is a general estimate and may vary based on individual circumstances."
      />
    </main>
  )
}

