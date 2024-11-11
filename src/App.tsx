import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, SortAsc, SortDesc } from "lucide-react";
import { format } from 'date-fns';

interface Model {
  id: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
}

type SortField = 'date' | 'context';
type SortDirection = 'asc' | 'desc';

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
          <div className="flex gap-4">
            <Button
              variant={sortField === 'date' ? 'default' : 'outline'}
              onClick={() => toggleSort('date')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Date
              {sortField === 'date' && (
                sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant={sortField === 'context' ? 'default' : 'outline'}
              onClick={() => toggleSort('context')}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Context Length
              {sortField === 'context' && (
                sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {sortedModels.map((model) => (
            <Card key={model.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2 text-foreground">{model.name}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{model.id}</p>
                    <p className="text-foreground whitespace-pre-wrap">{model.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 md:text-right">
                    <div className="flex items-center gap-2 md:justify-end text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(model.created * 1000, 'dd MMMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{model.context_length.toLocaleString()} tokens</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;