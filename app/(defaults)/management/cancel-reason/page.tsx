'use client';
import DataTableCustom from '@/components/datatables/data-table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { managementAPI } from '@/config/axios/axios';
import { CancellationReasons } from '@/datatype/cancellationReasons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@mantine/core';
import { Label } from '@radix-ui/react-label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce, set } from 'lodash';
import { DataTableColumn } from 'mantine-datatable';
import { SetStateAction, use, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEdit, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdOutlineDelete } from 'react-icons/md';
import { RiExchange2Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { z } from 'zod';
import UpdateCancelReasonDialog from './dialogUpdateCancelReason';

const FormSchema = z.object({
    reasonId: z.string().optional(),
    content: z.string().nonempty("Content can't be empty"),
});

type FormType = z.infer<typeof FormSchema>;

const Page = () => {
    const [columns, setColumns] = useState<DataTableColumn<any>[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [cancelReasons, setCancelReasons] = useState<CancellationReasons[]>([]);
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const form = useForm<FormType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            content: '',
        },
    });

    const { data, error, isLoading } = useQuery({
        queryKey: ['CancelReasons'],
        queryFn: () => {
            return managementAPI.getCancelReasons({ page, pageSize, search });
        },
    });

    const onPageSizeChange = (size: number) => {
        setPageSize(size);
    };

    const onPageChange = (page: number) => {
        console.log('page', page);
        setPage(page);
    };

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['CancelReasons'] });
    }, [page, pageSize]);

    const deleteCancelReason = useMutation({
        mutationFn: (reasonId: string) => managementAPI.deleteCancelReason(reasonId),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['CancelReasons'] });
        },
        onSuccess: () => {
            toast.success('Delete cancel reason successfully.');
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message || 'An error occurred.');
        },
    });

    const showAlert = async (reasonId: string, action: string, content: string) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn bg-red-500 text-white ltr:ml-3 rtl:mr-3',
                cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
                popup: 'sweet-alerts',
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: 'Are you sure?',
                text: `You want to ${action}  with cancel reason id: ${reasonId} and content: ${content}!`,
                icon: 'warning',
                showCancelButton: true,

                confirmButtonText: `Yes, ${action} it!`,
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    deleteCancelReason.mutate(reasonId);
                    swalWithBootstrapButtons.fire('Deleted!', 'Your file has been deleted.', 'success');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Cancelled', 'No change', 'info');
                }
            });
    };

    useEffect(() => {
        if (error || data?.data.success === false) {
            toast.error('Error fetching data users');
        } else {
            const collumnsConfig: DataTableColumn<any>[] = [
                { accessor: 'reasonId', title: 'ID', sortable: true },
                { accessor: 'content', title: 'Content', sortable: true },

                {
                    accessor: 'action',
                    title: '',
                    sortable: false,
                    cellsClassName: 'flex justify-end ',

                    render: (value) => {
                        return (
                            <div className="flex space-x-2">
                                <UpdateCancelReasonDialog key={value.reasonId} content={value.content} reasonId={value.reasonId} />

                                <Button variant="outline" onClick={() => showAlert(value.reasonId, 'Delete', value.content)} className="bg-orange-300 text-white" size="sm">
                                    <MdOutlineDelete className="h-4 w-4" />
                                </Button>
                            </div>
                        );
                    },
                },
            ];
            setColumns(collumnsConfig);
            setCancelReasons(data?.data.result || []);
        }
    }, [data]);

    const createCancelReason = useMutation({
        mutationFn: (data: CancellationReasons) => managementAPI.createCancelReason(data),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['CancelReasons'] });
        },
        onSuccess: () => {
            toast.success('Create cancel reason successfully.');
            setOpen(false);
            form.reset();
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message || 'An error occurred.');
        },
    });

    function addCancelReason(data: FormType) {
        createCancelReason.mutate(data);
    }

    const handleSearchChange = useCallback(
        debounce((value: string) => {
            setSearch(value);

            queryClient.invalidateQueries({ queryKey: ['CancelReasons'] });
        }, 500),
        []
    );

    return (
        <div>
            <div className="panel">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Management</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>User</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="panel mt-6">
                <div className="mb-4.5 flex flex-col justify-end gap-5 md:flex-row md:items-center">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant={'outline'}>
                                <IoAddCircleOutline className="mr-2" />
                                Add new cancel reason
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add new cancel reason</DialogTitle>
                                <DialogDescription> Click save when you're done.</DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(addCancelReason)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Content</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose>
                                            <Button type="button" variant={'link'} className="rounded-md">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={createCancelReason.isPending} className="rounded-md">
                                            {createCancelReason.isPending ? 'Loading...' : 'Create'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
                <DataTableCustom
                    rowData={cancelReasons}
                    isFetching={isLoading}
                    columns={columns}
                    pagination={false}
                    search={search}
                    setSearch={setSearch}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    totalRecords={data?.data.result.totalItems}
                />
            </div>
        </div>
    );
};

export default Page;
