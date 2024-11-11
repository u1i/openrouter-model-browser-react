import { useEffect, useState } from 'react';
import { Model, SortField, SortDirection } from '@/types/model';
import { ModelCard } from '@/components/ModelCard';
import { SortControls } from '@/components/SortControls';

function App() {
  const [models, setModels] = useState<Model[]>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    fetch('https://openrouter.ai/api/v1/models')
      .then(response => response.json())
      .then(data => {
        const sortedModels = data.data.sort((a: Model, b: Model) => {
          const idA = a.id.split('/')[1];
          const idB = b.id.split('/')[1];
          return idA.localeCompare(idB);
        });
        setModels(sortedModels);
      });
  }, []);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedModels = [...models].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    if (sortField === 'date') {
      return (a.created - b.created) * multiplier;
    } else {
      return (a.context_length - b.context_length) * multiplier;
    }
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">OpenRouter Model Browser</h1>
          <SortControls
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={toggleSort}
          />
        </div>

        <div className="grid gap-6">
          {sortedModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;