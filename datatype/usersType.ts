// Vehicle type
type Vehicle = {
    id: number;
    licensePlate: string;
    vehicleType: string;
    isVerified: boolean;
    vehicleImageUrl: string;
    registrationImageUrl: string;
};

// DriverInfo type
type DriverInfo = {
    id: number;
    licenseNumber: string;
    licenseImageUrl: string;
    verified: boolean;
    vehicles: Vehicle[];
};

// Result type
export type User = {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    profileImageUrl: string;
    studentIdCardUrl: string;
    role: string;
    studentId: string;
    verified: boolean;
    verificationStatus: string;
    isMailValid: boolean;
    driverInfo: DriverInfo | null;
    wallet: any | null;
};
