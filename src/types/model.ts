export interface Model {
  id: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
}

export type SortField = 'date' | 'context';
export type SortDirection = 'asc' | 'desc';