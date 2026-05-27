import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, LoaderCircle, RotateCcw, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '@/components/common/SEO'
import CardQuestions from '../components/CardQuestions'

const QUESTION_AMOUNT = 15
const TRIVIA_CATEGORIES = [
  9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31, 32,
]

const getRandomCategory = (excludedCategories = []) => {
  const availableCategories = TRIVIA_CATEGORIES.filter(
    (category) => !excludedCategories.includes(category)
  )

  return availableCategories[Math.floor(Math.random() * availableCategories.length)]
}

const decodeHtml = (value = '') => {
  const parsed = new DOMParser().parseFromString(value, 'text/html')
  return parsed.body.textContent || ''
}

const shuffleAnswers = (answers) => {
  const shuffled = [...answers]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

const mapQuestion = (item, index) => {
  const correctAnswer = decodeHtml(item.correct_answer)
  const incorrectAnswers = item.incorrect_answers.map(decodeHtml)

  return {
    id: `${item.category}-${index}-${item.question}`,
    category: decodeHtml(item.category),
    difficulty: item.difficulty,
    question: decodeHtml(item.question),
    correctAnswer,
    answers: shuffleAnswers([correctAnswer, ...incorrectAnswers]),
  }
}

function QuizPage() {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = selectedAnswers[currentQuestionIndex]

  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) =>
          selectedAnswers[index] === question.correctAnswer ? total + 1 : total,
        0
      ),
    [questions, selectedAnswers]
  )

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')
    setIsFinished(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})

    try {
      const triedCategories = []

      while (triedCategories.length < TRIVIA_CATEGORIES.length) {
        const category = getRandomCategory(triedCategories)
        const triviaUrl = `https://opentdb.com/api.php?amount=${QUESTION_AMOUNT}&category=${category}&difficulty=hard&type=multiple`

        triedCategories.push(category)

        const response = await fetch(triviaUrl)
        if (!response.ok) {
          continue
        }

        const data = await response.json()
        if (data.response_code === 0 && data.results?.length) {
          setQuestions(data.results.map(mapQuestion))
          return
        }
      }

      throw new Error('Soal quiz tidak tersedia untuk kategori random saat ini.')
    } catch (error) {
      setQuestions([])
      setErrorMessage(error.message || 'Terjadi kesalahan saat memuat quiz.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchQuestions, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchQuestions])

  const handleSelectAnswer = (answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }))
  }

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((index) => Math.max(0, index - 1))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsFinished(true)
      return
    }

    setCurrentQuestionIndex((index) => Math.min(questions.length - 1, index + 1))
  }

  const progress = questions.length
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0

  return (
    <main className="min-h-screen bg-[#030303] px-4 py-10 text-white sm:px-6">
      <SEO
        title="Hard Quiz"
        description="Quiz hard multiple choice dengan kategori acak dari Open Trivia DB."
        path="/quiz"
      />

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-white/40">
              Open Trivia DB
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Hard Quiz
            </h1>
          </div>

          <button
            type="button"
            onClick={fetchQuestions}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/75 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Random Category
          </button>
        </div>

        {isLoading ? (
          <QuizState
            icon={<LoaderCircle className="h-8 w-8 animate-spin" />}
            title="Memuat quiz..."
            description="Mengambil 15 soal hard multiple choice dari OpenTDB."
          />
        ) : errorMessage ? (
          <QuizState
            title="Quiz gagal dimuat"
            description={errorMessage}
            actionLabel="Coba Lagi"
            onAction={fetchQuestions}
          />
        ) : isFinished ? (
          <ResultCard
            score={score}
            totalQuestions={questions.length}
            onRestart={fetchQuestions}
          />
        ) : (
          <>
            <div className="mb-6 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <CardQuestions
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
            />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Sebelumnya
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85 disabled:pointer-events-none disabled:opacity-40"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Selesai' : 'Selanjutnya'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

function QuizState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white shadow-2xl shadow-black/20 backdrop-blur-md">
      {icon && <div className="mb-4 flex justify-center text-white/70">{icon}</div>}
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
        {description}
      </p>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function ResultCard({ score, totalQuestions, onRestart }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="mb-5 flex justify-center">
        <div className="rounded-full bg-white/10 p-4">
          <Trophy className="h-10 w-10 text-white" />
        </div>
      </div>

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
        Quiz selesai
      </p>
      <h2 className="mt-3 text-4xl font-bold">
        {score} / {totalQuestions}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
        Jawaban benar kamu dari total {totalQuestions} soal hard multiple choice.
      </p>

      <button
        type="button"
        onClick={onRestart}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85"
      >
        <RotateCcw className="h-4 w-4" />
        Main Lagi
      </button>
    </div>
  )
}

export default QuizPage
