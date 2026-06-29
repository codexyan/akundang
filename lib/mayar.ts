const MAYAR_API_URL = 'https://api.mayar.id/hl/v1'
const MAYAR_API_KEY = process.env.MAYAR_API_KEY!
const MAYAR_WEBHOOK_TOKEN = process.env.MAYAR_WEBHOOK_TOKEN!

export interface MayarPaymentRequest {
  name: string
  email: string
  amount: number
  mobile: string
  redirectUrl: string
  description: string
  expiredAt: string
}

export interface MayarPaymentResponse {
  id: string
  transactionId: string
  link: string
}

export async function createMayarPayment(
  req: MayarPaymentRequest
): Promise<MayarPaymentResponse> {
  const res = await fetch(`${MAYAR_API_URL}/payment/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MAYAR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Mayar API error: ${res.status} ${err}`)
  }

  const json = await res.json()
  return json.data as MayarPaymentResponse
}

export function verifyMayarWebhook(token: string): boolean {
  return token === MAYAR_WEBHOOK_TOKEN
}
