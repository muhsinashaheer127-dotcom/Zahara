import { FiMinus, FiPlus } from 'react-icons/fi'

const RentalDurationSelector = ({ duration, setDuration, durationOptions = [3, 5, 7, 10, 15] }) => {
  return (
    <div className="mb-6">
      <label className="text-sm text-gold uppercase tracking-wider mb-3 block">Select Rental Duration</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {durationOptions.map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => setDuration(days)}
            className={`px-4 min-h-[44px] rounded-full border text-sm transition-all ${
              duration === days
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-white/20 hover:border-gold/50 text-white/80'
            }`}
          >
            {days} Days
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setDuration(Math.max(3, duration - 1))}
          className="touch-target border border-white/20 rounded-lg hover:border-gold text-white/80 hover:text-gold transition-all"
        >
          <FiMinus />
        </button>
        <span className="w-16 text-center text-lg font-semibold text-white">{duration} Days</span>
        <button
          type="button"
          onClick={() => setDuration(duration + 1)}
          className="touch-target border border-white/20 rounded-lg hover:border-gold text-white/80 hover:text-gold transition-all"
        >
          <FiPlus />
        </button>
      </div>
    </div>
  )
}

export default RentalDurationSelector
