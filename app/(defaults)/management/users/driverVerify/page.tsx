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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { use, useEffect, useState } from 'react';
import { FaCheck, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { FaHandMiddleFinger, FaInfo, FaMotorcycle } from 'react-icons/fa6';
import { GrUserAdmin } from 'react-icons/gr';
import { IoAddCircleOutline, IoCheckmarkDoneOutline, IoCheckmarkDoneSharp } from 'react-icons/io5';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { RiExchange2Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { TbLicense } from 'react-icons/tb';
import Swal from 'sweetalert2';

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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const createRandomUser = (): User => ({
        UserId: faker.string.uuid(),
        Name: faker.person.fullName(),
        Email: faker.internet.email(),
        PhoneNumber: faker.phone.number(),
        ProfileImageUrl: faker.image.avatar(),
        StudentIdCardUrl: faker.image.urlLoremFlickr({ category: 'student', width: 640, height: 480 }),
        Role: 'Driver',
        StudentId: faker.string.uuid(),
        LicenseNumber: faker.string.uuid(),
        LicenseImageUrl: faker.image.urlLoremFlickr({ category: 'transport', width: 640, height: 480 }),
        Vehicles: [
            {
                VehicleType: faker.vehicle.type(),
                LicensePlate: faker.vehicle.vrm(),
                VehicleImageUrl: faker.image.urlLoremFlickr({ category: 'transport', width: 640, height: 480 }),
                Registration: faker.string.uuid(),
                RegistrationImageUrl: faker.image.urlLoremFlickr({ category: 'transport', width: 640, height: 480 }),
            },
            {
                VehicleType: faker.vehicle.type(),
                LicensePlate: faker.vehicle.vrm(),
                VehicleImageUrl: faker.image.urlLoremFlickr({ category: 'transport', width: 640, height: 480 }),
                Registration: faker.string.uuid(),
                RegistrationImageUrl: faker.image.urlLoremFlickr({ category: 'transport', width: 640, height: 480 }),
            },
        ],
        DriverId: faker.string.uuid(),
        createTime: faker.date.between({ from: '2023-01-01', to: Date.now() }),
    });

    const usersRan = Array.from({ length: 10 }, createRandomUser);

    const { data, error, isLoading } = useQuery({
        queryKey: ['usersList'],
        queryFn: () => managementAPI.getUsers({ page, pageSize }),
    });

    const onPageSizeChange = (size: number) => {
        queryClient.invalidateQueries({ queryKey: ['usersList'] });
        setPageSize(size);
    };

    const onPageChange = (page: number) => {
        // queryClient.invalidateQueries({ queryKey: ['usersList'] });
        console.log('page', page);
        setPage(page);
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
                {
                    accessor: 'profileImageUrl',
                    title: 'Profile Image',
                    sortable: false,
                    render: (value) => {
                        return (
                            <Avatar className="rounded-md">
                                <AvatarImage src={value.profileImageUrl} alt="@shadcn" />
                                <AvatarFallback>{value.name}</AvatarFallback>
                            </Avatar>
                        );
                    },
                },
                { accessor: 'name', title: 'Name', sortable: true },
                { accessor: 'email', title: 'Email', sortable: true },
                { accessor: 'phoneNumber', title: 'Phone', sortable: true },
                { accessor: 'studentId', title: 'Student ID', sortable: true },
                {
                    accessor: 'role',
                    title: 'Role Name',
                    sortable: true,

                    render: (value) => {
                        return (
                            <Badge variant={'outline'} className={`rounded-sm ${value.role === 'Passenger' ? 'A' : 'b'}`}>
                                {value.role === 'Passenger' ? <GrUserAdmin className="mr-2" /> : <MdOutlineDeliveryDining className="mr-2 size-4 " />} {value.role}
                            </Badge>
                        );
                    },
                },
                {
                    accessor: 'verified',
                    title: 'Verified',
                    sortable: true,
                    render: (value) => {
                        return (
                            <Badge variant={'outline'} className={cn('rounded', { 'bg-red-400 text-white': value.verified !== true, 'bg-orange-500 text-white': value.status === true })}>
                                {value.verified ? 'True' : 'False'}
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
            setUsers(data?.data.result.data || []);
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

                            {usersRan.map((user) => (
                                <button
                                    key={user.UserId}
                                    onClick={() => setSelectedUser(user)}
                                    className={cn('mt-3 flex w-full flex-col items-start gap-2 rounded-lg border bg-transparent p-4 text-left text-sm text-dark transition-all hover:bg-accent')}
                                >
                                    <div className="flex w-full gap-4">
                                        <div className="flex">
                                            <img
                                                src={user.ProfileImageUrl} // Mỗi user có avatar khác nhau
                                                className="w-24 rounded-md object-cover"
                                                alt="shadcn"
                                            />
                                        </div>
                                        <div className="flex w-full flex-col">
                                            <div className="flex w-full items-center text-xl font-extrabold">
                                                <h2>{user.Name}</h2>
                                                <Badge variant={'outline'} className="ml-3 rounded-md">
                                                    {user.Role}
                                                </Badge>
                                                <div className="ml-auto text-xs text-gray-400">
                                                    {' '}
                                                    {formatDistanceToNow(new Date(user.createTime), {
                                                        addSuffix: true,
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <span className="mr-2">📧</span>
                                                <span>{user.Email}</span>
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <span className="mr-2">📞</span>
                                                <span>{user.PhoneNumber}</span>
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
                                            <img src={selectedUser.ProfileImageUrl} className="h-32 w-32 rounded-full object-cover" alt={selectedUser.Name} />
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-bold">{selectedUser.Name}</h2>
                                            <div className="mt-1 flex">
                                                <Badge variant={'outline'} className=" rounded-md">
                                                    {selectedUser.UserId}
                                                </Badge>
                                                <Badge variant={'outline'} className="ml-3 rounded-md">
                                                    {selectedUser.Role}
                                                </Badge>
                                            </div>

                                            <p className="mt-2 text-gray-500">
                                                Active:{' '}
                                                {formatDistanceToNow(new Date(selectedUser.createTime), {
                                                    addSuffix: true,
                                                })}
                                            </p>
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
                                                <p>{selectedUser.Email}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-between">
                                            <div>
                                                <p className="text-white-dark">Phone number</p>
                                            </div>
                                            <div>
                                                <p>{selectedUser.PhoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-between">
                                            <div>
                                                <p className="text-white-dark">StudentId</p>
                                            </div>
                                            <div>
                                                <p>{selectedUser.StudentId}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex ">
                                            <img src={selectedUser.StudentIdCardUrl} className="w-full" alt="" />
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
                                                <p>{selectedUser.LicenseNumber}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex ">
                                            <img src={selectedUser.LicenseImageUrl} className="w-full" alt="" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex ">
                                            <div className=" h-fit w-fit rounded-md border p-2">
                                                <FaMotorcycle size={12} />
                                            </div>
                                            <h3 className=" ml-3 text-lg font-semibold">Vehicles</h3>
                                        </div>

                                        {selectedUser.Vehicles.length > 0 ? (
                                            selectedUser.Vehicles.map((vehicle, index) => (
                                                <div key={index} className="mt-4">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="text-white-dark">Vehicle type</p>
                                                        </div>
                                                        <div>
                                                            <p>{vehicle.VehicleType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="text-white-dark">License Plate</p>
                                                        </div>
                                                        <div>
                                                            <p>{vehicle.LicensePlate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex">
                                                        <img src={vehicle.VehicleImageUrl} className="w-full rounded-md" alt={`Vehicle ${index + 1}`} />
                                                    </div>
                                                    <div className="mt-2 flex justify-between">
                                                        <div>
                                                            <p className="text-white-dark">Registration</p>
                                                        </div>
                                                        <div>
                                                            <p>{vehicle.Registration}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex">
                                                        <img src={vehicle.RegistrationImageUrl} className="w-full rounded-md" alt={`Registration ${index + 1}`} />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="mt-4 text-gray-500">No vehicles found.</p>
                                        )}
                                    </div>
                                    <div className="flex w-full justify-end">
                                        <Button variant={'destructive'} className="mt-4">
                                            <FaHandMiddleFinger className="mr-2" />
                                            Reject
                                        </Button>
                                        <Button variant={'default'} className="ml-3 mt-4">
                                            <IoCheckmarkDoneSharp className="mr-2" />
                                            Approve
                                        </Button>
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
