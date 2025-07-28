// src/components/Table.tsx
import React from 'react';

interface TableColumn {
    Header: string;
    accessor: string;
}

interface TableProps {
    columns: TableColumn[];
    data: any[];
    className?: string;
}

const Table: React.FC<TableProps> = ({ columns, data, className }) => {
    return (
        <div className={`overflow-x-auto ${className || ''}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={`th-${index}`}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.Header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, rowIndex) => (
                        <tr key={`tr-${rowIndex}`} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={`td-${rowIndex}-${colIndex}`}
                                    className="px-6 py-4 whitespace-nowrap text-sm"
                                >
                                    {row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;