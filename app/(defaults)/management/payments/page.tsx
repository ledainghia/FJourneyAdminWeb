'use client';
import DataTableCustom from '@/components/datatables/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { managementAPI } from '@/config/axios/axios';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import { GrUserAdmin } from 'react-icons/gr';
import { RiExchange2Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
export default function Page() {
    const queryClient = useQueryClient();
    const [columns, setColumns] = useState<DataTableColumn<any>[]>([]);
    const [page, setPage] = useState(1);
    const [payments, setPayments] = useState<any[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const { data, error, isLoading } = useQuery({
        queryKey: ['paymentsList', { page, pageSize }],
        queryFn: () => {
            return managementAPI.getPayments({ page, pageSize });
        },
    });

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['usersList'] });
    }, [page, pageSize]);

    const onPageSizeChange = (size: number) => {
        setPageSize(size);
    };

    const onPageChange = (page: number) => {
        console.log('page', page);
        setPage(page);
    };

    useEffect(() => {
        if (error || data?.data.success === false) {
            toast.error('Error fetching data users');
        } else {
            const collumnsConfig: DataTableColumn<any>[] = [
                {
                    accessor: 'passengerName',
                    title: 'Tên hành khách',
                },
                { accessor: 'driverName', title: 'Tên tài xế', sortable: true },
                { accessor: 'paymentMethod', title: 'Hình thức thanh toán', sortable: true },
                {
                    accessor: 'amount',
                    title: 'Số tiền',
                    sortable: true,
                    render: (value) => {
                        const amount: number = value.amount; // Giả sử amount là một số
                        const formattedAmount = new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(amount);
                        return <span>{formattedAmount}</span>;
                    },
                },

                {
                    accessor: 'status',
                    title: 'Trạng thái',
                    sortable: true,

                    render: (value) => {
                        return (
                            <Badge variant={value.status === 'Completed' ? 'default' : 'destructive'} className={`rounded-sm`}>
                                {value.status === 'Completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}
                            </Badge>
                        );
                    },
                },
                {
                    accessor: 'paidAt',
                    title: 'Ngày thanh toán',
                    sortable: true,
                    render: (value) => {
                        const paidAt: string = value.paidAt;
                        const formattedDate = format(new Date(paidAt), 'HH:mm:ss dd-MM-yyyy');
                        return <span>{formattedDate}</span>;
                    },
                },
            ];
            setColumns(collumnsConfig);
            console.log('data', data);
            setPayments(data?.data?.data?.items || []);
        }
    }, [data]);

    return (
        <div>
            <div className="panel">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Quản lí</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Danh sách thanh toán</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="panel mt-6">
                <div className="mb-4.5 flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="ltr:mr-auto rtl:ml-auto">
                        <input type="text" className="form-input w-auto" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <DataTableCustom
                    rowData={data?.data?.data?.items || []}
                    isFetching={isLoading}
                    columns={columns}
                    search={search}
                    setSearch={setSearch}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    totalRecords={data?.data?.data?.totalItems}
                />
            </div>
        </div>
    );
}
