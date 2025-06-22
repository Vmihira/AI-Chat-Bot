"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
// Add this new import for emoji picker
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Upload, Send, User, Bot, Plus, Smile, Paperclip, Sparkles } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

interface Message {
  message_id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
}

interface Session {
  session_id: string
  session_name: string
  created_at: string
  message_count: number
}

export default function ChatInterface() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    if (sessionId) {
      fetchChatHistory()
      fetchSessions()
    }
  }, [sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch("http://localhost:8000/sessions")
      const data = await response.json()
      setSessions(data.sessions)
      const current = data.sessions.find((s: Session) => s.session_id === sessionId)
      setCurrentSession(current || null)
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
  }

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/retrieve-chats/${sessionId}`)
      const data = await response.json()

      // Ensure data.messages is always an array
      setMessages(Array.isArray(data.messages) ? data.messages : [])
    } catch (error) {
      console.error("Error fetching chat history:", error)
      setMessages([]) // Set to empty array in case of error
    }
  }
  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      message_id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          session_id: sessionId,
        }),
      })
      const data = await response.json()

      const aiMessage: Message = {
        message_id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("session_id", sessionId)

    try {
      const response = await fetch("http://localhost:8000/upload-document", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      // Add a system message about the upload
      const uploadMessage: Message = {
        message_id: Date.now().toString(),
        content: `Document "${file.name}" uploaded successfully!`,
        sender: "ai",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, uploadMessage])
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const switchSession = (newSessionId: string) => {
    router.push(`/chat/${newSessionId}`)
  }

  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👏",
    "🙌",
    "🤝",
    "🙏",
    "✍️",
    "💪",
    "🦾",
    "🦿",
    "🦵",
    "🦶",
    "👂",
    "🧠",
    "🫀",
    "🫁",
    "🦷",
    "🦴",
    "👀",
    "👁️",
    "👅",
    "👄",
    "💋",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🤎",
    "🖤",
    "🤍",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉️",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
  ]

  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <Sidebar className="border-r border-gray-200 bg-white min-w-[300px]">
          <SidebarHeader className="p-4 border-b border-gray-100">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl h-12 font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Previous Sessions
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.session_id}
                    onClick={() => switchSession(session.session_id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      session.session_id === sessionId
                        ? "bg-blue-50 border border-blue-200 text-blue-900"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <h3 className="font-medium text-sm truncate">{session.session_name}</h3>
                    <p className="text-gray-500 text-xs">{session.message_count} messages</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col mx-7">
          <header className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-gray-600" />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">ARIA Assistant</h1>
                  <p className="text-sm text-gray-500">Your friendly AI companion</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  variant="outline"
                  className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Doc"}
                </Button>
              </div>
            </div>
          </header>

          <ScrollArea className="flex-1 p-6">
            <div className="max-w-full mx-auto h-full">
              {messages.length === 0 ? (
                <div className="text-center py-16 h-full flex flex-col justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Hello! I'm ARIA 👋</h2>
                  <p className="text-gray-600 text-lg mb-8">
                    I'm here to chat, help with questions, analyze documents,
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.message_id}
                      className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-2xl ${
                          message.sender === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.sender === "user" ? "bg-gray-900" : "bg-gradient-to-r from-blue-500 to-purple-600"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.sender === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p
                            className={`text-xs mt-2 ${message.sender === "user" ? "text-gray-300" : "text-gray-500"}`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-2xl">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="pl-12 pt-3 bg-white border-t border-gray-200">
            <div className="max-w-full mx-auto">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type your message here... 💬"
                  className="w-full h-14 pl-4 pr-24 rounded-2xl border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" side="top">
                      <div className="grid grid-cols-10 gap-2 max-h-48 overflow-y-auto">
                        {emojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-3">
                Press Enter to send • Click 😊 for emojis • Click 📎 to attach files
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
