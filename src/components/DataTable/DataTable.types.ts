import { ReactNode } from "react";

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  searchable?: boolean;
  width?: string | number;
  render?: (value: any, record: T) => ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  label: string;
  value: string | number | boolean;
}

export interface Filter {
  key: string;
  label?: string;
  value?: string | number | boolean;
  options?: FilterOption[];
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  emptyText?: string;
  className?: string;
  rowKey?: keyof T;
  pagination?: boolean;
  pageSize?: number;
  filters?: Filter[];
  searchable?: boolean;
  searchPlaceholder?: string;
  rowHover?: boolean;
  stickyHeader?: boolean;
  exportable?: boolean;
  customActions?: ReactNode;
  animationEnabled?: boolean;
  striped?: boolean;
}