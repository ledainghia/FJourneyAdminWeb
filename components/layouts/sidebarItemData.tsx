import IconMenuUsers from '@/components/icon/menu/icon-menu-users';
import { AiFillProduct } from 'react-icons/ai';
import { BiSolidCategory, BiTrip } from 'react-icons/bi';
import { BsCollectionFill } from 'react-icons/bs';
import { FaUserGear } from 'react-icons/fa6';
import { ImProfile } from 'react-icons/im';
import { MdBorderBottom, MdCampaign, MdMyLocation } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { TbAdjustmentsCancel } from 'react-icons/tb';
// Define the type for a sidebar item
export type sidebarItem = {
    title: string;
    isHeader: boolean;
    subMenu?: SubMenuItem[];
    path?: string;
};

// Define the type for a sub-menu item
export type SubMenuItem = {
    title: string;
    icon?: JSX.Element;
    path?: string;
    subMenu?: SubMenuItem[];
};

// Define class names for the icon in the sidebar
export const classNamesForIconSidebar: string = 'shrink-0 group-hover:!text-primary';

// Define the sidebar item data
export const sidebarItemData: sidebarItem[] = [
    {
        title: 'Bảng điều khiển',
        isHeader: false,
        path: '/',
    },
    {
        title: 'Quản lý',
        isHeader: true,
        subMenu: [
            {
                title: 'Người dùng',
                icon: <IconMenuUsers className={classNamesForIconSidebar} />,
                subMenu: [
                    {
                        title: 'Danh sách người dùng',
                        path: '/management/users',
                    },
                    {
                        title: 'Xác minh tài xế',
                        path: '/management/users/driverVerify',
                    },
                ],
            },
            {
                title: 'Danh sách thanh toán',
                icon: <BsCollectionFill className={classNamesForIconSidebar} />,
                path: '/management/payments',
            },
            {
                title: 'Yêu cầu chuyến đi',
                icon: <BiTrip className={classNamesForIconSidebar} />,
                path: '/management/trip-requests',
            },
            {
                title: 'Khu vực',
                icon: <MdMyLocation className={classNamesForIconSidebar} />,
                path: '/management/zones',
            },

            {
                title: 'Lý do hủy',
                icon: <TbAdjustmentsCancel className={classNamesForIconSidebar} />,
                path: '/management/cancel-reason',
            },
        ],
    },
    {
        title: 'Hồ sơ',
        isHeader: true,
        subMenu: [
            {
                title: 'Đổi mật khẩu',
                icon: <RiLockPasswordFill className={classNamesForIconSidebar} />,
                path: '/profile/change-password',
            },
            {
                title: 'Chi tiết hồ sơ',
                icon: <ImProfile className={classNamesForIconSidebar} />,
                path: '/profile/profile-detail',
            },
            {
                title: 'Cài đặt hồ sơ',
                icon: <FaUserGear className={classNamesForIconSidebar} />,
                path: '/profile/profile-setting',
            },
        ],
    },
];
