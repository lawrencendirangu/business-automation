import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getInboxApiBaseUrl,
  getInboxConversationDetails,
  getInboxConversations,
  getInboxNotifications,
  replyToInboxConversation,
  resumeInboxConversationAi,
  takeoverInboxConversation,
} from '../services/inboxApi'
import type {
  InboxConversation,
  InboxMessage,
  InboxNotificationSummary,
} from '../types/dashboard'

const POLL_INTERVAL_MS = 5000
const inboxApiBaseUrl = getInboxApiBaseUrl()

interface InboxDataResult {
  conversations: InboxConversation[]
  notifications: InboxNotificationSummary
  selectedConversationId: string | null
  selectedConversation: InboxConversation | null
  messages: InboxMessage[]
  isLoadingConversations: boolean
  isLoadingMessages: boolean
  isActionPending: boolean
  error: string | null
  setSelectedConversationId: (conversationId: string | null) => void
  sendReply: (message: string) => Promise<void>
  takeover: () => Promise<void>
  resumeAi: () => Promise<void>
}

const defaultNotifications: InboxNotificationSummary = {
  needsHumanCount: 0,
  unreadTotal: 0,
}

export function useInboxData(): InboxDataResult {
  const [conversations, setConversations] = useState<InboxConversation[]>([])
  const [notifications, setNotifications] = useState<InboxNotificationSummary>(defaultNotifications)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<InboxConversation | null>(null)
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isActionPending, setIsActionPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshConversations = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setIsLoadingConversations(true)
      }

      const [nextConversations, nextNotifications] = await Promise.all([
        getInboxConversations(),
        getInboxNotifications(),
      ])

      setConversations(nextConversations)
      setNotifications(nextNotifications)
      setError(null)

      setSelectedConversationId((current) => {
        if (!nextConversations.length) {
          return null
        }

        if (!current) {
          return nextConversations[0].id
        }

        const stillExists = nextConversations.some((conversation) => conversation.id === current)
        return stillExists ? current : nextConversations[0].id
      })
    } catch {
      setError(`Cannot reach inbox backend at ${inboxApiBaseUrl}. Showing last synced data.`)
    } finally {
      if (isInitialLoad) {
        setIsLoadingConversations(false)
      }
    }
  }, [])

  const refreshSelectedConversation = useCallback(async () => {
    if (!selectedConversationId) {
      setSelectedConversation(null)
      setMessages([])
      return
    }

    try {
      setIsLoadingMessages(true)
      const details = await getInboxConversationDetails(selectedConversationId)
      setSelectedConversation(details.conversation)
      setMessages(details.messages)
      setError(null)
    } catch {
      setError('Cannot refresh selected conversation. Showing last loaded messages.')
    } finally {
      setIsLoadingMessages(false)
    }
  }, [selectedConversationId])

  useEffect(() => {
    void refreshConversations(true)

    const intervalId = window.setInterval(() => {
      void refreshConversations(false)
    }, POLL_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [refreshConversations])

  useEffect(() => {
    void refreshSelectedConversation()

    const intervalId = window.setInterval(() => {
      void refreshSelectedConversation()
    }, POLL_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [refreshSelectedConversation])

  const runConversationAction = useCallback(
    async (action: (conversationId: string) => Promise<void>) => {
      if (!selectedConversationId) {
        return
      }

      try {
        setIsActionPending(true)
        await action(selectedConversationId)
        await Promise.all([refreshConversations(false), refreshSelectedConversation()])
        setError(null)
      } catch {
        setError('Action failed. Please check backend availability and try again.')
      } finally {
        setIsActionPending(false)
      }
    },
    [refreshConversations, refreshSelectedConversation, selectedConversationId],
  )

  const sendReply = useCallback(
    async (message: string) => {
      const trimmed = message.trim()
      if (!trimmed || !selectedConversationId) {
        return
      }

      await runConversationAction((conversationId) =>
        replyToInboxConversation(conversationId, trimmed),
      )
    },
    [runConversationAction, selectedConversationId],
  )

  const takeover = useCallback(async () => {
    await runConversationAction(takeoverInboxConversation)
  }, [runConversationAction])

  const resumeAi = useCallback(async () => {
    await runConversationAction(resumeInboxConversationAi)
  }, [runConversationAction])

  const selectedConversationFromList = useMemo(() => {
    if (!selectedConversationId) {
      return null
    }

    return (
      conversations.find((conversation) => conversation.id === selectedConversationId) || null
    )
  }, [conversations, selectedConversationId])

  return {
    conversations,
    notifications,
    selectedConversationId,
    selectedConversation: selectedConversation || selectedConversationFromList,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isActionPending,
    error,
    setSelectedConversationId,
    sendReply,
    takeover,
    resumeAi,
  }
}
