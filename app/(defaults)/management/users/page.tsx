'use client';
import DataTableCustom from '@/components/datatables/data-table';
import Loading from '@/components/layouts/loading';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { managementAPI } from '@/config/axios/axios';
import { cn } from '@/lib/utils';
import { Input } from '@mantine/core';
import { Label } from '@radix-ui/react-label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { set } from 'lodash';
import { DataTableColumn } from 'mantine-datatable';
import { use, useEffect, useState } from 'react';
import { FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { GrUserAdmin } from 'react-icons/gr';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { RiExchange2Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Users = () => {
    const [columns, setColumns] = useState<DataTableColumn<any>[]>([]);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const queryClient = useQueryClient();
    const [role, setRole] = useState('1');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [password, setPassword] = useState('');

    const { data, error, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: managementAPI.getUsers,
    });

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
                { accessor: 'id', title: 'ID', sortable: true },
                { accessor: 'userName', title: 'Username', sortable: true },
                { accessor: 'email', title: 'Email', sortable: true },
                { accessor: 'phone', title: 'Phone', sortable: true },
                { accessor: 'address', title: 'Address', sortable: true },
                {
                    accessor: 'roleName',
                    title: 'Role Name',
                    sortable: true,
                    render: (value) => {
                        return (
                            <Badge variant={'outline'} className="rounded-sm">
                                {value.roleName === 'Admin' ? <GrUserAdmin className="mr-2" /> : <MdOutlineDeliveryDining className="mr-2 size-4" />} {value.roleName}
                            </Badge>
                        );
                    },
                },
                {
                    accessor: 'status',
                    title: 'Status',
                    sortable: true,
                    render: (value) => {
                        return (
                            <Badge variant={'outline'} className={cn('rounded', { 'bg-red-400 text-white': value.status !== 'Active', 'bg-orange-500 text-white': value.status === 'Active' })}>
                                {value.status}
                            </Badge>
                        );
                    },
                },
                {
                    accessor: 'action',
                    title: '',
                    sortable: false,
                    render: (value) => {
                        return (
                            <div className="space-x-2">
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
            setUsers(data?.data.result.users || []);
        }
    }, [data]);

    const addUser = useMutation({
        mutationFn: () => {
            if (!image || !userName || !email || !phone || !address || !password) {
                throw new Error('Please fill all fields!');
            }

            const formData = new FormData();
            formData.append('UserName', userName);
            formData.append('Email', email);
            formData.append('Phone', phone);
            formData.append('Address', address);
            formData.append('Password', password);
            formData.append('RoleId', role);
            formData.append('ImageUrl', image as Blob);

            return managementAPI.addUser(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User added successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Error adding user!');
        },
    });

    if (isLoading) {
        return (
            <div>
                <Loading></Loading>
            </div>
        );
    }

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
                <div className="mb-4.5 flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="ltr:mr-auto rtl:ml-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={'outline'}>
                                <IoAddCircleOutline className="mr-2" />
                                Add new user
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add new user</DialogTitle>
                                <DialogDescription> Click save when you're done.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Username
                                    </Label>
                                    <Input value={userName} onChange={(e) => setUserName(e.target.value)} id="name" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Password" className="text-right">
                                        Password
                                    </Label>
                                    <Input value={password} onChange={(e) => setPassword(e.target.value)} id="Password" type="password" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Email" className="text-right">
                                        Email
                                    </Label>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} id="Email" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Phone" className="text-right">
                                        Phone
                                    </Label>
                                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} id="Phone" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Address" className="text-right">
                                        Address
                                    </Label>
                                    <Input
                                        value={address}
                                        onChange={(e) => {
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
                                <Button onClick={() => addUser.mutate()}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <DataTableCustom rowData={users} columns={columns} search={search} setSearch={setSearch} />
            </div>
        </div>
    );
};

export default Users;
