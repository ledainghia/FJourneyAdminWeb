import ComponentsAuthLoginForm from '@/components/auth/components-auth-login-form';
import LanguageDropdown from '@/components/language-dropdown';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Login Cover',
};

const CoverLogin = () => {
    return (
        <div className="relative flex max-h-screen items-center justify-center  bg-cover bg-center bg-no-repeat  dark:bg-[#060818]">
            <div className="relative flex h-[100vh]  w-full grid-cols-2 flex-col justify-between overflow-hidden rounded-md bg-white/60  backdrop-blur-lg dark:bg-black/50 lg:flex-row lg:gap-5 xl:gap-0">
                <div className="relative hidden w-full items-center justify-center bg-gradient-to-r from-primary to-secondary p-5 lg:inline-flex  xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                    <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent xl:w-16 ltr:-right-10 ltr:bg-gradient-to-r ltr:xl:-right-20 rtl:-left-10 rtl:bg-gradient-to-l rtl:xl:-left-20"></div>
                    <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                        <Link href="/" className="ms-10 block w-48 lg:w-72">
                            <img src="/assets/images/logoDARK.svg" alt="Logo" className="w-full" />
                        </Link>
                        <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                            <img src="/assets/images/auth/login.svg" alt="Cover Image" className="w-full" />
                        </div>
                    </div>
                </div>
                <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 ">
                    <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                        <Link href="/" className="block w-8 lg:hidden">
                            <img src="/assets/images/logoDARK.svg" alt="Logo" className="mx-auto w-10" />
                        </Link>
                        <LanguageDropdown className="ms-auto w-max" />
                    </div>
                    <div className="w-full max-w-[440px] lg:mt-16">
                        <div className="mb-10">
                            <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                            <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                        </div>
                        <ComponentsAuthLoginForm />
                    </div>
                    <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()} CHALS All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default CoverLogin;
