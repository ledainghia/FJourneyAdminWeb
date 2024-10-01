'use client';

import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Bounce, toast } from 'react-toastify';
import { Input } from '../ui/input';
import { userLogin } from '@/datatype/userType';
import { authAPI } from '@/config/axios/axios';
import { set } from 'lodash';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { getUser } from '@/helper/checkuser';

const FormSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    password: z.string().min(5, {
        message: 'Password must be at least 6 characters.',
    }),
    remember: z.string(),
});

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [logginLoading, setLogginLoading] = useState(false);
    const [remember, setRemember] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(event.target.checked);
    };
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            password: '',
            remember: 'false',
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const user: userLogin = {
            username: data.username,
            password: data.password,
        };
        setLogginLoading(true);
        authAPI
            .login(user)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    toast.success('Login success', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                        transition: Bounce,
                    });

                    if (remember) {
                        localStorage.setItem('user', JSON.stringify(res.data.result));
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(res.data.result));
                    }
                    router.push('/');
                }
            })
            .catch((err) => {
                console.log(err);
                console.table(data);
                toast.error(err.response.data.result.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                    transition: Bounce,
                });
            })
            .finally(() => {
                setLogginLoading(false);
            });
    }

    return (
        <Form {...form}>
            <form className="space-y-5 dark:text-white" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input placeholder="Username" {...field} />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 ">
                                        <IconMail fill={true} />
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage className="text-danger" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input placeholder="*********" type={isPasswordVisible ? 'text' : 'password'} {...field} />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                        <button type="button" onClick={togglePasswordVisibility} className="focus:outline-none">
                                            {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                                        </button>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <label className="flex cursor-pointer items-center">
                        <input name="remember" type="checkbox" className="form-checkbox bg-white dark:bg-black" checked={remember} onChange={handleCheckboxChange} />
                        <span className="text-white-dark">Remember me</span>
                    </label>
                </div>
                <Button
                    disabled={logginLoading}
                    type="submit"
                    className="btn !mt-6 w-full border-0 bg-gradient-to-r from-primary to-secondary uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                >
                    {logginLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        'Sign in'
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default ComponentsAuthLoginForm;
