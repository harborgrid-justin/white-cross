import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  delay?: number
  className?: string
  testId?: string
  onClear?: () => void
  disabled?: boolean
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  delay = 300,
  className = '',
  testId,
  onClear,
  disabled = false
}) => {
  const [localValue, setLocalValue] = useState(value)

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, delay)

    return () => clearTimeout(timer)
  }, [localValue, onChange, delay])

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        data-testid={testId}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md 
          leading-5 bg-white placeholder-gray-500 
          focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${localValue ? 'pr-10' : 'pr-3'}
        `}
      />
      {localValue && !disabled && (
        <button
          data-testid={`${testId}-clear`}
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          type="button"
          aria-label="Clear search"
        >
          <span className="text-lg">×</span>
        </button>
      )}
    </div>
  )
}