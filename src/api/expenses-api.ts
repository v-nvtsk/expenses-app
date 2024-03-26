export type DateCallback = (date: Date) => void;

export interface ExpensesApp {
  init: () => void;
  onExpenseAdd: DateCallback;
  onIncomeAdd: DateCallback;
  onHourSelect: DateCallback;
  showAddTodo: () => void;
  save: () => void;
}

export type Category = {
  id: string;
  name: string;
  parentId: string;
  leveledName?: string;
  children?: Category[];
};

export interface Filter {
  dateFrom?: number | null;
  dateTo?: number | null;
  text?: string;
  categoryId?: string;
}
type TwithId<T> = T & { id: string };

export interface CRUD<T> {
  create: (data: T) => Promise<string | undefined>;
  read: (filter: Partial<Filter>) => Promise<T[]>;
  update: (data: TwithId<T>) => Promise<TwithId<T> | undefined>;
  delete: (id: string) => Promise<void>;
}

export const APP_PREFIX = "expenses";
