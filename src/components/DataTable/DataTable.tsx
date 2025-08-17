import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Column, DataTableProps, SortConfig, Filter } from './DataTable.types';

export function DataTable<T extends Record<string, any> = Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  emptyText = 'No data available',
  className = '',
  rowKey = 'id' as keyof T,
  pagination = false,
  pageSize = 10,
  filters = [],
  searchable = false,
  searchPlaceholder = 'Search...',
  rowHover = true,
  stickyHeader = false,
  exportable = false,
  customActions,
  animationEnabled = true,
  striped = true,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedRows([]);
  }, [data]);

  // Notify parent about selection changes
  useEffect(() => {
    if (onRowSelect) {
      onRowSelect(selectedRows);
    }
  }, [selectedRows, onRowSelect]);

  // Filter data based on search term
  const filteredBySearch = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(row => {
      // Search in all searchable columns
      return columns.some(column => {
        if (!column.searchable) return false;

        const value = String(row[column.dataIndex] || '').toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      });
    });
  }, [data, columns, searchTerm]);

  // Apply active filters
  const filteredData = useMemo(() => {
    if (activeFilters.length === 0) return filteredBySearch;

    return filteredBySearch.filter(row => {
      return activeFilters.every(filter => {
        // Basic filtering - can be extended for more complex logic
        const value = row[filter.key];
        return filter.value === value;
      });
    });
  }, [filteredBySearch, activeFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  // Handlers
  const handleRowSelect = useCallback((row: T) => {
    if (!selectable) return;

    setSelectedRows(prevSelectedRows => {
      const isSelected = prevSelectedRows.some(
        (selectedRow) => selectedRow[rowKey] === row[rowKey]
      );

      if (isSelected) {
        return prevSelectedRows.filter(
          (selectedRow) => selectedRow[rowKey] !== row[rowKey]
        );
      } else {
        return [...prevSelectedRows, row];
      }
    });
  }, [selectable, rowKey]);

  const handleSelectAll = useCallback(() => {
    setSelectedRows(prevSelectedRows => {
      return prevSelectedRows.length === paginatedData.length ? [] : [...paginatedData];
    });
  }, [paginatedData]);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prevSortConfig => {
      let direction: 'asc' | 'desc' = 'asc';
      if (
        prevSortConfig &&
        prevSortConfig.key === key &&
        prevSortConfig.direction === 'asc'
      ) {
        direction = 'desc';
      }
      return { key, direction };
    });
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handleFilterChange = useCallback((filter: Filter) => {
    setActiveFilters(prev => {
      // Remove existing filter with same key if exists
      const filtered = prev.filter(f => f.key !== filter.key);

      // Add new filter if it has a value
      if (filter.value) {
        return [...filtered, filter];
      }

      return filtered;
    });

    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleExport = useCallback(() => {
    // Simple CSV export - can be enhanced for different formats
    const headers = columns.map(col => col.title).join(',');
    const rows = sortedData.map(row => {
      return columns.map(col => {
        const value = row[col.dataIndex];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',');
    }).join('\n');

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [columns, sortedData]);

  const toggleRowExpand = useCallback((rowId: string) => {
    setExpandedRow(prev => prev === rowId ? null : rowId);
  }, []);

  // Helper functions
  const isRowSelected = useCallback((row: T) => {
    return selectedRows.some(
      (selectedRow) => selectedRow[rowKey] === row[rowKey]
    );
  }, [selectedRows, rowKey]);

  const isAllSelected = paginatedData.length > 0 && selectedRows.length >= paginatedData.length;

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Table animations
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      }
    }),
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  // For responsive design, we'll create a simplified table view for mobile
  const renderMobileRow = (row: T, rowIndex: number) => (
    <motion.div
      key={String(row[rowKey]) || rowIndex}
      className={`mb-4 p-4 border rounded-lg shadow-sm 
        ${isRowSelected(row) ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}
      `}
      variants={animationEnabled ? rowVariants : undefined}
      initial={animationEnabled ? "hidden" : undefined}
      animate={animationEnabled ? "visible" : undefined}
      exit={animationEnabled ? "exit" : undefined}
      custom={rowIndex}
      whileHover={rowHover && animationEnabled ? { scale: 1.01, transition: { duration: 0.1 } } : undefined}
      onClick={() => handleRowSelect(row)}
    >
      {selectable && (
        <div className="mb-2 flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={isRowSelected(row)}
            onChange={() => handleRowSelect(row)}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Select</span>
        </div>
      )}

      {columns.map((column) => (
        <div key={column.key} className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
            {column.title}
          </div>
          <div className="text-sm text-gray-900 dark:text-white">
            {column.render
              ? column.render(row[column.dataIndex], row)
              : String(row[column.dataIndex] || '')}
          </div>
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Table Controls */}
      {(searchable || filters.length > 0 || exportable || customActions) && (
        <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {searchable && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input
                  type="search"
                  className="pl-10 pr-3 py-2 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            )}

            {filters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.map(filter => {
                  // Ensure value is string, number, or undefined
                  const filterValue = activeFilters.find(f => f.key === filter.key)?.value;
                  const selectValue =
                    typeof filterValue === 'string' || typeof filterValue === 'number' || Array.isArray(filterValue)
                      ? filterValue
                      : '';

                  return (
                    <select
                      key={String(filter.key)}
                      className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectValue}
                      onChange={e => handleFilterChange({ key: filter.key, value: e.target.value })}
                    >
                      <option value="">{filter.label || `Filter by ${filter.key}`}</option>
                      {(filter.options ?? []).map(option => (
                        <option
                          key={String(option.value)}
                          value={typeof option.value === 'boolean' ? String(option.value) : option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {customActions}

            {exportable && (
              <button
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleExport}
              >
                Export
              </button>
            )}

            {selectedRows.length > 0 && (
              <div className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedRows.length} selected
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile View - Only visible on small screens */}
      <div className="block sm:hidden">
        <AnimatePresence>
          {loading ? (
            <div className="py-8 flex justify-center items-center">
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-700 dark:text-blue-400">Loading...</span>
              </div>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {emptyText}
            </div>
          ) : (
            <motion.div
              variants={animationEnabled ? tableVariants : undefined}
              initial={animationEnabled ? "hidden" : undefined}
              animate={animationEnabled ? "visible" : undefined}
            >
              {paginatedData.map((row, rowIndex) => renderMobileRow(row, rowIndex))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View - Hidden on small screens */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <motion.table
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          variants={animationEnabled ? tableVariants : undefined}
          initial={animationEnabled ? "hidden" : undefined}
          animate={animationEnabled ? "visible" : undefined}
        >
          <thead className={`bg-gray-50 dark:bg-gray-800 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={loading}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.sortable ? 'cursor-pointer select-none' : ''
                    }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span>
                        {sortConfig && sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td
                  colSpan={selectable ? columns.length + 1 : columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  <div className="flex justify-center items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={selectable ? columns.length + 1 : columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {paginatedData.map((row, rowIndex) => (
                  <React.Fragment key={String(row[rowKey]) || rowIndex}>
                    <motion.tr
                      className={`
                        ${isRowSelected(row)
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : striped
                            ? rowIndex % 2 === 0
                              ? 'bg-white dark:bg-gray-900'
                              : 'bg-gray-50 dark:bg-gray-800'
                            : 'bg-white dark:bg-gray-900'
                        } 
                        ${selectable || rowHover ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                      `}
                      onClick={() => handleRowSelect(row)}
                      variants={animationEnabled ? rowVariants : undefined}
                      initial={animationEnabled ? "hidden" : undefined}
                      animate={animationEnabled ? "visible" : undefined}
                      exit={animationEnabled ? "exit" : undefined}
                      custom={rowIndex}
                      whileHover={rowHover && animationEnabled ? { scale: 1.01, transition: { duration: 0.1 } } : undefined}
                    >
                      {selectable && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={isRowSelected(row)}
                            onChange={() => { }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}

                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                        >
                          {column.render
                            ? column.render(row[column.dataIndex], row)
                            : String(row[column.dataIndex] || '')}
                        </td>
                      ))}
                    </motion.tr>

                    {/* Expandable row */}
                    {expandedRow === String(row[rowKey]) && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={selectable ? columns.length + 1 : columns.length} className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {/* Expanded content goes here */}
                            <p>Expanded details for {String(row[rowKey])}</p>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </motion.table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
                <span className="font-medium">{sortedData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum: number;

                  // Logic for showing appropriate page numbers
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${currentPage === pageNum
                          ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-300'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;