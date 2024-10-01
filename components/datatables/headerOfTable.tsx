import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Mail } from 'lucide-react';
import { RiUserAddLine } from 'react-icons/ri';

type headerOfTableProps = {
    search: string;
    setSearch: (value: string) => void;
};
export default function HeaderOfTable({ search, setSearch }: headerOfTableProps) {
    return (
        <div className="mb-4.5 flex flex-col gap-5 md:flex-row md:items-center">
            <div className="ltr:mr-auto rtl:ml-auto">
                <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-5">
                <div className="flex-1 md:flex-auto">
                    <Button variant={'outline'}>
                        <RiUserAddLine className="mr-2 h-4 w-4" /> Add new user
                    </Button>
                </div>
            </div>
        </div>
    );
}
