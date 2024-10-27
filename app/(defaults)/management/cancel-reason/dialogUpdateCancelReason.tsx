import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaRegEdit } from 'react-icons/fa';
import { CancellationReasons } from '@/datatype/cancellationReasons';
import { managementAPI } from '@/config/axios/axios';
import { toast } from 'react-toastify';
import { set } from 'lodash';
import { useState } from 'react';

const FormSchema = z.object({
    reasonId: z.string().optional(),
    content: z.string().nonempty("Content can't be empty"),
});

type FormType = z.infer<typeof FormSchema>;

interface UpdateCancelReasonDialogProps {
    reasonId: string;
    content: string;
}

const UpdateCancelReasonDialog: React.FC<UpdateCancelReasonDialogProps> = ({ reasonId, content }) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<FormType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            reasonId,
            content,
        },
    });

    const changeCancelReason = useMutation({
        mutationFn: (data: CancellationReasons) => managementAPI.updateCancelReason(data),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['CancelReasons'] });
        },
        onSuccess: (_, variables) => {
            const { reasonId } = variables; // Lấy reasonId từ variables
            if (reasonId !== undefined) {
                toast.success('Update cancel reason successfully.');
            }
            setOpen(false);
            form.reset();
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message || 'An error occurred.');
        },
    });

    function updateCancelReason(data: FormType) {
        console.log('aáasc');
        const dataSubmit = {
            reasonId: data.reasonId,
            content: data.content,
        };
        console.table(data);
        changeCancelReason.mutate(dataSubmit);
    }

    return (
        <Dialog
            onOpenChange={(isOpen) => {
                form.setValue('content', content);
                form.setValue('reasonId', reasonId.toString());
                setOpen(isOpen);
            }}
            open={open || false}
        >
            <DialogTrigger asChild>
                <Button variant={'secondary'} size="sm">
                    <FaRegEdit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit cancel reason with id: {reasonId}</DialogTitle>
                    <DialogDescription>Please change route information and check it before submit!</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateCancelReason)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose>
                                <Button type="button" variant={'link'} className="rounded-md">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={changeCancelReason.isPending} className="rounded-md">
                                {changeCancelReason.isPending ? 'Loading...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateCancelReasonDialog;
