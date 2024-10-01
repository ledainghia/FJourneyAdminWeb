'use client';
import { Button } from '@/components/ui/button';

import { IoIosArrowBack } from 'react-icons/io';

import { Label } from '@/components/ui/label';
import { IoColorPaletteOutline, IoResizeSharp } from 'react-icons/io5';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SizeColorComponent from '../SizeColorComponent';
import { ChangeEvent, useEffect, useState } from 'react';
import { Product, ProductSize } from '@/datatype/productType';
import FormWizard from 'react-form-wizard-component';
import 'react-form-wizard-component/dist/style.css';
import IconBell from '@/components/icon/icon-bell';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { managementAPI } from '@/config/axios/axios';
import { s } from '@fullcalendar/core/internal-common';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const AddNewProductPage = () => {
    const [productName, setProductName] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [campaignId, setCampaignId] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [sizes, setSizes] = useState<Size[]>([{ id: 1, price: 0, colors: [{ id: 1, colorName: '', quantity: 0 }] }]);
    const [imageBase64, setImageBase64] = useState<string>('');
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [campaignsList, setCampaignsList] = useState<any[]>([]);

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => managementAPI.getCategories(''),
    });

    const { data: campaigns } = useQuery({
        queryKey: ['campaigns'],
        queryFn: () => managementAPI.getCampaigns(''),
    });

    useEffect(() => {
        if (categories) {
            console.log('categories', categories.data.result?.categories);
            const ct = categories.data.result?.categories;
            const ctFilter = ct.filter((c: any) => c.status === 'Active');
            setCategoriesList(ctFilter);
        }
    }, [categories]);

    useEffect(() => {
        if (campaigns) {
            console.log('campaigns', campaigns.data.result?.campaigns);
            const cmp = campaigns.data.result?.campaigns;
            const cmpFilter = cmp.filter((c: any) => c.status === 'Active');
            setCampaignsList(cmpFilter);
        }
    }, [campaigns]);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            console.log('reader.result', reader.result);
            setImageBase64(reader.result as string);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = () => {
        if (imageBase64 === '' || productName === '' || description === '' || !campaignId || !categoryId || gender === '' || price === 0) {
            toast.error('Please fill all the required fields');
            return;
        }

        console.log('productName', productName);
        console.log('description', description);
        console.log('imageBase64', imageBase64);
        const data: Product = {
            productName,
            categoryId: categoryId,
            campaignId: campaignId,
            description,
            gender,
            price,
            imageBase64,
            status: 'Active',
            productSizes: sizes.map((size) => {
                return {
                    size: size.id.toString(),
                    colors: size.colors.map((color) => {
                        return {
                            colorName: color.colorName,
                            quantity: color.quantity,
                        };
                    }),
                };
            }),
        };
        console.log('data', data);

        managementAPI
            .postProduct(data)
            .then((res) => {
                console.log('res', res);
                if (res.data.success) {
                    toast.success('Product added successfully');
                } else {
                    toast.error('Failed to add product');
                }
            })
            .catch((err) => {
                console.log('err', err);
                toast.error('Failed to add product');
            });
    };

    return (
        <>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Management</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/management/products">Products</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Add new product</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="panel mt-6">
                <FormWizard shape="circle" color="#16a34a" stepSize="xs" onComplete={handleAdd}>
                    <FormWizard.TabContent title="Base information" icon={<IoResizeSharp />}>
                        {/* Add your form inputs and components for the frst step */}
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="productName" className="text-right">
                                    Product Name
                                </Label>
                                <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Type product name here ..." className="col-span-3" required />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    placeholder="Type description here ..."
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="image" className="text-right">
                                    Image Upload
                                </Label>
                                <Input id="image" type="file" onChange={handleImageUpload} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="gender" className="text-right">
                                    Gender
                                </Label>
                                <Input id="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Type gender here ..." className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                    Price
                                </Label>
                                <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Type price here ..." className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                    Category
                                </Label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {categoriesList.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.categoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                    Campaign
                                </Label>
                                <Select value={campaignId} onValueChange={setCampaignId}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a campaign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {campaignsList.map((campaign) => (
                                                <SelectItem key={campaign.id} value={campaign.id}>
                                                    {campaign.campaignName}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </FormWizard.TabContent>
                    <FormWizard.TabContent title="Additional Color & Size" icon={<IoColorPaletteOutline />}>
                        <SizeColorComponent sizes={sizes} setSizes={setSizes} />
                    </FormWizard.TabContent>
                </FormWizard>
            </div>
        </>
    );
};

export default AddNewProductPage;
