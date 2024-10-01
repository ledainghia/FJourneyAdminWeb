'use client';
import DataTableCustom from '@/components/datatables/data-table';
import HeaderOfTable from '@/components/datatables/headerOfTable';
import IconBell from '@/components/icon/icon-bell';
import Loading from '@/components/layouts/loading';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { managementAPI } from '@/config/axios/axios';
import { cn } from '@/lib/utils';
import { PopoverClose } from '@radix-ui/react-popover';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { set } from 'lodash';
import { DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { FaUserCheck, FaUserEdit, FaUserTimes } from 'react-icons/fa';
import { RiUserAddLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Customers = () => {
    const [columns, setColumns] = useState<DataTableColumn<any>[]>([]);
    const [search, setSearch] = useState('');
    const [userName, setUserName] = useState('' as string);
    const [fullName, setFullName] = useState('' as string);
    const [email, setEmail] = useState('' as string);
    const [phone, setPhone] = useState('' as string);
    const [address, setAddress] = useState('' as string);
    const [isAsc, setIsAsc] = useState('true' as string);
    const [filter, setFilter] = useState('' as string);
    const [rowData, setRowData] = useState([] as any[]);
    const queryClient = useQueryClient();

    const { data, error, isLoading } = useQuery({
        queryKey: ['customers'],
        queryFn: () => managementAPI.getCustomers(filter),
    });

    const changeStatusCustomer = async (id: string, status: 'Active' | 'Inactive') => {
        const res = await managementAPI.changeStatusCustomer(id, status);
        if (res.data.success) {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success(res.data.message);
        } else {
            toast.error(res.data.message);
        }
    };
    const showAlert = async (userID: string, action: string, userName: string) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-secondary',
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
                { accessor: 'id', title: 'ID', sortable: true },
                { accessor: 'userName', title: 'Username', sortable: true },
                { accessor: 'fullName', title: 'Full Name', sortable: true },
                { accessor: 'email', title: 'Email', sortable: true },
                { accessor: 'address', title: 'Address', sortable: true },
                {
                    accessor: 'image',
                    title: 'Avatar',
                    sortable: true,
                    render: (value) => {
                        return <img src={value.image} alt="avatar" className="h-8 w-8 rounded" />;
                    },
                },
                {
                    accessor: 'status',
                    title: 'Status',
                    sortable: true,
                    render: (value) => {
                        return (
                            <Badge variant={'outline'} className={cn('rounded', { 'bg-red-400 text-white': value.status !== 'Active' })}>
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
                                {value.status === 'Active' && (
                                    <Button variant="destructive" size="sm" onClick={() => changeStatusCustomer(value.id, 'Inactive')}>
                                        <FaUserTimes className="h-4 w-4" />
                                    </Button>
                                )}
                                {value.status !== 'Active' && (
                                    <Button onClick={() => changeStatusCustomer(value.id, 'Active')} variant="destructive" size="sm">
                                        <FaUserCheck className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        );
                    },
                },
            ];
            setColumns(collumnsConfig);
            setRowData(data?.data.result.customers || []);
        }
    }, [data]);

    const handleApplyFilter = () => {
        const filter = `userName=${userName}&fullName=${fullName}&email=${email}&phone=${phone}&address=${address}&isAsc=${isAsc}`;
        setFilter(filter);
        queryClient.invalidateQueries({ queryKey: ['customers'] });
    };

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
    }, [filter]);

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
                            <BreadcrumbPage>Customers list</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="panel mt-6">
                <div className="mb-4.5 flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="flex items-center gap-5 ltr:mr-auto rtl:ml-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">Custom filter</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-white">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-bold leading-none">Filter</h4>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="username">User Name</Label>
                                            <Input
                                                id="username"
                                                defaultValue={userName}
                                                onChange={(e) => {
                                                    setUserName(e.target.value);
                                                }}
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                defaultValue={fullName}
                                                onChange={(e) => {
                                                    setFullName(e.target.value);
                                                }}
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                defaultValue={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                }}
                                                placeholder="abc@gmail.com"
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                defaultValue={phone}
                                                onChange={(e) => {
                                                    setPhone(e.target.value);
                                                }}
                                                placeholder="xxxxxx0012"
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                defaultValue={address}
                                                onChange={(e) => {
                                                    setAddress(e.target.value);
                                                }}
                                                className="col-span-2 h-8"
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="isAsc">Is Ascending</Label>
                                            <Select value="true" onValueChange={setIsAsc}>
                                                <SelectTrigger className="col-span-2 h-8">
                                                    <SelectValue placeholder="Is Ascending?" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    <SelectGroup>
                                                        <SelectLabel>TRUE / FALSE</SelectLabel>
                                                        <SelectItem value="true">TRUE</SelectItem>
                                                        <SelectItem value="false">FALSE</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <PopoverClose className="mt-4 w-full">
                                    <div className="flex w-full space-x-2">
                                        <Button
                                            variant={'outline'}
                                            className="w-full"
                                            onClick={() => {
                                                setUserName('');
                                                setFullName('');
                                                setEmail('');
                                                setPhone('');
                                                setAddress('');
                                                setIsAsc('');
                                                setFilter('');
                                            }}
                                        >
                                            Reset filter
                                        </Button>
                                        <Button className="w-full text-white" onClick={handleApplyFilter}>
                                            {' '}
                                            Apply this filter
                                        </Button>
                                    </div>
                                </PopoverClose>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DataTableCustom rowData={rowData} columns={columns} search={search} setSearch={setSearch} />
            </div>
        </div>
    );
};

export default Customers;
