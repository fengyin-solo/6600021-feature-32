import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { BRAILLE_MAP, textToBraille, brailleToText, dotsToUnicode } from '../utils/braille'
import type { LearnMode } from '../types'

export const useBrailleStore = defineStore('braille', () => {
  const inputText = ref('')
  const brailleOutput = ref<number[][]>([])
  const learnMode = ref<LearnMode>('charToBraille')
  const quizChar = ref('')
  const selectedDots = ref<number[]>([])
  const selectionOrder = ref<number[]>([])
  const orderMode = ref(false)
  const shakeDot = ref<number | null>(null)
  const feedbackMsg = ref('')
  const score = ref({ correct: 0, total: 0 })
  const history = ref<{ input: string; correct: boolean }[]>([])

  const brailleUnicode = computed(() =>
    brailleOutput.value.map(d => dotsToUnicode(d)).join('')
  )

  function translate() {
    brailleOutput.value = textToBraille(inputText.value)
  }

  function reverseTranslate() {
    // Simple: take selectedDots and find matching char
    return brailleToText(selectedDots.value)
  }

  function generateQuiz() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    quizChar.value = chars[Math.floor(Math.random() * chars.length)]
    selectedDots.value = []
    selectionOrder.value = []
    feedbackMsg.value = ''
  }

  function toggleDot(dot: number) {
    const idx = selectedDots.value.indexOf(dot)

    if (idx >= 0) {
      selectedDots.value.splice(idx, 1)
      const orderIdx = selectionOrder.value.indexOf(dot)
      if (orderIdx >= 0) selectionOrder.value.splice(orderIdx, 1)
      shakeDot.value = dot
      feedbackMsg.value = `已取消点位 ${dot}`
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => { shakeDot.value = null }, 300)
      setTimeout(() => { if (feedbackMsg.value === `已取消点位 ${dot}`) feedbackMsg.value = '' }, 1500)
      return
    }

    if (orderMode.value) {
      const expected = selectionOrder.value.length + 1
      if (dot !== expected) {
        shakeDot.value = dot
        feedbackMsg.value = `顺序错误！请按顺序选择点位 ${expected}`
        if (navigator.vibrate) navigator.vibrate([50, 30, 50])
        setTimeout(() => { shakeDot.value = null }, 400)
        setTimeout(() => { if (feedbackMsg.value.startsWith('顺序错误')) feedbackMsg.value = '' }, 2000)
        return
      }
    }

    selectedDots.value.push(dot)
    selectionOrder.value.push(dot)
    feedbackMsg.value = `已选择点位 ${dot}`
    if (navigator.vibrate) navigator.vibrate(20)
    setTimeout(() => { if (feedbackMsg.value === `已选择点位 ${dot}`) feedbackMsg.value = '' }, 1000)
  }

  function checkQuizAnswer() {
    const correct = JSON.stringify([...selectedDots.value].sort()) === JSON.stringify([...(BRAILLE_MAP[quizChar.value] || [])].sort())
    score.value.total++
    if (correct) score.value.correct++
    history.value.unshift({ input: quizChar.value, correct })
    if (navigator.vibrate) navigator.vibrate(correct ? 100 : [100, 50, 100])
    generateQuiz()
  }

  function resetScore() {
    score.value = { correct: 0, total: 0 }
    history.value = []
  }

  function exportPDF(): string {
    const lines = inputText.value.toUpperCase().split('')
    let out = '盲文翻译输出\n\n'
    for (const ch of lines) {
      const dots = BRAILLE_MAP[ch] || []
      out += `${ch} → [${dots.join(',')}] ${dotsToUnicode(dots)}\n`
    }
    return out
  }

  return {
    inputText, brailleOutput, learnMode, quizChar, selectedDots, selectionOrder,
    orderMode, shakeDot, feedbackMsg, score, history,
    brailleUnicode, translate, reverseTranslate, generateQuiz, toggleDot,
    checkQuizAnswer, resetScore, exportPDF
  }
})
