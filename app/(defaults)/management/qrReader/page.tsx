'use client';
import { Scanner } from '@yudiel/react-qr-scanner';
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

export default function page() {
    const [data, setData] = useState('No result');
    return (
        <div>
            <Scanner
                onScan={(result) => {
                    console.log(result);
                    setData(result[0].rawValue);
                }}
            />
            <p>{data}</p>
        </div>
    );
}
