import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase-server'
import { getSubscription } from '@/lib/subscription'
import { isSupabaseConfigured } from '@/lib/supabase-config'
import { isAuthUiHidden } from '@/lib/auth-ui'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const IMPROVE_LABELS: Record<string, string> = {
  jaw: 'Mâchoire & menton (définition, jawline)',
  eyes: 'Zone des yeux (regard, cernes, sourcils)',
  cheeks: 'Pommettes (saillance, définition zygomatique)',
  skin: 'Qualité de peau (teint, texture, éclat)',
  full: 'Optimisation complète (tout améliorer)',
}

const DREAM_LABELS: Record<string, string> = {
  unstoppable: 'Inarrêtable — confiance totale, sans limite',
  confident: 'Confiant en toute situation',
  proud: 'Fier de mon reflet — enfin satisfait',
  myself: 'Enfin moi-même — mon visage reflète qui je suis',
  same: 'Juste quelques améliorations légères',
}

const TIME_LABELS: Record<string, string> = {
  '5-10': '5 à 10 minutes par jour (routine express)',
  '10-15': '10 à 15 minutes par jour (équilibre efficacité/temps)',
  '15-20': '15 à 20 minutes par jour (résultats visibles en 4 semaines)',
  '20-30': '20 à 30 minutes par jour (transformation maximale)',
}

export async function POST(req: NextRequest) {
  try {
    const enforcePaid = isSupabaseConfigured() && !isAuthUiHidden()

    if (enforcePaid) {
      const supabase = await createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const sub = await getSubscription(userId)
      if (!sub.isActive) {
        return NextResponse.json({ error: 'Subscription required' }, { status: 403 })
      }
    }

    const { improve, dream, time, scores, observations } = await req.json() as {
      improve: string[]
      dream: string
      time: string
      scores: Record<string, number> | null
      observations?: {
        symetrie?: string
        proportions?: string
        structure?: string
        peau?: string
        grooming?: string
        aura?: string
      } | null
    }

    const improveText = improve
      .map((id) => IMPROVE_LABELS[id] ?? id)
      .join(', ')

    const dreamText = DREAM_LABELS[dream] ?? dream
    const timeText = TIME_LABELS[time] ?? time

    const scoresText = scores
      ? `Scores de l'analyse faciale :
- Symétrie : ${scores.symetrie}/100
- Proportions : ${scores.proportions}/100
- Structure : ${scores.structure}/100
- Peau : ${scores.peau}/100
- Grooming : ${scores.grooming}/100
- Aura : ${scores.aura}/100
- Score global : ${scores.global}/100
- Potentiel estimé : ${scores.potentiel ?? Math.min(95, (scores.global ?? 70) + 14)}/100`
      : 'Scores non disponibles.'

    const prompt = `Tu es un expert en looksmaxxing, skincare, fitness facial et développement personnel.

Un utilisateur vient de terminer son analyse faciale Upface. Voici son profil COMPLET :

${scoresText}

Observations détaillées de l'analyse IA sur ce visage spécifique :
${observations ? `
- Symétrie : ${observations.symetrie ?? 'non disponible'}
- Proportions : ${observations.proportions ?? 'non disponible'}
- Structure : ${observations.structure ?? 'non disponible'}
- Peau : ${observations.peau ?? 'non disponible'}
- Grooming : ${observations.grooming ?? 'non disponible'}
- Aura : ${observations.aura ?? 'non disponible'}
` : 'Non disponibles'}

Zones prioritaires choisies par l'utilisateur : ${improveText}
Objectif / ressenti visé : ${dreamText}
Temps disponible par jour : ${timeText}

RÈGLES OBLIGATOIRES :
- Chaque tâche doit être CONCRÈTE et SPÉCIFIQUE à ce profil (pas générique)
- Insiste sur les dimensions avec les scores les plus bas
- Le headline doit mentionner le score potentiel atteignable
- Les tâches style et aura doivent rester verrouillées (unlocked: false)
- Adapte la quantité de tâches au temps disponible par jour

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, sans backticks, sans markdown. Format exact :
{
  "headline": "string",
  "categories": [
    { "id": "skincare", "category": "Skincare", "icon": "✦", "color": "#3B82F6", "day": "Jour 1–7", "title": "string", "tasks": ["string", "string", "string"], "unlocked": true },
    { "id": "grooming", "category": "Grooming", "icon": "✂", "color": "#06B6D4", "day": "Jour 1–7", "title": "string", "tasks": ["string", "string", "string"], "unlocked": true },
    { "id": "fitness", "category": "Fitness", "icon": "◈", "color": "#10B981", "day": "Jour 8–14", "title": "string", "tasks": ["string", "string", "string"], "unlocked": true },
    { "id": "style", "category": "Style", "icon": "◇", "color": "#8B5CF6", "day": "Jour 8–21", "title": "string", "tasks": ["string", "string", "string"], "unlocked": false },
    { "id": "aura", "category": "Aura", "icon": "⬡", "color": "#F59E0B", "day": "Jour 14–30", "title": "string", "tasks": ["string", "string", "string"], "unlocked": false }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1200,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = completion.choices[0].message.content ?? ''
    const parsed = JSON.parse(raw) as unknown

    return NextResponse.json({ routine: parsed })
  } catch (err) {
    console.error('generate-routine error:', err)
    return NextResponse.json({ error: 'Génération échouée' }, { status: 500 })
  }
}
