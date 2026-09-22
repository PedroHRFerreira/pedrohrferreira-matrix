import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404 / SINAL PERDIDO</p>
      <h1>Este caminho não existe no sistema.</h1>
      <Link href="/">Reiniciar experiência</Link>
    </main>
  )
}
