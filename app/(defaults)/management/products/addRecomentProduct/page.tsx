'use client';
import { Button } from '@/components/ui/button';

import { IoIosAddCircleOutline } from 'react-icons/io';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Label } from '@/components/ui/label';

import { managementAPI } from '@/config/axios/axios';
import { Product } from '@/datatype/productType';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import 'react-form-wizard-component/dist/style.css';
import { co, s } from '@fullcalendar/core/internal-common';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface Size {
    id: number;
    price: number;
    colors: Color[];
}

interface Color {
    id: number;
    colorName: string;
    quantity: number;
}

const AddRecommentProduct = () => {
    const [productList, setProductList] = useState<any[]>([]);
    const [ctMapOption, setCtMapOption] = useState<any[]>([]);
    const [productChoice, setProductChoice] = useState<string>('');
    const [productRecomment, setProductRecomment] = useState<any[]>([]);

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => managementAPI.getProducts(''),
    });

    useEffect(() => {
        if (products) {
            console.log('categories', products.data.result?.products);
            const ct = products.data.result?.products;
            const ctFilter = ct.filter((c: any) => c.status === 'Active');
            setCtMapOption(ctFilter.map((c: any) => ({ value: c.id, label: c.productName + ' - ' + c.id })));
            setProductList(ctFilter.map((c: any) => ({ value: c.id, label: c.productName + ' - ' + c.id })));
        }
    }, [products]);

    const handleChangeProduct = (value: any) => {
        if (value) {
            setProductChoice(value);
            setCtMapOption(ctMapOption.filter((c: any) => c.value !== value));
        }
    };

    const mutation = useMutation({
        mutationFn: async () => {
            const data = {
                productId: productChoice,
                recommendedProductIds: productRecomment,
            };

            try {
                const re = await managementAPI.addRecommentProduct(data);
                if (re.data.success) toast.success('Add recomment product success');
                else {
                    toast.error('Add recomment product failed');
                }
            } catch (error: any) {
                console.log('error', error);
                toast.error(error.response.data.result.message);
            } finally {
                return data;
            }
        },
    });

    return (
        <>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">Management</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/management/products">Products</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Add product recommentation</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="panel mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                    <div className=" col-span-1 flex flex-col gap-2">
                        <Label htmlFor="productName">Choice product you wanna add recommentation</Label>
                        <Select
                            name="productRecomment"
                            onChange={(e) => handleChangeProduct(e.value)}
                            options={productList}
                            className="basic-multi-select"
                            isLoading={isLoading}
                            classNamePrefix="select"
                            placeholder={'Select more product recomment...'}
                        />
                    </div>

                    <div className="col-span-1 flex flex-col gap-2">
                        <Label htmlFor="productRecomment">Add with</Label>
                        <Select
                            isMulti
                            name="productRecomment"
                            onChange={(e) => setProductRecomment(e.map((c: any) => c.value))}
                            options={ctMapOption}
                            className="basic-multi-select"
                            isLoading={isLoading}
                            classNamePrefix="select"
                            placeholder={'Select more product recomment...'}
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button
                        disabled={mutation.isPending || productRecomment.length === 0 || !productChoice}
                        onClick={() => {
                            mutation.mutate();
                        }}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                            </>
                        ) : (
                            'Add recomment product'
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AddRecommentProduct;
