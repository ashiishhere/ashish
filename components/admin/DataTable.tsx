'use client';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyLabel?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, rows, getRowKey, emptyLabel = 'No records yet.', onRowClick }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="border border-dashed border-border py-16 text-center text-muted">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {columns.map((col) => (
              <th key={col.header} className="whitespace-nowrap px-4 py-3 text-xs uppercase tracking-widest2 text-muted">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-border ${onRowClick ? 'cursor-pointer hover:bg-surface2' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
