import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import Retell from 'retell-sdk'

// Solvr Labs — Retell call-ended notification webhook (v0)
//
// Purpose: when Ana finishes a call, email Jessy so he can pull the transcript
// from the Retell dashboard manually. No DB, no Claude — this is the minimum
// viable feedback loop while we test the agent in production.
//
// Endpoint: POST https://www.solvrlabs.com/api/retell-webhook
// Configured via scripts/retell-setup.mjs in the solvr-platform repo.

const RETELL_DASHBOARD_CALL_URL = (callId: string) =>
  `https://dashboard.retellai.com/dashboard/calls/${callId}`

// ----- HMAC verification ------------------------------------------------
//
// Retell signs each webhook body with the API key itself — there is no
// separate webhook secret. Use the official SDK's `Retell.verify` rather
// than hand-rolling the HMAC, because the exact scheme (header format,
// encoding, prefix) is not always documented and changes between SDK
// versions. In v5.x this is async; do not omit `await` or the call returns
// a Promise (truthy) and silently fails-open.
async function verifyRetellSignature(
  rawBody: string,
  signature: string | null,
  apiKey: string,
): Promise<boolean> {
  if (!signature) return false
  try {
    return await Retell.verify(rawBody, apiKey, signature)
  } catch (err) {
    console.error('[retell-webhook] signature verification threw', err)
    return false
  }
}

// ----- formatting helpers -----------------------------------------------

function formatDuration(ms: number | undefined): string {
  if (!ms || ms <= 0) return '0s'
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

// Phoenix doesn't observe DST, so MST is stable year-round — but using
// Intl with the IANA zone is still the right call.
function formatPhoenixTime(unixMs: number | undefined): string {
  const date = unixMs ? new Date(unixMs) : new Date()
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Phoenix',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

// ----- payload types (minimal, only what we read) -----------------------

interface RetellCall {
  call_id: string
  call_type?: 'web_call' | 'phone_call'
  from_number?: string
  to_number?: string
  start_timestamp?: number
  end_timestamp?: number
  duration_ms?: number
}

interface RetellWebhookPayload {
  event: 'call_started' | 'call_ended' | 'call_analyzed'
  call: RetellCall
}

// ----- handler ----------------------------------------------------------

// Disable Vercel's automatic body parsing so we can read the exact bytes
// that Retell signed. Without this, JSON.parse-then-stringify would re-order
// keys and break HMAC verification. Also cap execution at 5s — Retell
// retries on slow responses, and Resend is normally sub-second.
export const config = {
  api: { bodyParser: false },
  maxDuration: 5,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey) {
    console.error('[retell-webhook] RETELL_API_KEY not set')
    return res.status(500).json({ error: 'misconfigured' })
  }

  // bodyParser is disabled (see config above), so req is a raw readable
  // stream. Drain it before verifying the HMAC.
  const rawBody = await readRawBody(req)

  const signature = (req.headers['x-retell-signature'] as string | undefined) ?? null
  if (!(await verifyRetellSignature(rawBody, signature, apiKey))) {
    return res.status(401).json({ error: 'invalid_signature' })
  }

  let payload: RetellWebhookPayload
  try {
    payload = JSON.parse(rawBody) as RetellWebhookPayload
  } catch {
    return res.status(400).json({ error: 'invalid_json' })
  }

  if (payload.event !== 'call_ended') {
    return res.status(200).json({ ok: true, ignored: payload.event })
  }

  const call = payload.call
  if (!call?.call_id) {
    return res.status(400).json({ error: 'missing_call_id' })
  }

  await notifyNewCall(call)

  return res.status(200).json({ ok: true, notified: true, call_id: call.call_id })
}

// ----- raw-body reader --------------------------------------------------
// Used when Vercel's body parser is disabled (see export config below).
async function readRawBody(req: VercelRequest): Promise<string> {
  const chunks: Uint8Array[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? new Uint8Array(Buffer.from(chunk)) : new Uint8Array(chunk))
  }
  return Buffer.concat(chunks).toString('utf8')
}

// ----- notifier ---------------------------------------------------------

async function notifyNewCall(call: RetellCall): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const to = process.env.ADMIN_EMAIL

  if (!apiKey || !from || !to) {
    console.error('[notify-new-call] missing env: RESEND_API_KEY / RESEND_FROM_EMAIL / ADMIN_EMAIL')
    return
  }

  const caller = call.from_number?.trim() || 'unknown caller'
  const durationLabel = formatDuration(call.duration_ms)
  const whenLabel = formatPhoenixTime(call.end_timestamp ?? call.start_timestamp)
  const dashboardUrl = RETELL_DASHBOARD_CALL_URL(call.call_id)

  const lines = [
    `From: ${caller}`,
    `Duration: ${durationLabel}`,
    `When: ${whenLabel} (Phoenix)`,
    `Call ID: ${call.call_id}`,
    ``,
    `Open in Retell: ${dashboardUrl}`,
  ]

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `[Solvr] New call from ${caller} (${durationLabel})`,
    text: lines.join('\n'),
  })

  if (error) {
    console.error('[notify-new-call] resend send failed', error)
  }
}
