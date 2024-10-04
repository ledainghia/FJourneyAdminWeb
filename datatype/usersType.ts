export type Vehicle = {
    VehicleType: string;
    LicensePlate: string;
    VehicleImageUrl: string;
    Registration: string;
    RegistrationImageUrl: string;
};

// Định nghĩa type cho User
export type User = {
    UserId: string;
    Name: string;
    Email: string;
    PhoneNumber: string;
    ProfileImageUrl: string;
    StudentIdCardUrl: string;
    Role: string;
    StudentId: string;
    LicenseNumber: string;
    LicenseImageUrl: string;
    Vehicles: Vehicle[];
    DriverId: string;
    createTime: Date; // Thời gian tạo user
};
