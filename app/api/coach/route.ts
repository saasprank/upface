import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      systemPrompt: string
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 400,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    })

    return NextResponse.json({ reply: completion.choices[0].message.content })
  } catch (err) {
    console.error('Coach error:', err)
    return NextResponse.json({ error: 'Coach error' }, { status: 500 })
  }
}
