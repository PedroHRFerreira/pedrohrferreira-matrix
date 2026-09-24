'use client'

import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

export function useTypedLines(
  lines: readonly string[],
  active: boolean,
  characterDelay: number,
  reducedMotion: boolean,
  onComplete: () => void
) {
  const [visibleLines, setVisibleLines] = useState<readonly string[]>([])

  useEffect(() => {
    let cancelled = false
    let timer = 0
    const resetTimer = window.setTimeout(() => setVisibleLines([]), 0)

    if (!active) return () => window.clearTimeout(resetTimer)

    if (reducedMotion) {
      timer = window.setTimeout(() => {
        if (cancelled) return
        setVisibleLines(lines)
        onComplete()
      }, 1400)
      return () => {
        cancelled = true
        window.clearTimeout(resetTimer)
        window.clearTimeout(timer)
      }
    }

    let lineIndex = 0
    let characterIndex = 0

    const typeNextCharacter = () => {
      if (cancelled) return
      const line = lines[lineIndex]
      if (line === undefined) {
        onComplete()
        return
      }

      const currentLineIndex = lineIndex
      const nextCharacterIndex = characterIndex + 1
      characterIndex = nextCharacterIndex
      setVisibleLines((current) => {
        const next = [...current]
        next[currentLineIndex] = line.slice(0, nextCharacterIndex)
        return next
      })

      if (nextCharacterIndex >= line.length) {
        lineIndex += 1
        characterIndex = 0
        timer = window.setTimeout(typeNextCharacter, 260)
        return
      }

      const character = line[nextCharacterIndex - 1] ?? ''
      const punctuationPause = /[.,:]/.test(character) ? 120 : 0
      const variation = (character.charCodeAt(0) % 5) * 7
      timer = window.setTimeout(typeNextCharacter, characterDelay + variation + punctuationPause)
    }

    timer = window.setTimeout(typeNextCharacter, 420)
    return () => {
      cancelled = true
      window.clearTimeout(resetTimer)
      window.clearTimeout(timer)
    }
  }, [active, characterDelay, lines, onComplete, reducedMotion])

  return visibleLines
}
