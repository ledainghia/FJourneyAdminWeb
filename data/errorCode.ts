import { label } from 'yet-another-react-lightbox';

export type ErrorCodeType = {
    label: string;
    value: number;
};

const errorCodes: ErrorCodeType[] = [
    { label: 'SUCCESS', value: 0 },
    { label: "Driver's license number does not match driver's license image", value: 1 },
    { label: "Driver's license image is blurry or incorrect", value: 2 },
    { label: 'The license plate number does not match the vehicle registration image', value: 3 },
    { label: 'Vehicle type does not match vehicle registration image', value: 4 },
    { label: 'Vehicle registration number does not match vehicle registration image', value: 5 },
    { label: 'Vehicle image is blurry or incorrect', value: 6 },
    { label: 'Vehicle registration image is blurred or incorrect', value: 7 },
];

export default errorCodes;
