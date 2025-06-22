"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, MessageCircle, Sparkles, Bot } from "lucide-react"
import { useRouter } from "next/navigation"

interface Session {
  session_id: string
  session_name: string
  created_at: string
  message_count: number
}

export default function LandingPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [newSessionName, setNewSessionName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch("http://localhost:8000/sessions")
      const data = await response.json()
      setSessions(data.sessions)
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
  }

  const createNewSession = async () => {
    if (!newSessionName.trim()) return

    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_name: newSessionName }),
      })
      const data = await response.json()
      setIsCreateDialogOpen(false)
      setNewSessionName("")
      router.push(`/chat/${data.session_id}`)
    } catch (error) {
      console.error("Error creating session:", error)
    } finally {
      setLoading(false)
    }
  }

  const openSession = (sessionId: string) => {
    router.push(`/chat/${sessionId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-blue-600">ARIA Assistant</h1>
                <p className="text-sm text-gray-600">Your friendly AI companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-4xl w-full">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hello! I'm ARIA 👋</h2>

            <p className="text-lg text-gray-600 mb-8">
              I'm here to chat, help with questions, analyze documents, and assist you with various tasks.
            </p>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Create New Session Card */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Plus className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Start New Chat</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Create a new chat session to upload documents and start conversations
                </p>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg">
                      Create New Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-gray-200">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900">Create New Chat Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="session-name" className="text-gray-700 pb-5">
                          Session Name
                        </Label>
                        <Input
                          id="session-name"
                          value={newSessionName}
                          onChange={(e) => setNewSessionName(e.target.value)}
                          placeholder="Enter session name..."
                          className="bg-gray-50 border-gray-200 text-gray-900"
                        />
                      </div>
                      <Button
                        onClick={createNewSession}
                        disabled={loading || !newSessionName.trim()}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {loading ? "Creating..." : "Create Session"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Previous Sessions Card */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Previous Sessions</h3>
                </div>
                <p className="text-gray-600 mb-4">Continue your previous conversations</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sessions.length === 0 ? (
                    <p className="text-gray-400 text-center py-4 text-sm">No previous sessions</p>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.session_id}
                        onClick={() => openSession(session.session_id)}
                        className="p-3 rounded-lg bg-white/60 hover:bg-white/80 cursor-pointer transition-all duration-200 border border-gray-100 hover:border-blue-200 hover:shadow-sm"
                      >
                        <h4 className="text-gray-900 font-medium text-sm truncate">{session.session_name}</h4>
                        <p className="text-gray-500 text-xs">{session.message_count} messages</p>
                        <p className="text-gray-400 text-xs">{new Date(session.created_at).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
