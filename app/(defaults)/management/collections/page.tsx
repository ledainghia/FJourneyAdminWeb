'use client';
import DataTableCustom from '@/components/datatables/data-table';
import HeaderOfTable from '@/components/datatables/headerOfTable';
import IconBell from '@/components/icon/icon-bell';
import Loading from '@/components/layouts/loading';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { managementAPI } from '@/config/axios/axios';
import { cn } from '@/lib/utils';
import { PopoverClose } from '@radix-ui/react-popover';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { set } from 'lodash';
import { DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { FaEdit, FaUserCheck, FaUserEdit, FaUserTimes } from 'react-icons/fa';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoBanSharp } from 'react-icons/io5';
import { MdLibraryAdd } from 'react-icons/md';
import { RiDeleteBin5Fill, RiUserAddLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Collections = () => {
    const [columns, setColumns] = useState<DataTableColumn<any>[]>([]);
    const [search, setSearch] = useState('');
    const [collectionName, setCollectionName] = useState('' as string);
    const [collectionNameAdd, setCollectionNameAdd] = useState('' as string);
    const [campaignId, setCampaignId] = useState('' as string);

    const [isAsc, setIsAsc] = useState('true' as string);
    const [filter, setFilter] = useState('' as string);
    const [rowData, setRowData] = useState([] as any[]);
    const queryClient = useQueryClient();

    const { data, error, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: () => managementAPI.getCollections(filter),
    });

    const showAlert = async (userID: string, action: string, userName: string) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn bg-red-500 text-white',
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
                        .changeStatusCollection(userID, action)
                        .then((res) => {
                            if (res.data.success) {
                                queryClient.invalidateQueries({ queryKey: ['collections'] });
                                toast.success(`Collection ${action} successfully`);
                                swalWithBootstrapButtons.fire(action + '!', `Your collection has been ${action}.`, 'success');
                            } else {
                                toast.error(res.data.result.mesagge || 'Error changing status');
                            }
                        })
                        .catch((error) => {
                            toast.error(error.response.data.result.mesagge || 'Error changing status');
                        });
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
                { accessor: 'collectionName', title: 'Collection Name', sortable: true },
                {
                    accessor: 'products',
                    title: 'Products',
                    sortable: true,
                    render: (value) => {
                        return (
                            <div className="flex max-w-40 items-center gap-1">
                                {value.products && value.products.length > 0 ? (
                                    <>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <div className="space-x-1">
                                                        {value.products.slice(0, 2).map((product: any) => (
                                                            <Badge key={product.id} variant={'outline'} className="rounded-sm bg-lime-100">
                                                                {product.productName}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="space-x-1">
                                                        {value.products.map((product: any) => (
                                                            <Badge key={product.id} variant={'outline'} className="rounded-sm">
                                                                {product.productName}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {value.products.length > 2 && (
                                            <Badge variant={'outline'} className="rounded-sm bg-lime-100">
                                                +{value.products.length - 2} more
                                            </Badge>
                                        )}
                                    </>
                                ) : (
                                    'No product in this collection'
                                )}
                            </div>
                        );
                    },
                },
                {
                    accessor: 'status',
                    title: 'Status',
                    sortable: true,
                    render: (value) => {
                        return (
                            <Badge variant={value.status !== 'Active' ? 'destructive' : 'default'} className={cn('rounded', { 'bg-red-400 text-white': value.status !== 'Active' })}>
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
                                <Button variant="outline" size="sm">
                                    <FaEdit className="h-4 w-4" />
                                </Button>
                                {value.status === 'Active' && (
                                    <Button variant="destructive" size="sm" onClick={() => showAlert(value.id, 'Inactive', value.collectionName)}>
                                        <IoBanSharp className="h-4 w-4" />
                                    </Button>
                                )}
                                {value.status !== 'Active' && (
                                    <Button variant="outline" size="sm" onClick={() => showAlert(value.id, 'Active', value.collectionName)}>
                                        <FaRegCircleCheck className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        );
                    },
                },
            ];
            setColumns(collumnsConfig);
            setRowData(data?.data.result.collections || []);
        }
    }, [data]);

    const handleApplyFilter = () => {
        const filter = `collectionName=${collectionName}&campaignId=${campaignId}&isAsc=${isAsc}`;
        setFilter(filter);
    };

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['collections'] });
    }, [filter]);

    const addNewCollection = useMutation({
        mutationFn: () => {
            if (!collectionNameAdd) {
                throw new Error('You need to provide a collection name');
            }
            const data = {
                collectionName: collectionNameAdd,
                status: 'Active',
            };
            return managementAPI.postCollection(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            setCollectionNameAdd('');
            toast.success('Collection added successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Error adding collection');
        },
    });

    if (isLoading) {
        return (
            <div className="mt-52 flex h-full w-full justify-center align-middle">
                <span className="m-auto mb-10 inline-block h-14 w-14 animate-[spin_2s_linear_infinite] rounded-full border-8 border-[#f1f2f3] border-l-primary border-r-primary align-middle"></span>
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
                            <BreadcrumbPage>Collection list</BreadcrumbPage>
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
                                            <Label htmlFor="collectionName">Collection Name</Label>
                                            <Input
                                                id="collectionName"
                                                defaultValue={collectionName}
                                                onChange={(e) => {
                                                    setCollectionName(e.target.value);
                                                }}
                                                placeholder=""
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="campaignID">Compaign ID</Label>
                                            <Input
                                                id="campaignID"
                                                defaultValue={campaignId}
                                                onChange={(e) => {
                                                    setCampaignId(e.target.value);
                                                }}
                                                className="col-span-2 h-8"
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="isAsc">Is Ascending</Label>
                                            <Select value={isAsc} onValueChange={setIsAsc}>
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
                                                setCampaignId('');
                                                setCollectionName('');
                                                setIsAsc('');
                                                setFilter('');
                                            }}
                                        >
                                            Reset filter
                                        </Button>
                                        <Button className="w-full text-white" onClick={handleApplyFilter}>
                                            Apply this filter
                                        </Button>
                                    </div>
                                </PopoverClose>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex-1 md:flex-auto">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant={'outline'}>
                                        <RiUserAddLine className="mr-2 h-4 w-4" /> Add new collection
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add new collection</DialogTitle>
                                        <DialogDescription> Click save when you're done.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Collection Name
                                            </Label>
                                            <Input value={collectionNameAdd} onChange={(e) => setCollectionNameAdd(e.target.value)} className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose>
                                            <Button variant={'link'}>Cancel</Button>
                                        </DialogClose>
                                        <Button disabled={addNewCollection.isPending} onClick={() => addNewCollection.mutate()}>
                                            {addNewCollection.isPending ? 'Adding...' : 'Save'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                {/* <DataTableCustom rowData={rowData} columns={columns} search={search} setSearch={setSearch} /> */}
            </div>
        </div>
    );
};

export default Collections;
