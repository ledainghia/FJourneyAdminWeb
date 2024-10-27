'use client';

import IconMail from '@/components/icon/icon-mail';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { z } from 'zod';
import { authAPI } from '@/config/axios/axios';
import { userLogin } from '@/datatype/userType';
import { Loader2 } from 'lucide-react';
import { Bounce, toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useMutation } from '@tanstack/react-query';

const FormSchema = z.object({
    email: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    password: z.string().min(1, {
        message: 'Password must be at least 6 characters.',
    }),
    remember: z.string(),
});

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [remember, setRemember] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(event.target.checked);
    };

    const loginAction = useMutation({
        mutationFn: (data: userLogin) => authAPI.login(data),
        onSuccess: (data) => {
            toast.success('Login successfully.');
            if (remember) {
                localStorage.setItem('user', JSON.stringify(data.data.result));
            } else {
                sessionStorage.setItem('user', JSON.stringify(data.data.result));
            }
            router.push('/');
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred.');
        },
    });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: 'false',
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const user: userLogin = {
            email: data.email,
            password: data.password,
            role: 'admin',
        };
        loginAction.mutate(user);
    }

    return (
        <Form {...form}>
            <form className="space-y-5 dark:text-white" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input placeholder="Email" {...field} />
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
                    disabled={loginAction.isPending}
                    type="submit"
                    className="btn !mt-6 w-full border-0 bg-gradient-to-r from-primary to-secondary uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                >
                    {loginAction.isPending ? (
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
