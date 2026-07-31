// src/hooks/useDebounce.js
// Retarde la mise à jour d'une valeur de "delay" millisecondes après la dernière frappe.
// Utile pour la recherche : on ne veut PAS interroger le backend à chaque lettre tapée,
// mais seulement une fois que l'utilisateur a fini de taper (ex: 400ms de pause).

import { useState, useEffect } from 'react'

export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // À chaque nouvelle frappe, on programme une mise à jour dans "delay" ms...
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    // ...mais si l'utilisateur retape avant la fin du délai, on annule le
    // timer précédent (cleanup de useEffect) et on repart de zéro.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}