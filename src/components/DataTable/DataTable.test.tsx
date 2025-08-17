import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from './DataTable';
import { Column } from './DataTable.types';

interface TestItem {
  id: number;
  name: string;
  age: number;
}

const testData: TestItem[] = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'Bob', age: 40 },
];

const testColumns: Column<TestItem>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
];

describe('DataTable', () => {
  test('renders table with data', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
      />
    );
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  test('renders empty state', () => {
    render(
      <DataTable
        data={[]}
        columns={testColumns}
        emptyText="No items found"
      />
    );
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  test('renders loading state', () => {
    const { container } = render(
      <DataTable
        data={testData}
        columns={testColumns}
        loading={true}
      />
    );
    
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('allows row selection', () => {
    const handleRowSelect = jest.fn();
    render(
      <DataTable
        data={testData}
        columns={testColumns}
        selectable
        onRowSelect={handleRowSelect}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(4); // 3 rows + 1 header
    
    fireEvent.click(checkboxes[1]); // Select first row
    expect(handleRowSelect).toHaveBeenCalledWith([testData[0]]);
  });

  test('allows sorting', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
      />
    );
    
    const sortButtons = screen.getAllByRole('button', { name: /Sort by/ });
    expect(sortButtons.length).toBe(2);
    
    // Click to sort by age
    fireEvent.click(sortButtons[1]);
    
    // Check if sorted correctly (first row should be Jane with age 25)
    const cells = screen.getAllByRole('cell');
    expect(cells[0].textContent).toBe('Jane');
    expect(cells[1].textContent).toBe('25');
  });

  test('allows "select all" functionality', () => {
    const handleRowSelect = jest.fn();
    render(
      <DataTable
        data={testData}
        columns={testColumns}
        selectable
        onRowSelect={handleRowSelect}
      />
    );
    
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /Select all rows/ });
    fireEvent.click(selectAllCheckbox);
    
    expect(handleRowSelect).toHaveBeenCalledWith(testData);
  });
});

export {};