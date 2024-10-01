'use client';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { use, useEffect, useState } from 'react';
interface DataTableCustomProps {
    rowData: any;
    columns: any;
    search: string;
    setSearch: (value: string) => void;
}

const DataTableCustom: React.FC<DataTableCustomProps> = ({ rowData, columns, search, setSearch }) => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [dataFilter, setDataFilter] = useState(initialRecords);

    useEffect(() => {
        setInitialRecords(sortBy(rowData, 'id'));
    }, [rowData]);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    useEffect(() => {
        setInitialRecords(sortBy(rowData, 'id'));
    }, [rowData]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setDataFilter([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

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
            <DataTable
                highlightOnHover
                className="table-hover whitespace-nowrap"
                records={dataFilter}
                columns={columns}
                totalRecords={initialRecords.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={(p) => setPage(p)}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
            />
        </div>
    );
};

export default DataTableCustom;
