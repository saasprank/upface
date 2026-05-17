'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function LandingMidSections() {
  const locale = useLocale()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <>
      {/* TESTIMONIALS */}
      <section className="px-4 py-16" style={{ background: '#080C14' }}>
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              background: 'rgba(59,130,246,0.1)',
              color: '#3B82F6',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
          >
            ⭐ ILS ONT TESTÉ UPFACE
          </div>
          <h2 className="text-2xl font-bold text-white">Ce qu&apos;ils en disent</h2>
        </div>
        <div className="space-y-4 max-w-lg mx-auto">
          {[
            {
              name: 'Thomas M.',
              age: '23 ans',
              score: '71 → 79',
              avatar: 'T',
              color: '#3B82F6',
              text: "J'étais sceptique au début mais les conseils skincare ont vraiment changé ma routine. Mon score a augmenté de 8 points en 6 semaines.",
              stars: 5,
            },
            {
              name: 'Lucas R.',
              age: '19 ans',
              score: '65 → 74',
              avatar: 'L',
              color: '#06B6D4',
              text: "La routine jawline + mewing combinée au grooming m'a transformé. Les gens autour de moi ont remarqué la différence.",
              stars: 5,
            },
            {
              name: 'Mathieu K.',
              age: '26 ans',
              score: '78 → 84',
              avatar: 'M',
              color: '#8B5CF6',
              text: "Upface m'a donné un plan clair et structuré. Le coach IA répond à toutes mes questions. Ça remplace un vrai coach à 10x le prix.",
              stars: 5,
            },
          ].map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.12)' }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{
                    background: `${t.color}30`,
                    border: `1px solid ${t.color}50`,
                    color: t.color,
                  }}
                >
                  {t.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
                    >
                      {t.score}/100
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: '#3D4F6E' }}>{t.age}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#8B9DC3' }}>
                &quot;{t.text}&quot;
              </p>
              <div className="flex gap-0.5 mt-2">
                {[...Array(t.stars)].map((_, si) => (
                  <span key={si} className="text-yellow-400 text-xs">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY UPFACE */}
      <section className="px-4 py-12" style={{ background: '#0D1321' }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Pourquoi Upface ?</h2>
          <p className="text-sm" style={{ color: '#8B9DC3' }}>
            Pas juste un score. Un vrai plan d&apos;action.
          </p>
        </div>
        <div className="space-y-3 max-w-lg mx-auto">
          {[
            {
              icon: '🎯',
              title: 'Analyse sur 47 critères',
              desc: 'Symétrie, proportions dorées, jawline, peau, grooming, aura — tout est mesuré.',
            },
            {
              icon: '🤖',
              title: 'Coach IA personnalisé',
              desc: 'Ton coach connaît ton score et ta routine. Il répond à tes questions 24h/24.',
            },
            {
              icon: '📈',
              title: 'Progression mesurable',
              desc: 'Suis ton score semaine après semaine. Vois les résultats concrets.',
            },
            {
              icon: '⚡',
              title: 'Résultats en 8 secondes',
              desc: "Pas d'attente. L'analyse est instantanée, la routine prête en moins d'une minute.",
            },
            {
              icon: '🔒',
              title: 'Données sécurisées',
              desc: 'Tes photos sont supprimées après 30 jours. Hébergement 100% Europe (RGPD).',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-2xl"
              style={{ background: '#080C14', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm mb-1">{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#8B9DC3' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF STATS */}
      <section className="px-4 py-10" style={{ background: '#080C14' }}>
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {[
            { value: '12 000+', label: 'Analyses réalisées', icon: '📊' },
            { value: '4.8/5', label: 'Note moyenne', icon: '⭐' },
            { value: '+9 pts', label: 'Progression moyenne', icon: '📈' },
            { value: '8 sec', label: "Temps d'analyse", icon: '⚡' },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 text-center"
              style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.12)' }}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#3D4F6E' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-12" style={{ background: '#0D1321' }}>
        <h2 className="text-2xl font-bold text-white text-center mb-8">Questions fréquentes</h2>
        <div className="space-y-3 max-w-lg mx-auto">
          {[
            {
              q: "Est-ce que l'analyse est vraiment gratuite ?",
              a: "Oui. L'analyse faciale complète est 100% gratuite. Tu reçois ton score global et 3 critères détaillés. La routine complète et le suivi sont disponibles en Pro.",
            },
            {
              q: 'Mes photos sont-elles sécurisées ?',
              a: 'Tes photos sont supprimées automatiquement après 30 jours. Nous ne les vendons jamais et elles sont hébergées en Europe (conformité RGPD totale).',
            },
            {
              q: 'En combien de temps vais-je voir des résultats ?',
              a: 'Les premiers résultats visibles apparaissent en 4 à 8 semaines selon la régularité. La plupart des utilisateurs gagnent entre 5 et 15 points en 2 mois.',
            },
            {
              q: 'Puis-je annuler mon abonnement ?',
              a: "Oui, à tout moment depuis ton profil. Aucun engagement, aucune pénalité. L'annulation prend effet à la fin de la période en cours.",
            },
            {
              q: 'Le coach IA est-il vraiment personnalisé ?',
              a: 'Oui. Le coach connaît ton score exact, tes points faibles et ta routine. Ses réponses sont générées par GPT-4o et adaptées à ton profil unique.',
            },
          ].map((item, i) => (
            <details
              key={i}
              className="rounded-2xl overflow-hidden group [&_summary::-webkit-details-marker]:hidden"
              style={{ background: '#080C14', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="text-sm font-semibold text-white pr-4">{item.q}</span>
                <span className="text-blue-400 flex-shrink-0 text-lg">+</span>
              </summary>
              <div className="px-4 pb-4">
                <p className="text-sm leading-relaxed" style={{ color: '#8B9DC3' }}>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-12 text-center" style={{ background: '#080C14' }}>
        <div
          className="rounded-2xl p-8 max-w-lg mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.1))',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: '#06B6D4' }}>COMMENCE MAINTENANT</p>
          <h2 className="text-2xl font-bold text-white mb-3">Découvre ton score en 8 secondes</h2>
          <p className="text-sm mb-6" style={{ color: '#8B9DC3' }}>
            Gratuit, sans engagement. 12 000+ analyses déjà réalisées.
          </p>
          <Link
            href={`${prefix}/analyze`}
            className="inline-block w-full py-4 rounded-2xl font-bold text-white text-base"
            style={{
              background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
              boxShadow: '0 0 30px rgba(59,130,246,0.4)',
            }}
          >
            📸 Analyser gratuitement
          </Link>
          <p className="text-xs mt-3" style={{ color: '#3D4F6E' }}>
            Annulable à tout moment · Paiement sécurisé Stripe · RGPD compliant
          </p>
        </div>
      </section>
    </>
  )
}
