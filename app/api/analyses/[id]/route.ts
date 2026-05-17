import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Demo mode fallback
  if (id.startsWith('demo-') || id.startsWith('session-')) {
    return NextResponse.json(getMockAnalysis(id))
  }

  try {
    const { createClient } = await import('@/lib/supabase-server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(getMockAnalysis(id))
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(getMockAnalysis(id))
  }
}

function getMockAnalysis(id: string) {
  return {
    id,
    photo_url: '',
    created_at: new Date().toISOString(),
    score_global: 74,
    score_symetrie: 82,
    score_proportions: 76,
    score_structure: 71,
    score_peau: 68,
    score_grooming: 74,
    score_aura: 77,
    focus_dimensions: [],
    scores: { global: 74, symetrie: 82, proportions: 76, structure: 71, peau: 68, grooming: 74, aura: 77 },
    tier: 'attractive',
    percentile: 66,
    observations: {
      symetrie: 'Bonne symétrie faciale globale avec un léger décalage au niveau des yeux.',
      proportions: 'Les proportions dorées sont bien respectées.',
      structure: 'Mâchoire bien définie avec des pommettes modérément saillantes.',
      peau: 'Teint uniforme avec quelques imperfections légères.',
      grooming: 'Style personnel cohérent. Quelques améliorations possibles.',
      aura: 'Présence naturelle et regard expressif.',
    },
    routine: {
      skincare: ['Nettoyage doux matin et soir', 'Sérum vitamine C', 'SPF 50 quotidien', 'Rétinol le soir'],
      grooming: ['Contour de barbe précis', 'Soin des sourcils', 'Exfoliation 2x/semaine', 'Gua sha 10 min/soir'],
      fitness: ['Mewing constant', 'Chewing-gum dur', 'Gainage 3x/semaine', 'Cardio 30 min 4x/semaine'],
      style: ['Coupe adaptée', 'Couleurs neutres', 'Accessoires minimalistes', 'Posture'],
      aura: ['Méditation 10 min/jour', 'Contact visuel direct', 'Voix posée', 'Sourire contrôlé'],
    },
  }
}
