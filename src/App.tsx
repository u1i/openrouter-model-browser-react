import { ThemeToggle } from './components/ThemeToggle'
import { useState, useEffect } from 'react'
import { Model } from './types'
import { ModelCard } from './components/ModelCard'
import { Button } from './components/ui/button'
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Calendar } from 'lucide-react'
import { useTheme } from './components/ThemeProvider'

function App() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<'context_length' | 'created'>('created')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetch('https://openrouter.ai/api/v1/models')
      .then(response => response.json())
      .then(data => {
        const modelsWithDates = data.data.map(model => ({
          ...model,
          created_at: model.created_at || new Date(0).toISOString()
        }))
        setModels(modelsWithDates)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching models:', error)
        setLoading(false)
      })
  }, [])

  const sortedModels = [...models].sort((a, b) => {
    if (sortKey === 'created') {
      return sortDirection === 'asc' 
        ? a.created - b.created 
        : b.created - a.created
    } else {
      let aValue = a[sortKey] || 0
      let bValue = b[sortKey] || 0
      return sortDirection === 'asc' 
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue)
    }
  })

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <h1 className="text-xl font-bold">OpenRouter Model Browser</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('created')}
              className={`h-8 border-dashed ${sortKey === 'created' ? 'bg-muted' : ''}`}
            >
              Date Added
              {sortKey === 'created' && (
                sortDirection === 'asc' ? (
                  <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                )
              )}
              {sortKey !== 'created' && <Calendar className="ml-2 h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('context_length')}
              className={`h-8 border-dashed ${sortKey === 'context_length' ? 'bg-muted' : ''}`}
            >
              Context Length
              {sortKey === 'context_length' && (
                sortDirection === 'asc' ? (
                  <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                )
              )}
              {sortKey !== 'context_length' && <ArrowDownWideNarrow className="ml-2 h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="h-8 border-dashed"
            >
              {theme === 'light' ? '🌙' : '☀️'} Theme
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App