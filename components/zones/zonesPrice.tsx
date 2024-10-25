'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Select from 'react-select';
import { Zone } from '@/datatype/manageType';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { managementAPI } from '@/config/axios/axios';
import { Label } from '../ui/label';
import { ZonePrices as ZonePriceTp } from '@/datatype/zoneType';
import { toast } from 'react-toastify';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '../ui/menubar';
import { er } from '@fullcalendar/core/internal-common';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import { Select as Select2, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ghost } from 'sortablejs';
import { da } from '@faker-js/faker/.';
import Swal from 'sweetalert2';
const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

type ZonePricesProps = {
    zonePrices: Zone[];
};
type ZoneOption = {
    value: string;
    label: string;
};

// Schema kiểm tra dữ liệu của form
const FormSchema = z
    .object({
        fromZone: z.string().refine((val) => val !== '', { message: 'Please select a "From" zone.' }),
        toZone: z.string().refine((val) => val !== '', { message: 'Please select a "To" zone.' }),
        price: z
            .string()
            .transform((val) => val.replace(/\./g, '')) // Xóa dấu chấm trước khi kiểm tra
            .refine((val) => /^\d+$/.test(val), { message: 'Price must be a number.' })
            .refine((val) => Number(val) > 0, { message: 'Price must be greater than 0.' }),
        id: z.string().optional(),
    })
    .superRefine((values, ctx) => {
        if (values.fromZone === values.toZone) {
            ctx.addIssue({
                path: ['toZone'],
                message: "The 'From' zone cannot be the same as the 'To' zone.",
                code: 'unrecognized_keys',
                keys: ['fromZone', 'toZone'],
            });
        } else if (values.fromZone === '') {
            ctx.addIssue({
                path: ['fromZone'],
                message: 'Please select a "From" zone.',
                code: 'unrecognized_keys',
                keys: ['fromZone'],
            });
        } else if (values.toZone === '' || !values.toZone || values.toZone === undefined || values.toZone === null) {
            ctx.addIssue({
                path: ['toZone'],
                message: 'Please select a "To" zone.',
                code: 'unrecognized_keys',
                keys: ['toZone'],
            });
        }
    });

type FormSchemaType = z.infer<typeof FormSchema>;

