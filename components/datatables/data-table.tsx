'use client';

import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import '@/styles/loader.css';
interface DataTableCustomProps {
    rowData: any;
    columns: any;
    search: string;
    pagination?: boolean;
    setSearch: (value: string) => void;
    totalRecords: number;
    onPageSizeChange: (size: number) => void;
    onPageChange: (page: number) => void;
    pageSize: number;
    page: number;
    isFetching: boolean;
    setPage: (page: number) => void;
}

const DataTableCustom: React.FC<DataTableCustomProps> = ({
    rowData,
    columns,
    search,
    setSearch,
    onPageChange,
    onPageSizeChange,
    page,
    setPage,
    isFetching,
    pageSize,
    totalRecords,
    pagination = true,
}) => {
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [dataFilter, setDataFilter] = useState(initialRecords);

    useEffect(() => {
        setInitialRecords(sortBy(rowData, 'id'));
        console.log('rowData', rowData);
    }, [rowData]);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    useEffect(() => {
        setInitialRecords(sortBy(rowData, 'id'));
    }, [rowData]);

    useEffect(() => {
        setDataFilter(() => {
            return initialRecords.filter((item) => {
                return Object.values(item).some((value) => {
                    if (typeof value === 'string' || typeof value === 'number') {
                        return value.toString().toLowerCase().includes(search.toLowerCase());
                    }
                    return false;
                });
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    return (
        <div className="datatables">
            {pagination ? (
                <DataTable
                    key={initialRecords.length}
                    highlightOnHover
                    className="table-hover whitespace-nowrap"
                    records={initialRecords}
                    columns={columns}
                    fetching={isFetching}
                    striped={true}
                    customLoader={
                        <>
                            <div className="loader">
                                <svg viewBox="0 0 80 80">
                                    <circle r="32" cy="40" cx="40" id="test"></circle>
                                </svg>
                            </div>

                            <div className="loader triangle">
                                <svg viewBox="0 0 86 80">
                                    <polygon points="43 8 79 72 7 72"></polygon>
                                </svg>
                            </div>

                            <div className="loader">
                                <svg viewBox="0 0 80 80">
                                    <rect height="64" width="64" y="8" x="8"></rect>
                                </svg>
                            </div>
                        </>
                    }
                    totalRecords={totalRecords}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => onPageChange(p)}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={(p) => {
                        setPage(1);
                        onPageSizeChange(p);
                    }}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                />
            ) : (
                <DataTable
                    key={initialRecords.length}
                    highlightOnHover
                    className="table-hover whitespace-nowrap"
                    records={initialRecords}
                    columns={columns}
                    fetching={isFetching}
                    striped={true}
                    customLoader={
                        <>
                            <div className="loader">
                                <svg viewBox="0 0 80 80">
                                    <circle r="32" cy="40" cx="40" id="test"></circle>
                                </svg>
                            </div>

                            <div className="loader triangle">
                                <svg viewBox="0 0 86 80">
                                    <polygon points="43 8 79 72 7 72"></polygon>
                                </svg>
                            </div>

                            <div className="loader">
                                <svg viewBox="0 0 80 80">
                                    <rect height="64" width="64" y="8" x="8"></rect>
                                </svg>
                            </div>
                        </>
                    }
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                />
            )}
        </div>
    );
};

export default DataTableCustom;
