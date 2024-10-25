// components/ZonesList.tsx

import { useState, useRef } from 'react';
import { Zone } from '@/datatype/manageType';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input, Textarea } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { IoAddCircleOutline } from 'react-icons/io5';
import { Label } from '@radix-ui/react-label';
import DataTableCustom from '@/components/datatables/data-table';

type ZonesListProps = {
    zones: Zone[];
    columns: any;
    isLoading: boolean;
    setPage: (page: number) => void;
    page: number;
    pageSize: number;
    totalRecords: number;
    search: string;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onSearchChange: (value: string) => void;
    onCreateZone: (zone: Zone) => void;
};

const ZonesList = ({ zones, columns, isLoading, page, pageSize, totalRecords, setPage, search, onPageChange, onPageSizeChange, onSearchChange, onCreateZone }: ZonesListProps) => {
    const [zoneName, setZoneName] = useState('');
    const [description, setDescription] = useState<string | undefined>('');

    return (
        <div>
            <div className="mb-4.5 flex flex-col gap-5 md:flex-row md:items-center">
                <div className="ltr:mr-auto rtl:ml-auto">
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
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
                                <Input id="zoneName" value={zoneName} onChange={(e) => setZoneName(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} id="description" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button variant={'link'}>Cancel</Button>
                                <Button
                                    onClick={() => {
                                        onCreateZone({ zoneName, description });
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
                rowData={zones}
                isFetching={isLoading}
                columns={columns}
                search={search}
                setSearch={onSearchChange}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                totalRecords={totalRecords}
            />
        </div>
    );
};

export default ZonesList;
