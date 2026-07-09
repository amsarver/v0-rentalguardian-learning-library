'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QAItem {
  question: string
  answer: string
}

interface QASectionProps {
  refreshTrigger?: number
}

export function QASection({ refreshTrigger }: QASectionProps) {
  const [questions, setQuestions] = useState<QAItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/presentations/generate-qa')
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions || [])
      } else {
        setError('Failed to load Q&A')
      }
    } catch {
      setError('Failed to load Q&A')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [refreshTrigger])

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F5A623]/10 rounded-lg flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-[#F5A623]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#1D3E6E]">Frequently Asked Questions</h2>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 text-[#3AAAE1] animate-spin" />
            <p className="text-muted-foreground">Analyzing presentations...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error || questions.length === 0) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5A623]/10 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-[#F5A623]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1D3E6E]">Frequently Asked Questions</h2>
            </div>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Upload presentations to generate FAQ content</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F5A623]/10 rounded-lg flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-[#F5A623]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#1D3E6E]">Frequently Asked Questions</h2>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchQuestions}
          className="text-[#3AAAE1] border-[#3AAAE1] hover:bg-[#3AAAE1]/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {questions.map((item, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleExpand(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-[#1D3E6E] pr-4">{item.question}</span>
              {expandedIndex === index ? (
                <ChevronUp className="h-5 w-5 text-[#3AAAE1] flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#3AAAE1] flex-shrink-0" />
              )}
            </button>
            {expandedIndex === index && (
              <div className="px-4 pb-4 pt-0 bg-gray-50 border-t border-border">
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
