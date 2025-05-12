import React from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Table, File } from 'lucide-react';

interface Column {
    header: string;
    accessor: string;
    render?: (row: any) => React.ReactNode;
    className?: string;
    sortable?: boolean;
}

interface FilterOption {
    label: string;
    value: string;
}

interface Filter {
    label: string;
    accessor: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    loading?: boolean;
    emptyState?: {
        icon: React.ReactNode;
        title: string;
        subtitle?: string;
    };
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        onPageChange: (page: number) => void;
    };
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    };
    filters?: Filter[];
    showFilters?: boolean;
    onToggleFilters?: () => void;
    exportOptions?: {
        onExportCSV?: () => void;
        onExportPDF?: () => void;
    };
    stats?: {
        label: string;
        value: number;
        className?: string;
    }[];
    title?: string;
    actions?: React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    loading = false,
    emptyState,
    pagination,
    search,
    filters,
    showFilters,
    onToggleFilters,
    exportOptions,
    stats,
    title,
    actions
}) => {
    const renderCell = (row: any, column: Column) => {
        if (column.render) {
            return column.render(row);
        }
        return row[column.accessor];
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Header Section */}
            {(title || search || filters || exportOptions || stats || actions) && (
                <div className="p-6 space-y-6">
                    {/* Title and Actions */}
                    {(title || actions) && (
                        <div className="flex justify-between items-center">
                            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
                            {actions}
                        </div>
                    )}

                    {/* Stats */}
                    {stats && stats.length > 0 && (
                        <div className="flex items-center gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className={`flex items-center gap-2 px-3 py-1 rounded-md ${stat.className || 'bg-gray-100'}`}>
                                    <span className="text-sm font-medium text-gray-600">{stat.label}:</span>
                                    <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Search, Filters, and Export Controls */}
                    {(search || filters || exportOptions) && (
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Search */}
                            {search && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={search.placeholder || "Search..."}
                                        value={search.value}
                                        onChange={(e) => search.onChange(e.target.value)}
                                        className="w-[300px] text-sm pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white shadow-sm"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>
                            )}

                            {/* Filters and Export */}
                            <div className="flex gap-4 items-center">
                                {filters && onToggleFilters && (
                                    <button
                                        onClick={onToggleFilters}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <SlidersHorizontal className="w-5 h-5" />
                                        <span className="hidden sm:inline">Filters</span>
                                    </button>
                                )}

                                {exportOptions && (
                                    <div className="flex gap-2">
                                        {exportOptions.onExportCSV && (
                                            <button
                                                onClick={exportOptions.onExportCSV}
                                                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                                title="Export as CSV"
                                            >
                                                <Table className="w-5 h-5 text-gray-600" />
                                            </button>
                                        )}
                                        {exportOptions.onExportPDF && (
                                            <button
                                                onClick={exportOptions.onExportPDF}
                                                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                                title="Export as PDF"
                                            >
                                                <File className="w-5 h-5 text-red-600" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Filters Panel */}
                    {showFilters && filters && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex flex-wrap gap-4">
                                {filters.map((filter, index) => (
                                    <div key={index} className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {filter.label}
                                        </label>
                                        <select
                                            value={filter.value}
                                            onChange={(e) => filter.onChange(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                                        >
                                            {filter.options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-100">
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-600 ${column.className || ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        {emptyState?.icon}
                                        <p className="text-sm font-medium">{emptyState?.title}</p>
                                        {emptyState?.subtitle && (
                                            <p className="text-xs text-gray-400">{emptyState.subtitle}</p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`px-6 py-3 ${column.className || ''}`}
                                        >
                                            {renderCell(row, column)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
            {pagination && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
                    <div className="text-sm text-gray-700">
                        Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                        {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                        {pagination.totalItems} items
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className={`p-2 rounded-lg border ${
                                pagination.currentPage === 1
                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className={`p-2 rounded-lg border ${
                                pagination.currentPage === pagination.totalPages
                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable; 