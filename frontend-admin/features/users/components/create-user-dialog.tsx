'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CreateUserForm } from './create-user-form';

export function CreateUserDialog() {
    const t = useTranslations('UsersPage');
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('addUser')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('createModal.title')}</DialogTitle>
                    <DialogDescription>
                        {t('createModal.description')}
                    </DialogDescription>
                </DialogHeader>
                <CreateUserForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
