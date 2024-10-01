import IconMenuUsers from '@/components/icon/menu/icon-menu-users';
import { AiFillProduct } from 'react-icons/ai';
import { BiSolidCategory } from 'react-icons/bi';
import { FaUserGear, FaUsersGear } from 'react-icons/fa6';
import { MdBorderBottom, MdCampaign, MdOutlineDeliveryDining } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { BsCollectionFill } from 'react-icons/bs';
import { ImProfile } from 'react-icons/im';
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
                path: '/management/users',
            },
            {
                title: 'Customers',
                icon: <FaUsersGear className={classNamesForIconSidebar} />,
                path: '/management/customers',
            },

            {
                title: 'Products',
                icon: <AiFillProduct className={classNamesForIconSidebar} />,
                subMenu: [
                    {
                        title: 'Product List',
                        path: '/management/products',
                    },
                    {
                        title: 'Add Product',
                        path: '/management/products/addNewProduct',
                    },
                    {
                        title: 'Add Recommend Product',
                        path: '/management/products/addRecomentProduct',
                    },
                ],
            },
            {
                title: 'Collections',
                icon: <BsCollectionFill className={classNamesForIconSidebar} />,
                path: '/management/collections',
            },
            {
                title: 'Campaigns',
                icon: <MdCampaign className={classNamesForIconSidebar} />,
                path: '/management/campaigns',
            },
            {
                title: 'Categories',
                icon: <BiSolidCategory className={classNamesForIconSidebar} />,
                path: '/management/categories',
            },
            {
                title: 'Orders',
                icon: <MdBorderBottom className={classNamesForIconSidebar} />,
                subMenu: [
                    {
                        title: 'Payment',
                        path: '/management/orders/payment',
                    },
                    {
                        title: 'History',
                        path: '/management/orders/history',
                    },
                    {
                        title: 'Order Detail',
                        path: '/management/orders/order-detail/:id',
                    },
                    {
                        title: 'Order Tracking',
                        path: '/management/orders/order-tracking',
                    },
                    {
                        title: 'Boos mayf ddepj trai',
                        path: '/management/orders/boos-mayf-ddepj-trai',
                    },
                ],
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
