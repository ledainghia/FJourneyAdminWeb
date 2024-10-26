'use client';
import DataTableCustom from '@/components/datatables/data-table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { managementAPI } from '@/config/axios/axios';
import { CancellationReasons } from '@/datatype/cancellationReasons';
import { Input } from '@mantine/core';
import { Label } from '@radix-ui/react-label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { DataTableColumn } from 'mantine-datatable';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { IoAddCircleOutline } from 'react-icons/io5';
import { RiExchange2Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Page = () => {
    const [columns, setColumns] = useState<DataTableColumn<any>[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [cancelReasons, setCancelReasons] = useState<CancellationReasons[]>([]);
    const queryClient = useQueryClient();
    const [role, setRole] = useState('1');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [password, setPassword] = useState('');

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

    const showAlert = async (userID: string, action: string, userName: string) => {
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
                text: `You want to ${action} ${userName} with ${userID}!`,
                icon: 'warning',
                showCancelButton: true,

                confirmButtonText: `Yes, ${action} it!`,
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    managementAPI
                        .changeStatusUser(userID, action)
                        .then(() => {
                            queryClient.invalidateQueries({ queryKey: ['users'] });
                            toast.success('User status changed successfully');
                        })
                        .catch(() => {
                            toast.error('Error changing user status');
                        });
                    swalWithBootstrapButtons.fire('Deleted!', 'Your file has been deleted.', 'success');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Cancelled', 'No change', 'info');
                }
            });
    };

    const changeRoleUser = useMutation({
        mutationFn: ({ userID, role }: { userID: string; role: 1 | 1002 }) => {
            return managementAPI.changeRoleUser(userID, role);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Collection added successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Error change role for user!');
        },
    });

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

                    render: (value) => {
                        return (
                            <div className="max-w-56 space-x-2">
                                <Button variant={'secondary'} size="sm">
                                    <RiExchange2Line
                                        onClick={() => {
                                            const roleId = value.roleName === 'Admin' ? 1002 : 1;
                                            changeRoleUser.mutate({ userID: value.id, role: roleId });
                                        }}
                                        className="h-4 w-4"
                                    />
                                </Button>
                                {value.status === 'Active' && (
                                    <Button variant="outline" className="bg-red-500 text-white" size="sm" onClick={() => showAlert(value.id, 'Inactive', value.userName)}>
                                        <FaUserTimes className="h-4 w-4" />
                                    </Button>
                                )}
                                {value.status !== 'Active' && (
                                    <Button variant="outline" onClick={() => showAlert(value.id, 'Active', '')} className="bg-orange-300 text-white" size="sm">
                                        <FaUserCheck className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        );
                    },
                },
            ];
            setColumns(collumnsConfig);
            setCancelReasons(data?.data.result || []);
        }
    }, [data]);

    const handleSearchChange = useCallback(
        debounce((value: string) => {
            setSearch(value);

            queryClient.invalidateQueries({ queryKey: ['CancelReasons'] });
        }, 500),
        []
    );

    // if (isLoading) {
    //     return (
    //         <div>
    //             <Loading></Loading>
    //         </div>
    //     );
    // }

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
                    <Dialog>
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
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Username
                                    </Label>
                                    <Input value={userName} onChange={(e: { target: { value: SetStateAction<string> } }) => setUserName(e.target.value)} id="name" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Password" className="text-right">
                                        Password
                                    </Label>
                                    <Input
                                        value={password}
                                        onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
                                        id="Password"
                                        type="password"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Email" className="text-right">
                                        Email
                                    </Label>
                                    <Input value={email} onChange={(e: { target: { value: SetStateAction<string> } }) => setEmail(e.target.value)} id="Email" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Phone" className="text-right">
                                        Phone
                                    </Label>
                                    <Input value={phone} onChange={(e: { target: { value: SetStateAction<string> } }) => setPhone(e.target.value)} id="Phone" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Address" className="text-right">
                                        Address
                                    </Label>
                                    <Input
                                        value={address}
                                        onChange={(e: { target: { value: SetStateAction<string> } }) => {
                                            setAddress(e.target.value);
                                        }}
                                        id="Address"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Image" className="text-right">
                                        Image
                                    </Label>
                                    <input
                                        onChange={(e) => {
                                            if (e?.target.files === null) return;
                                            const fileUpload = e?.target.files[0];
                                            setImage(fileUpload);
                                        }}
                                        id="Image"
                                        type="file"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Image" className="text-right">
                                        Role
                                    </Label>

                                    <Select defaultValue="1" onValueChange={(e) => setRole(String(e))}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Admin</SelectItem>
                                            <SelectItem value="1002">Shipper</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose>
                                    <Button variant={'link'}>Cancel</Button>
                                </DialogClose>
                                <Button>Save changes</Button>
                            </DialogFooter>
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