const ZonePrices = ({ zonePrices: znPrices }: ZonePricesProps) => {
    const queryClient = useQueryClient();

    const [zonePrices, setZonePrices] = useState<ZonePriceTp[]>([]);
    const [zoneOptions, setZoneOptions] = useState<ZoneOption[]>([]);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fromZone: '',
            toZone: '',
            price: '',
            id: '',
        },
    });

    const {
        data: pricesTb,
        error: erPricesTb,
        isLoading: isLoadingPricesTb,
    } = useQuery({
        queryKey: ['zonePrices'],
        queryFn: () => {
            return managementAPI.getPricesTable();
        },
    });

    const addPricesTable = useMutation({
        mutationFn: (data: ZonePriceTp) => managementAPI.createPricesTable(data),
        onSettled: () => {
            // Thực hiện lại query để cập nhật dữ liệu trên UI
            queryClient.invalidateQueries({ queryKey: ['zonePrices'] });
        },
        onSuccess: () => {
            form.reset();
            toast.success('Add new route successfully.');
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message || 'An error occurred.');
        },
    });

    function onSubmit(data: FormSchemaType) {
        console.table(data);
        const dataSubmit = {
            fromZoneId: data.fromZone,
            toZoneId: data.toZone,
            unitPrice: Number(data.price.replace(/\./g, '')),
        };
        addPricesTable.mutate(dataSubmit);
    }

    const updatePricesTable = useMutation({
        mutationFn: (data: ZonePriceTp) => managementAPI.updatePricesTable(data),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['zonePrices'] });
        },
        onSuccess: () => {
            form.reset();
            toast.success('Update route successfully.');
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message || 'An error occurred.');
        },
    });

    function updateZonePriceSubmit(data: FormSchemaType) {
        console.log('cc');
        console.table(data);
        const dataSubmit = {
            id: data.id,
            fromZoneId: data.fromZone,
            toZoneId: data.toZone,
            unitPrice: Number(data.price.replace(/\./g, '')),
        };
        updatePricesTable.mutate(dataSubmit);
    }
    useEffect(() => {
        if (pricesTb && pricesTb.data.result.items) {
            setZonePrices(pricesTb.data.result.items);
        }
    }, [pricesTb]);

    useEffect(() => {
        if (znPrices) {
            setZoneOptions(znPrices.map((zone) => ({ value: String(zone.id), label: zone.zoneName })));
        }
    }, [znPrices]);

    const zoneLookup = useMemo(() => {
        return znPrices.reduce((acc, zone) => {
            if (zone.id !== undefined) {
                acc[zone.id] = zone.zoneName;
            }
            return acc;
        }, {} as Record<string, string>);
    }, [znPrices]);

    const deletePricesTable = useMutation({
        mutationFn: (id: string) => managementAPI.deletePricesTable(id),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['zonePrices'] });
        },
        onSuccess: () => {
            toast.success('Delete route successfully.');
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message || 'An error occurred.');
        },
    });

    const showAlert = async (id: string | undefined, action: string) => {
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
                text: `You want to ${action} with id: ${id}!`,
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
                    deletePricesTable.mutate(id);
                    swalWithBootstrapButtons.fire('Deleted!', 'Your file has been deleted.', 'success');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('Cancelled', 'No change', 'info');
                }
            });
    };

    return (
        <>
            {zonePrices?.map((zonePrice) => (
                <Menubar key={zonePrice.id} className="my-0 mt-3 border-none p-0">
                    <MenubarMenu>
                        <MenubarTrigger className="flex w-full justify-between gap-3 p-0">
                            <Button variant={'outline'} className=" rounded-md border-dashed border-black ">
                                <p>{zoneLookup[zonePrice.fromZoneId]}</p>
                            </Button>
                            <div className="relative mx-2 flex flex-grow items-center">
                                <div className="animated-dash-line relative h-0.5 w-full">
                                    <span className="absolute left-1/2 top-[-10px] -translate-x-1/2 transform bg-white px-2 text-sm font-semibold text-gray-600">{zonePrice.unitPrice} VND</span>
                                </div>
                            </div>
                            <Button variant={'outline'} className=" rounded-md border-dashed border-black">
                                <p>{zoneLookup[zonePrice.toZoneId]}</p>
                            </Button>
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem asChild>
                                <Dialog>
                                    <DialogTrigger className="flex w-full">
                                        <Button
                                            onClick={() => {
                                                form.setValue('id', zonePrice.id?.toString());
                                                form.setValue('fromZone', zonePrice.fromZoneId.toString());
                                                form.setValue('toZone', zonePrice.toZoneId.toString());
                                                form.setValue('price', zonePrice.unitPrice.toLocaleString('vi-VN'));
                                            }}
                                            variant={'ghost'}
                                            className="flex w-full justify-start"
                                        >
                                            <MdEdit className="mr-2" /> Edit route
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit route with id: {zonePrice.id}</DialogTitle>
                                            <DialogDescription>Please change route information and check it before submit!</DialogDescription>
                                        </DialogHeader>

                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(updateZonePriceSubmit)} className="space-y-6">
                                                <FormField control={form.control} name="id" render={({ field }) => <input type="hidden" {...field} />} />
                                                {/* From Zone */}
                                                <FormField
                                                    control={form.control}
                                                    name="fromZone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>From Zone</FormLabel>
                                                            <Select2 onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select from zone" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {zoneOptions.map((option) => (
                                                                        <SelectItem key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select2>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* To Zone */}
                                                <FormField
                                                    control={form.control}
                                                    name="toZone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>To Zone</FormLabel>
                                                            <Select2 onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select to zone" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {zoneOptions.map((option) => (
                                                                        <SelectItem key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select2>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Price */}
                                                <FormField
                                                    control={form.control}
                                                    name="price"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Price</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter price"
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value.replace(/\./g, '');
                                                                        field.onChange(Number(value).toLocaleString('vi-VN'));
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <DialogFooter>
                                                    <DialogClose>
                                                        <Button variant={'link'} className="rounded-md">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button disabled={addPricesTable.isPending} type="submit" className="rounded-md">
                                                        {addPricesTable.isPending ? 'Saving...' : 'Save'}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                                <Button onClick={() => showAlert(zonePrice.id, 'Delete')} variant={'destructive'} className="flex w-full justify-start">
                                    <MdDeleteOutline className="mr-2" /> Delete route
                                </Button>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            ))}
            {zonePrices?.length === 0 && (
                <div className="mt-5 flex justify-center">
                    <p>No data</p>
                </div>
            )}

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={'outline'} className=" mt-5 w-full rounded-md">
                        Add new route
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add new route</DialogTitle>
                        <DialogDescription>Please fill in the details for the new route.</DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* From Zone */}
                            <FormField
                                control={form.control}
                                name="fromZone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Zone</FormLabel>
                                        <FormControl>
                                            <Select options={zoneOptions} placeholder="Select from zone" onChange={(option) => field.onChange(option?.value)} className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* To Zone */}
                            <FormField
                                control={form.control}
                                name="toZone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To Zone</FormLabel>
                                        <FormControl>
                                            <Select options={zoneOptions} placeholder="Select to zone" onChange={(option) => field.onChange(option?.value)} className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Price */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter price"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\./g, '');
                                                    field.onChange(Number(value).toLocaleString('vi-VN'));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose>
                                    <Button variant={'link'} className="rounded-md">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button disabled={addPricesTable.isPending} type="submit" className="rounded-md">
                                    {addPricesTable.isPending ? 'Adding...' : 'Add'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ZonePrices;
