import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from 'react-icons/io';

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

interface SizeColorComponentProps {
    sizes: Size[];
    setSizes: React.Dispatch<React.SetStateAction<Size[]>>;
}

const SizeColorComponent = ({ sizes, setSizes }: SizeColorComponentProps) => {
    const addMoreSize = (e: any) => {
        e.preventDefault();
        setSizes([...sizes, { id: sizes.length + 1, price: 0, colors: [{ id: 1, colorName: '', quantity: 0 }] }]);
    };

    const addMoreColor = (sizeId: number) => {
        setSizes(
            sizes.map((size) =>
                size.id === sizeId
                    ? {
                          ...size,
                          colors: [...size.colors, { id: size.colors.length + 1, colorName: '', quantity: 0 }],
                      }
                    : size
            )
        );
    };

    const deleteSize = (sizeId: number) => {
        setSizes(sizes.filter((size) => size.id !== sizeId));
    };

    const deleteColor = (sizeId: number, colorId: number) => {
        setSizes(
            sizes.map((size) =>
                size.id === sizeId
                    ? {
                          ...size,
                          colors: size.colors.filter((color) => color.id !== colorId),
                      }
                    : size
            )
        );
    };

    const handleSizeChange = (sizeId: number, price: number) => {
        setSizes(sizes.map((size) => (size.id === sizeId ? { ...size, price } : size)));
    };

    const handleColorChange = (sizeId: number, colorId: number, key: keyof Color, value: string | number) => {
        setSizes(
            sizes.map((size) =>
                size.id === sizeId
                    ? {
                          ...size,
                          colors: size.colors.map((color) => (color.id === colorId ? { ...color, [key]: value } : color)),
                      }
                    : size
            )
        );
    };

    return (
        <div className="grid grid-cols-12 gap-4 py-4">
            {sizes.map((size) => (
                <div key={size.id} className="col-span-4 grid grid-cols-4  gap-4">
                    <div className="relative col-span-4 rounded border-2 border-dashed border-[#16a34a]">
                        <div className="absolute -top-3 left-2 flex items-center space-x-2 bg-white px-1">
                            <p className="  text-[14px]">Size - {size.id}</p>
                            <IoIosRemoveCircleOutline
                                className="mr-2 h-4 w-4"
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteSize(size.id);
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4 p-2">
                            <Label htmlFor={`price-${size.id}`} className="text-right">
                                Size
                            </Label>
                            <Input
                                id={`price-${size.id}`}
                                type="number"
                                value={size.price}
                                onChange={(e) => handleSizeChange(size.id, Number(e.target.value))}
                                placeholder="Type price here ..."
                                className="col-span-4"
                                required
                            />

                            {size.colors.map((color) => (
                                <div key={color.id} className="relative col-span-5 items-end rounded border-2 border-dashed border-[#16a34a]">
                                    <div className="absolute -top-3 left-2 flex items-center space-x-2 bg-white px-1">
                                        <p className="  text-[14px]">Color - {color.id}</p>
                                        <IoIosRemoveCircleOutline
                                            className="mr-2 h-4 w-4"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                deleteColor(size.id, color.id);
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-5 items-center gap-4 p-2">
                                        <Label htmlFor={`color-price-${size.id}-${color.id}`} className="text-right">
                                            Color
                                        </Label>
                                        <Input
                                            id={`color-price-${size.id}-${color.id}`}
                                            value={color.colorName}
                                            onChange={(e) => handleColorChange(size.id, color.id, 'colorName', e.target.value)}
                                            placeholder="Type price here ..."
                                            className="col-span-4"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-5 items-center gap-4 p-2">
                                        <Label htmlFor={`quantity-${size.id}-${color.id}`} className="text-right">
                                            Quantity
                                        </Label>
                                        <Input
                                            id={`quantity-${size.id}-${color.id}`}
                                            type="number"
                                            value={color.quantity}
                                            onChange={(e) => handleColorChange(size.id, color.id, 'quantity', Number(e.target.value))}
                                            placeholder="Type quantity here ..."
                                            className="col-span-4"
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="col-span-5 items-end"
                                onClick={(e) => {
                                    e.preventDefault();
                                    addMoreColor(size.id);
                                }}
                            >
                                <IoIosAddCircleOutline className="mr-2 h-4 w-4" /> Add more color
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            <Button variant="outline" className="col-span-4 w-full" onClick={addMoreSize}>
                <IoIosAddCircleOutline className="mr-2 h-4 w-4" /> Add more size
            </Button>
        </div>
    );
};

export default SizeColorComponent;
