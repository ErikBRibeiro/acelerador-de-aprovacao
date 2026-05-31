import Link from 'next/link'

const features: [string, string, string][] = [
  ['📖', 'Glossário inteligente', 'Busca e filtros por categoria, frequência e tipo linguístico.'],
  ['🔊', 'Áudio neural', 'Pronúncia gerada por voz neural direto no navegador.'],
  ['📈', 'Acompanhamento', 'Estrelas de fixação, progresso e cronograma de estudo.'],
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="h-7 w-2 rounded bg-navy" />
          <span className="font-extrabold text-navy">ELITE</span>
          <span className="text-gray-500">Accelerator</span>
        </div>
        <Link
          href="/select"
          className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-950"
        >
          Get Started
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-navy border border-blue-200">
          Preparação de intérpretes · Inglês ⇄ Português
        </span>
        <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-navy">
          Acelerador de Aprovação
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          A plataforma que prepara intérpretes para processos seletivos — vocabulário técnico,
          pronúncia, aplicação real e memorização, tudo em um só lugar.
        </p>
        <Link
          href="/select"
          className="mt-10 inline-block rounded-lg bg-navy px-8 py-3 text-base font-bold text-white shadow-card hover:bg-navy-950"
        >
          Acessar área de estudos →
        </Link>
      </section>

      <section className="mx-auto max-w-4xl grid grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">
        {features.map(([icon, title, desc]) => (
          <div
            key={title}
            className="rounded-xl bg-white p-6 shadow-card border-t-[3px] border-navy"
          >
            <div className="text-2xl">{icon}</div>
            <h3 className="mt-2 font-bold text-navy">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
