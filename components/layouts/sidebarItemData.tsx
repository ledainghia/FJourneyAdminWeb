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
        title: 'Dashboard',
        isHeader: false,
        path: '/',
    },
    {
        title: 'Management',
        isHeader: true,
        subMenu: [
            {
                title: 'Users',
                icon: <IconMenuUsers className={classNamesForIconSidebar} />,
                subMenu: [
                    {
                        title: 'User List',
                        path: '/management/users',
                    },
                    {
                        title: 'Verify Driver',
                        path: '/management/users/driverVerify',
                    },
                ],
            },
            {
                title: 'Trip requests',
                icon: <BiTrip className={classNamesForIconSidebar} />,
                path: '/management/trip-requests',
            },
            {
                title: 'Zones',
                icon: <MdMyLocation className={classNamesForIconSidebar} />,
                path: '/management/zones',
            },

            {
                title: 'Cancel Reason',
                icon: <TbAdjustmentsCancel className={classNamesForIconSidebar} />,
                path: '/management/cancel-reason',
            },
        ],
    },
    {
        title: 'Profile',
        isHeader: true,
        subMenu: [
            {
                title: 'Change Password',
                icon: <RiLockPasswordFill className={classNamesForIconSidebar} />,
                path: '/profile/change-password',
            },
            {
                title: 'Profile Detail',
                icon: <ImProfile className={classNamesForIconSidebar} />,
                path: '/profile/profile-detail',
            },
            {
                title: 'Profile Setting',
                icon: <FaUserGear className={classNamesForIconSidebar} />,
                path: '/profile/profile-setting',
            },
        ],
    },
];
