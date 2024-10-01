'use client';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconMinus from '@/components/icon/icon-minus';
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import IconMenuInvoice from '@/components/icon/menu/icon-menu-invoice';
import { getTranslation } from '@/i18n';
import { IRootState } from '@/store';
import { toggleSidebar } from '@/store/themeConfigSlice';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarItemData } from './sidebarItemData';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const isDarkMode = useSelector((state: IRootState) => state.themeConfig.isDarkMode);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            {isDarkMode ? (
                                <img className="ml-[5px] h-7 flex-none" src="/assets/images/logoDARK.svg" alt="logo" />
                            ) : (
                                <img className="ml-[5px] h-7 flex-none" src="/assets/images/logo.svg" alt="logo" />
                            )}

                            {/* <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">VRISTO</span> */}
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                    <div className="flex items-center">
                                        <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('dashboard')}</span>
                                    </div>

                                    <div className={currentMenu !== 'dashboard' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/">{t('sales')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/analytics">{t('analytics')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/finance">{t('finance')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/crypto">{t('crypto')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            {sidebarItemData &&
                                sidebarItemData.map((item) =>
                                    item.isHeader ? (
                                        <>
                                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                                <span>{t(item.title)}</span>
                                            </h2>
                                            <li className="nav-item">
                                                <ul>
                                                    {item.subMenu &&
                                                        item.subMenu.map((subItem) =>
                                                            subItem.subMenu ? (
                                                                <>
                                                                    <li className="menu nav-item">
                                                                        <button
                                                                            type="button"
                                                                            className={`${currentMenu === subItem.title ? 'active' : ''} nav-link group w-full`}
                                                                            onClick={() => toggleMenu(subItem.title)}
                                                                        >
                                                                            <div className="flex items-center">
                                                                                {subItem.icon}
                                                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                                                                                    {t(subItem.title)}
                                                                                </span>
                                                                            </div>

                                                                            <div className={currentMenu !== subItem.title ? '-rotate-90 rtl:rotate-90' : ''}>
                                                                                <IconCaretDown />
                                                                            </div>
                                                                        </button>

                                                                        <AnimateHeight duration={300} height={currentMenu === subItem.title ? 'auto' : 0}>
                                                                            <ul className="sub-menu text-gray-500">
                                                                                {subItem.subMenu.map((subSubItem) => (
                                                                                    <>
                                                                                        <li>
                                                                                            <Link href={subSubItem.path || ''}>{t(subSubItem.title)}</Link>
                                                                                        </li>
                                                                                    </>
                                                                                ))}
                                                                            </ul>
                                                                        </AnimateHeight>
                                                                    </li>
                                                                </>
                                                            ) : (
                                                                <li className="nav-item">
                                                                    <Link href={subItem.path || ''} className="group">
                                                                        <div className="flex items-center">
                                                                            {subItem.icon}
                                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                                                                                {t(subItem.title)}
                                                                            </span>
                                                                        </div>
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            </li>
                                        </>
                                    ) : null
                                )}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
