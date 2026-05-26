function CardQuestions({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
}) {
  if (!question) return null

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/60">
            Question {questionNumber} / {totalQuestions}
          </span>
          <span className="rounded-full border border-white/10 bg-[#0a0a0a] px-3 py-1 text-xs font-medium text-white/70">
            {question.category}
          </span>
        </div>

        <h2 className="text-xl font-semibold leading-relaxed text-white sm:text-2xl">
          {question.question}
        </h2>
      </div>

      <div className="grid gap-3 p-6 sm:p-8">
        {question.answers.map((answer) => {
          const isSelected = selectedAnswer === answer
          const isCorrect = showResult && answer === question.correctAnswer
          const isWrong = showResult && isSelected && !isCorrect

          return (
            <button
              key={answer}
              type="button"
              onClick={() => onSelectAnswer(answer)}
              disabled={showResult}
              className={`
                rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all
                sm:text-base
                ${
                  isCorrect
                    ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-100'
                    : isWrong
                      ? 'border-red-400/60 bg-red-500/15 text-red-100'
                      : isSelected
                        ? 'border-white/50 bg-white/15 text-white'
                        : 'border-white/10 bg-white/5 text-white/75 hover:border-white/25 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {answer}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CardQuestions
