import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { mapMessagesToConversations, readStore, upsertMessages } from './storage.js'

dotenv.config()

const app = express()
const port = Number(process.env.API_PORT || 8787)
const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || ''

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'whatsapp-api' })
})

app.get('/api/whatsapp/conversations', async (req, res) => {
  const limit = Number(req.query.limit || 6)
  const store = await readStore()
  const conversations = mapMessagesToConversations(store.messages, limit)

  res.json({
    source: 'whatsapp',
    count: conversations.length,
    conversations,
  })
})

app.get('/api/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === verifyToken) {
    return res.status(200).send(challenge)
  }

  return res.sendStatus(403)
})

app.post('/api/whatsapp/webhook', async (req, res) => {
  const payload = req.body
  const incomingMessages = []

  if (payload?.object !== 'whatsapp_business_account') {
    return res.sendStatus(200)
  }

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'messages') {
        continue
      }

      const value = change.value ?? {}
      const contacts = value.contacts ?? []
      const messages = value.messages ?? []

      for (const message of messages) {
        const waId = message.from || 'unknown'
        const contact = contacts.find((item) => item.wa_id === waId)
        const contactName = contact?.profile?.name || waId

        let body = ''
        if (message.type === 'text') {
          body = message.text?.body || ''
        } else {
          body = `[${message.type || 'message'} message]`
        }

        incomingMessages.push({
          id: message.id,
          from: waId,
          name: contactName,
          body,
          timestamp: message.timestamp || Math.floor(Date.now() / 1000),
        })
      }
    }
  }

  await upsertMessages(incomingMessages)
  return res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`WhatsApp API server listening on http://localhost:${port}`)
})
