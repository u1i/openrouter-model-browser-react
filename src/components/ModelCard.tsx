import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from 'date-fns';
import { Model } from "@/types/model";
import ReactMarkdown from 'react-markdown';

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const cleanDescription = model.description?.replace(/```[\s\S]*?```/g, '');
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2 text-foreground">{model.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{model.id}</p>
            <ReactMarkdown>{cleanDescription || ''}</ReactMarkdown>
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
  );
}