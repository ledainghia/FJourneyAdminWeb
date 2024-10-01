'use client';
import DataTableCustom from '@/components/datatables/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { managementAPI } from '@/config/axios/axios';
import { cn } from '@/lib/utils';
import { PopoverClose } from '@radix-ui/react-popover';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin5Fill, RiDeviceRecoverFill, RiUserAddLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Categories = () => {
    const [columns, setColumns] = useState<DataTableColumn<any>[]>([]);
    const [search, setSearch] = useState('');
    const [categoryName, setCategoryName] = useState('' as string);
    const [description, setDescription] = useState('' as string);
    const [status, setStatus] = useState('' as string);
    const [categoryNameAdd, setCategoryNameAdd] = useState('' as string);
    const [descriptionAdd, setDescriptionAdd] = useState('' as string);
    const [statusAdd, setStatusAdd] = useState('Active' as string);

    const [image, setImage] = useState<File | null>(null);

    const [isAsc, setIsAsc] = useState('TRUE' as string);
    const [filter, setFilter] = useState('' as string);
    const [rowData, setRowData] = useState([] as any[]);
    const queryClient = useQueryClient();

    const { data, error, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => managementAPI.getCategories(filter),
    });

    const showAlert = async (id: string, action: string, name: string) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn bg-red-500 text-white ltr:ml-3 rtl:mr-3',
                cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
                popup: 'sweet-alerts',
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: 'Are you sure?',
                text: `You want to change status ${action.toLowerCase()} ${name} with ID = ${id}!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Yes, change it!`,
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    handleChangeStatus(id, action);
                    swalWithBootstrapButtons.fire(`${action.toLowerCase()}!`, `Your category has been ${action.toLowerCase()}.`, 'success');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Cancelled', 'No change', 'info');
                }
            });
    };

    const handleChangeStatus = (id: string, action: string) => {
        managementAPI
            .changeStatusCategory(id, action)
            .then((data) => {
                if (data?.data.success === true) {
                    queryClient.invalidateQueries({ queryKey: ['categories'] });
                    toast.success('Category status changed successfully');
                } else {
                    toast.error('Error changing category status');
                }
            })
            .catch(() => {
                toast.error('Error changing category status');
            });
    };

    useEffect(() => {
        if (error || data?.data.success === false) {
            toast.error('Error fetching data users');
        } else {
            const collumnsConfig: DataTableColumn<any>[] = [
                { accessor: 'id', title: 'ID', sortable: true },
                { accessor: 'categoryName', title: 'Categories Name', sortable: true },
                { accessor: 'description', title: 'Categories Description', sortable: true },
                {
                    accessor: 'products',
                    title: 'Products Count',
                    sortable: true,
                    render: (value) => {
                        return (
                            <div className="flex items-center">
                                <span className="text-primary">{value.products.length}</span>
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
                                <Button variant="outline" size="sm">
                                    <FaEdit className="h-4 w-4" />
                                </Button>
                                {value.status === 'Active' && (
                                    <Button variant="outline" className="bg-red-500 text-white" size="sm" onClick={() => showAlert(value.id, 'Inactive', value.categoryName)}>
                                        <RiDeleteBin5Fill className="h-4 w-4" />
                                    </Button>
                                )}
                                {value.status !== 'Active' && (
                                    <Button variant="outline" className="bg-orange-300 text-white" onClick={() => showAlert(value.id, 'Active', value.categoryName)} size="sm">
                                        <RiDeviceRecoverFill className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        );
                    },
                },
            ];
            setColumns(collumnsConfig);
            setRowData(data?.data.result.categories || []);
        }
    }, [data]);

    const handleApplyFilter = () => {
        const filter = `CategoryName=${categoryName}&Description=${description}&Status=${status}`;
        setFilter(filter);
    };

    const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event?.target.files === null) return;
        const fileUpload = event?.target.files[0];
        setImage(fileUpload);
    };

    const handleAddCategory = () => {
        if (!categoryNameAdd || !descriptionAdd || !image) {
            toast.error('Please fill all fields');
            return;
        }
        const formData = new FormData();
        formData.append('CategoryName', categoryNameAdd);
        formData.append('Description', descriptionAdd);
        formData.append('Status', statusAdd);
        formData.append('ImageUrl', image as Blob);
        managementAPI
            .postCategory(formData)
            .then((data) => {
                if (data?.data.success === true) {
                    queryClient.invalidateQueries({ queryKey: ['categories'] });
                    setCategoryNameAdd('');
                    setDescriptionAdd('');
                    setImage(null);

                    toast.success('Category added successfully');
                } else {
                    toast.error('Error adding category');
                }
            })
            .catch(() => {
                toast.error('Error adding category');
            });
    };

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
    }, [filter]);

    if (isLoading) {
        return (
            <div className="mt-52 flex h-full w-full justify-center align-middle">
                <span className="m-auto mb-10 inline-block h-14 w-14 animate-[spin_2s_linear_infinite] rounded-full border-8 border-[#f1f2f3] border-l-primary border-r-primary align-middle"></span>
            </div>
        );
    }

    return (
        <div>
            <div className="panel ">
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
                                            <Label htmlFor="categoryName">Category Name</Label>
                                            <Input
                                                id="collectionName"
                                                defaultValue={categoryName}
                                                onChange={(e) => {
                                                    setCategoryName(e.target.value);
                                                }}
                                                placeholder=""
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="Description">Description</Label>
                                            <Input
                                                id="Description"
                                                defaultValue={description}
                                                onChange={(e) => {
                                                    setDescription(e.target.value);
                                                }}
                                                className="col-span-2 h-8"
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="status">Status</Label>
                                            <Select value={status} onValueChange={setStatus}>
                                                <SelectTrigger className="col-span-2 h-8">
                                                    <SelectValue placeholder="Is Active" />
                                                </SelectTrigger>
                                                <SelectContent id="status" className="bg-white">
                                                    <SelectGroup>
                                                        <SelectLabel>Active / Inactive</SelectLabel>
                                                        <SelectItem value="Active">Active</SelectItem>
                                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
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
                                                setCategoryName('');
                                                setDescription('');
                                                setStatus('');
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
                    <div className="flex items-center gap-5">
                        <div className="flex-1 md:flex-auto">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant={'outline'}>
                                        <RiUserAddLine className="mr-2 h-4 w-4" /> Add new category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white sm:max-w-[425px]">
                                    <form>
                                        {' '}
                                        <DialogHeader>
                                            <DialogTitle>Add new category</DialogTitle>
                                            <DialogDescription>Click save when you're done.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Category Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    required
                                                    onChange={(e) => {
                                                        setCategoryNameAdd(e.target.value);
                                                    }}
                                                    placeholder="Type category name here ..."
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="username" className="text-right">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    required
                                                    onChange={(e) => setDescriptionAdd(e.target.value)}
                                                    id="username"
                                                    placeholder="Type description name here ..."
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="image" className="text-right">
                                                    Image upload
                                                </Label>
                                                <input required type="file" id="image" onChange={handleUploadImage} className="col-span-3" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant={'outline'}>Cancel</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button onClick={handleAddCategory} className="text-white">
                                                    Save changes
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <DataTableCustom rowData={rowData} columns={columns} search={search} setSearch={setSearch} />
            </div>
        </div>
    );
};

export default Categories;
