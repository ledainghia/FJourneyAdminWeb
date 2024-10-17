'use client';
import DataTableCustom from '@/components/datatables/data-table';
import Loading from '@/components/layouts/loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';

import Select from 'react-select';
import { managementAPI } from '@/config/axios/axios';
import { User } from '@/datatype/usersType';
import { cn } from '@/lib/utils';
import { faker } from '@faker-js/faker';
import { Input } from '@mantine/core';
import { Label } from '@radix-ui/react-label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { set } from 'lodash';
import { DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { FaCheck, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { FaHandMiddleFinger, FaInfo, FaMotorcycle } from 'react-icons/fa6';
import { GrUserAdmin } from 'react-icons/gr';
import { IoAddCircleOutline, IoCheckmarkDoneOutline, IoCheckmarkDoneSharp } from 'react-icons/io5';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { RiExchange2Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { TbLicense } from 'react-icons/tb';
import Swal from 'sweetalert2';
import errorCodes from '@/data/errorCode';

const DriverVerifyDetail = () => {
    const [columns, setColumns] = useState<DataTableColumn<any>[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
    const [openDialog, setOpenDialog] = useState(false);
    const [errorCodeSelected, setErrorCodeSelected] = useState<number[]>([]);
    const [driversVerify, setDriversVerify] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // const usersRan = Array.from({ length: 10 }, createRandomUser);

    const { data, error, isLoading } = useQuery({
        queryKey: ['DriverVerifyList'],
        queryFn: () => managementAPI.getDriversVerify(),
    });

    const getDriverVerifyMutation = useMutation({
        mutationFn: (id: number) => {
            return managementAPI.getDriverVerifyDetail(id);
        },
        onSuccess: (data) => {
            const user = data?.data.result;
            setSelectedUser(data?.data.result);
            console.log('Selected User', user);
        },
        onError: (error: { message: any }) => {
            toast.error(error.message || 'Error fetching data');
        },
    });

    type DriverVerify = {
        userId: number;
        errorCode: number[];
    };

    const updateDriverVerifyMutation = useMutation({
        mutationFn: ({ userId, errorCode }: DriverVerify) => {
            return managementAPI.verifyDriver(userId, errorCode);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['DriverVerifyList'] });
            setOpenDialog(false);
            setErrorCodeSelected([]);
            setSelectedUser(null);
            toast.success('Driver verified successfully');
        },
        onError: (error: { message: any }) => {
            toast.error(error.message || 'Error verifying driver');
        },
    });

    const handleGetDriverVerify = (id: number) => {
        getDriverVerifyMutation.mutate(id);
    };

    const handleVerifyDriver = (id: number, errorCode: number[]) => {
        if (errorCode.length === 0) {
            toast.error('Please select error code');
            return;
        }
        updateDriverVerifyMutation.mutate({ userId: id, errorCode: errorCode });
    };

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

    useEffect(() => {
        if (error || data?.data.success === false) {
            toast.error('Error fetching data users');
        } else {
            if (data?.data.result.data && data?.data.result.data.length > 0) {
                const users = data?.data.result.data.filter((user: User) => {
                    return user.role === 'Driver' && (user.verificationStatus === 'Pending' || user.verificationStatus === 'Reject');
                });

                setDriversVerify(users);
            }
        }
    }, [data]);

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
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Driver Verify</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="panel mt-6">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel>
                        <ScrollArea className="h-screen p-3">
                            <div className="w-full ltr:mr-auto rtl:ml-auto">
                                <input type="text" className="form-input w-full" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>

                            {driversVerify &&
                                driversVerify.length > 0 &&
                                driversVerify.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleGetDriverVerify(user.id)}
                                        className={cn('mt-3 flex w-full flex-col items-start gap-2 rounded-lg border bg-transparent p-4 text-left text-sm text-dark transition-all hover:bg-accent')}
                                    >
                                        <div className="flex w-full gap-4">
                                            <div className="flex">
                                                <img
                                                    src={user.profileImageUrl} // Mỗi user có avatar khác nhau
                                                    className="w-24 rounded-md object-cover"
                                                    alt="shadcn"
                                                />
                                            </div>
                                            <div className="flex w-full flex-col">
                                                <div className="flex w-full items-center text-xl font-extrabold">
                                                    <h2>{user.name}</h2>
                                                    <Badge variant={user.verificationStatus === 'Pending' ? 'default' : 'destructive'} className="ml-3 rounded-md">
                                                        {user.verificationStatus}
                                                    </Badge>
                                                    <Badge variant={'outline'} className="ml-2 rounded-md">
                                                        {user.role}
                                                    </Badge>
                                                    {/* <div className="ml-auto text-xs text-gray-400">
                                                        {' '}
                                                        {formatDistanceToNow(new Date(user.createTime), {
                                                            addSuffix: true,
                                                        })}
                                                    </div> */}
                                                </div>
                                                <div className="flex items-center text-gray-500">
                                                    <span className="mr-2">📧</span>
                                                    <span>{user.email}</span>
                                                </div>
                                                <div className="flex items-center text-gray-500">
                                                    <span className="mr-2">📞</span>
                                                    <span>{user.phoneNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                        </ScrollArea>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel>
                        <ScrollArea className="h-screen p-3">
                            {selectedUser ? (
                                <div className="w-full rounded-lg bg-white p-4 shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <img src={selectedUser.profileImageUrl} className="h-24 w-24 rounded-full object-cover" alt={selectedUser.name} />
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                                            <div className="mt-1 flex">
                                                <Badge variant={'outline'} className=" rounded-md">
                                                    {selectedUser.id}
                                                </Badge>
                                                <Badge variant={'outline'} className="ml-1 rounded-md">
                                                    {selectedUser.role}
                                                </Badge>
                                            </div>

                                            {/* <p className="mt-2 text-gray-500">
                                                Active:{' '}
                                                {formatDistanceToNow(new Date(selectedUser.createTime), {
                                                    addSuffix: true,
                                                })}
                                            </p> */}
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="flex ">
                                            <div className=" h-fit w-fit rounded-md border p-2">
                                                <FaInfo size={12} />
                                            </div>
                                            <h3 className=" ml-3 text-lg font-semibold">Contact Information</h3>
                                        </div>

                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <p className="text-white-dark">Email</p>
                                            </div>
                                            <div>
                                                <p>{selectedUser.email}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-between">
                                            <div>
                                                <p className="text-white-dark">Phone number</p>
                                            </div>
                                            <div>
                                                <p>{selectedUser.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-between">
                                            <div>
                                                <p className="text-white-dark">StudentId</p>
                                            </div>
                                            <div>
                                                <p>{selectedUser.studentId}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex ">
                                            <img src={selectedUser.studentIdCardUrl} className="w-full" alt="" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex ">
                                            <div className=" h-fit w-fit rounded-md border p-2">
                                                <TbLicense size={12} />
                                            </div>
                                            <h3 className=" ml-3 text-lg font-semibold">License</h3>
                                        </div>

                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <p className="text-white-dark">License Number</p>
                                            </div>
                                            <div>
                                                <p>{selectedUser.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex ">
                                            <img src={undefined} className="w-full" alt="" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex ">
                                            <div className=" h-fit w-fit rounded-md border p-2">
                                                <FaMotorcycle size={12} />
                                            </div>
                                            <h3 className=" ml-3 text-lg font-semibold">Vehicles</h3>
                                        </div>

                                        {selectedUser.driverInfo?.vehicles && selectedUser.driverInfo?.vehicles.length > 0 ? (
                                            selectedUser.driverInfo?.vehicles.map((vehicle, index) => (
                                                <div key={index} className="mt-4">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="text-white-dark">Vehicle type</p>
                                                        </div>
                                                        <div>
                                                            <p>{vehicle.vehicleType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="text-white-dark">License Plate</p>
                                                        </div>
                                                        <div>
                                                            <p>{vehicle.licensePlate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex">
                                                        <img src={vehicle.vehicleImageUrl} className="w-full rounded-md" alt={`Vehicle ${index + 1}`} />
                                                    </div>
                                                    {/* <div className="mt-2 flex justify-between">
                                                        <div>
                                                            <p className="text-white-dark">Registration</p>
                                                        </div>
                                                        <div>
                                                            <p>{vehicle.licensePlate}</p>
                                                        </div>
                                                    </div> */}
                                                    <div className="mt-3 flex">
                                                        <img src={vehicle.registrationImageUrl} className="w-full rounded-md" alt={`Registration ${index + 1}`} />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="mt-4 text-gray-500">No vehicles found.</p>
                                        )}
                                    </div>
                                    <div className="flex w-full justify-end">
                                        <Dialog open={openDialog}>
                                            <DialogTrigger asChild>
                                                <Button variant={'default'} onClick={() => setOpenDialog(true)} className="mt-4">
                                                    <FaHandMiddleFinger className="mr-2" />
                                                    Verify
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Driver verify</DialogTitle>
                                                    <DialogDescription>Select the error in the box below</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                            Error code
                                                        </Label>
                                                        <div className="col-span-3">
                                                            <Select
                                                                isMulti
                                                                name="colors"
                                                                options={errorCodes}
                                                                isLoading={updateDriverVerifyMutation.isPending}
                                                                onChange={(value) => {
                                                                    console.log(value);
                                                                    if (!value) {
                                                                        setErrorCodeSelected([]);
                                                                        return;
                                                                    }
                                                                    if (value.some((v) => v.value === 0) && value.length > 1) {
                                                                        toast.error('You cannot select SUCCESS with other error codes');
                                                                        return;
                                                                    }
                                                                    setErrorCodeSelected(value.map((item) => item.value));
                                                                }}
                                                                className="basic-multi-select w-full"
                                                                classNamePrefix="select"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            onClick={() => {
                                                                setErrorCodeSelected([]);
                                                                setOpenDialog(false);
                                                            }}
                                                            variant={'outline'}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        onClick={() => {
                                                            handleVerifyDriver(selectedUser.id, errorCodeSelected);
                                                        }}
                                                        type="submit"
                                                    >
                                                        Save changes
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">Select a user to view details</p>
                            )}
                        </ScrollArea>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default DriverVerifyDetail;
