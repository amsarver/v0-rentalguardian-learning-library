'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { X, MessageCircle, Send, Bot, User, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FeedbackType = 'positive' | 'negative' | null

interface MessageFeedback {
  [messageId: string]: FeedbackType
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<MessageFeedback>({})
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
  
  const isLoading = status === 'streaming' || status === 'submitted'

  const handleFeedback = (messageId: string, type: FeedbackType) => {
    setFeedback((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type,
    }))
    // You can add an API call here to persist the feedback
    console.log(`Feedback for message ${messageId}: ${type}`)
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#3AAAE1] hover:bg-[#3AAAE1]/90 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-50"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-[#1D3E6E] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3AAAE1] rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Learning Assistant</h3>
                <p className="text-xs text-white/70">Ask about our presentations</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-3 text-[#3AAAE1]" />
                <p className="text-sm font-medium text-foreground">Welcome to the Learning Library!</p>
                <p className="text-xs mt-1">Ask me anything about the presentations.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 bg-[#3AAAE1] rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-[#1D3E6E] text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === 'text') {
                        return <span key={index} className="whitespace-pre-wrap">{part.text}</span>
                      }
                      return null
                    })}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-7 h-7 bg-[#F5A623] rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Feedback buttons for assistant messages */}
                {message.role === 'assistant' && (
                  <div className="flex gap-1 ml-9 mt-1">
                    <button
                      onClick={() => handleFeedback(message.id, 'positive')}
                      className={`p-1 rounded transition-colors ${
                        feedback[message.id] === 'positive'
                          ? 'text-green-600 bg-green-100'
                          : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'
                      }`}
                      aria-label="Helpful response"
                      title="Helpful"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'negative')}
                      className={`p-1 rounded transition-colors ${
                        feedback[message.id] === 'negative'
                          ? 'text-red-600 bg-red-100'
                          : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
                      }`}
                      aria-label="Not helpful response"
                      title="Not helpful"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-[#3AAAE1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!input.trim() || isLoading) return
              sendMessage({ text: input })
              setInput('')
            }}
            className="border-t border-border p-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAAE1] focus:border-transparent bg-background text-foreground"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#3AAAE1] hover:bg-[#3AAAE1]/90 text-white"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
