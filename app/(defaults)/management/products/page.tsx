'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { managementAPI } from '@/config/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AiOutlineProduct } from 'react-icons/ai';
import { GoKebabHorizontal } from 'react-icons/go';
import { toast } from 'react-toastify';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
type Product = {
    id: string;
    size: number;
    productName: string;
    gender: string;
    description: string;
    price: number;
    status: string;
    imageUrl: string;
    campaign: {
        id: string;
        campaignName: string;
    };
    stockQuantity: number;
    category: {
        id: string;
        categoryName: string;
    };
    color: string;
    createDate: Date;
};

const Categories = () => {
    const [search, setSearch] = useState('');

    const [products, setProducts] = useState<Product[] | null>(null);
    const [productFilter, setProductFilter] = useState<Product[] | any>(null);

    const [filter, setFilter] = useState('' as string);

    const { data, error, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => managementAPI.getProducts(filter),
    });

    useEffect(() => {
        if (error || data?.data.success === false) {
            toast.error('Error fetching data users');
        } else {
            setProducts(data?.data?.result?.products);
            setProductFilter(data?.data?.result?.products);
        }
    }, [data]);

    useEffect(() => {
        setProductFilter(() => {
            return products?.filter((item) => {
                return Object.values(item).some((value) => {
                    if (typeof value === 'string' || typeof value === 'number') {
                        return value.toString().toLowerCase().includes(search.toLowerCase());
                    }
                    return false;
                });
            });
        });
    }, [search]);

    if (isLoading) {
        return (
            <div className="mt-52 flex h-full w-full justify-center align-middle">
                <span className="m-auto mb-10 inline-block h-14 w-14 animate-[spin_2s_linear_infinite] rounded-full border-8 border-[#f1f2f3] border-l-primary border-r-primary align-middle"></span>
            </div>
        );
    }

    return (
        <>
            <div className="panel">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Management</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Products list</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="panel mt-6 ">
                <div className="mb-4.5 flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="flex items-center gap-5 ltr:mr-auto rtl:ml-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex-1 md:flex-auto">
                            <Button variant={'outline'}>
                                <AiOutlineProduct className="mr-2 h-4 w-4" /> <Link href="/management/products/addNewProduct">Add new product</Link>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                    {productFilter && productFilter.length > 0 ? (
                        productFilter.map((product: any) => (
                            <Card className="col-span-12 rounded-t-lg lg:col-span-6 xl:col-span-4 2xl:col-span-3" key={product.id}>
                                <CardHeader className="rounded-t-lg p-0 pb-5">
                                    <div className="relative w-full">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <GoKebabHorizontal className="absolute right-4 top-2 h-6 w-6 text-white" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Billing</DropdownMenuItem>
                                                <DropdownMenuItem>Team</DropdownMenuItem>
                                                <DropdownMenuItem>Subscription</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Badge variant={product.status === 'Active' ? 'default' : 'destructive'} className={`absolute left-2 top-2 rounded-md`}>
                                            {product.status}
                                        </Badge>
                                        <img alt={product.productName} className="h-[180px] w-full rounded-t-lg object-cover " src={product.imageUrl} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col">
                                        <div className="flex gap-2">
                                            <CardTitle>{product.productName}</CardTitle>
                                        </div>
                                        <CardDescription className="mt-2">{product.description}</CardDescription>
                                        <Separator className="mt-2" />
                                        <div className="mt-4 grid grid-cols-4 gap-3">
                                            <div className="col-span-2">
                                                <p>ID:</p>
                                                <p>Stock quantity:</p>
                                                <p>Gender:</p>
                                                <p>Size:</p>
                                                <p>Price:</p>
                                                <p>Color:</p>
                                                <p>Category:</p>
                                                <p>Campaign:</p>
                                            </div>
                                            <div className="col-span-2 font-bold">
                                                <p>{product.id}</p>
                                                <p>{product.stockQuantity}</p>
                                                <p>{product.gender}</p>
                                                <p>{product.size}</p>
                                                <p>{product.price}</p>
                                                <p>{product.color}</p>
                                                <p>{product.category.categoryName}</p>
                                                <p>{product.campaign.campaignName}</p>
                                            </div>
                                            <Separator className="col-span-4" />

                                            <div className="relative col-span-4 mt-1 flex flex-col gap-2 rounded-sm  border-2 border-dashed border-[#16a34a] py-3">
                                                <p className="absolute -top-4 left-0 bg-white p-1">Recommend Product</p>
                                                {product.productsRecommendation && product.productsRecommendation.length > 0 ? (
                                                    product.productsRecommendation.map((pr: any) => (
                                                        <Badge className="rounded-sm" variant={'outline'}>
                                                            {pr.productName} - {pr.size} - {pr.color}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Badge className="rounded-sm" variant={'outline'}>
                                                        No Recommend Product
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-12">No Products Found</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Categories;
