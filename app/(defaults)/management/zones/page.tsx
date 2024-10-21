'use client';
import DataTableCustom from '@/components/datatables/data-table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { managementAPI } from '@/config/axios/axios';
import { Zone } from '@/datatype/manageType';
import { Input } from '@mantine/core';
import { Label } from '@radix-ui/react-label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTableColumn } from 'mantine-datatable';
import { useEffect, useRef, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdOutlineDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const page = () => {
    const [columns, setColumns] = useState<DataTableColumn<any>[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [zones, setZones] = useState<Zone[]>([]);
    const [zoneName, setZoneName] = useState('');
    const [description, setDescription] = useState<string | undefined>('');
    const queryClient = useQueryClient();
    const zoneNameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const [password, setPassword] = useState('');

    const { data, error, isLoading } = useQuery({
        queryKey: ['zones'],
        queryFn: () => {
            return managementAPI.getZones({ page, pageSize });
        },
    });

    const onPageSizeChange = (size: number) => {
        setPageSize(size);
    };

    const onPageChange = (page: number) => {
        console.log('page', page);
        setPage(page);
    };

    const deleteZone = useMutation({
        mutationFn: (id: string) => {
            return managementAPI.deleteZone(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
            toast.success('Zone deleted successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Error deleting zone!');
        },
    });

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['usersList'] });
    }, [page, pageSize]);

    const showAlert = async (id: string | undefined, action: string, zoneName: string) => {
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
                text: `You want to ${action} ${zoneName} with id: ${id}!`,
                icon: 'warning',
                showCancelButton: true,

                confirmButtonText: `Yes, ${action} it!`,
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    if (!id) {
                        toast.error('Zone id is required');
                        return;
                    }
                    deleteZone.mutate(id);
                    swalWithBootstrapButtons.fire('Deleted!', 'Your file has been deleted.', 'success');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Cancelled', 'No change', 'info');
                }
            });
    };

    const updateZone = useMutation({
        mutationFn: (zone: Zone) => {
            return managementAPI.updateZone(zone);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
            toast.success('Zone updated successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Error updating zone!');
        },
    });

    const createZone = useMutation({
        mutationFn: (zone: Zone) => {
            return managementAPI.createZones(zone);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
            toast.success('Zone added successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Error adding zone!');
        },
    });

    useEffect(() => {
        if (error || data?.data.success === false) {
            toast.error('Error fetching data users');
        } else {
            const collumnsConfig: DataTableColumn<any>[] = [
                { accessor: 'id', title: 'ID', sortable: true },

                { accessor: 'zoneName', title: 'Zone name', sortable: true },
                { accessor: 'description', title: 'Description', sortable: false },
                {
                    accessor: 'actions',
                    title: false,
                    textAlignment: 'right',

                    render: (rowData: Zone) => {
                        return (
                            <div className="flex justify-end gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <CiEdit size={19} />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Change zone</DialogTitle>
                                            <DialogDescription> Click save when you're done.</DialogDescription>
                                        </DialogHeader>

                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Zone name
                                                </Label>
                                                <Input id="zoneName" defaultValue={rowData.zoneName} ref={zoneNameRef} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="Password" className="text-right">
                                                    Description
                                                </Label>
                                                <Textarea defaultValue={rowData.description} id="Password" ref={descriptionRef} className="col-span-3" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose>
                                                <Button variant={'link'}>Cancel</Button>
                                                <Button
                                                    onClick={() => {
                                                        const zoneName = zoneNameRef.current?.value;
                                                        const description = descriptionRef.current?.value;
                                                        if (!zoneName) {
                                                            toast.error('Zone name is required');
                                                            return;
                                                        }

                                                        updateZone.mutate({ id: rowData.id, zoneName: zoneNameRef.current?.value, description: descriptionRef.current?.value });
                                                    }}
                                                >
                                                    Save changes
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    onClick={() => {
                                        showAlert(rowData.id?.toString(), 'Remove', rowData.zoneName);
                                    }}
                                    variant="outline"
                                >
                                    <MdOutlineDelete size={19} />
                                </Button>
                            </div>
                        );
                    },
                },
            ];
            setColumns(collumnsConfig);
            setZones(data?.data.result.data || []);
        }
    }, [data]);

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
                            <BreadcrumbPage>Zones</BreadcrumbPage>
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
                                Add new zone
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add new zone</DialogTitle>
                                <DialogDescription> Click save when you're done.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Zone name
                                    </Label>
                                    <Input
                                        id="zoneName"
                                        value={zoneName}
                                        onChange={(e) => {
                                            setZoneName(e.target.value);
                                        }}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Password" className="text-right">
                                        Description
                                    </Label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => {
                                            console.log(e.target.value);
                                            setDescription(e.target.value);
                                        }}
                                        id="Password"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose>
                                    <Button variant={'link'}>Cancel</Button>
                                    <Button
                                        onClick={() => {
                                            createZone.mutate({ zoneName, description });
                                            setZoneName('');
                                            setDescription('');
                                        }}
                                    >
                                        Save changes
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <DataTableCustom
                    rowData={data?.data.result.data}
                    isFetching={isLoading}
                    columns={columns}
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

export default page;
