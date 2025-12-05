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
import { CreateUniversityForm } from './create-university-form';

export function CreateUniversityDialog() {
    const t = useTranslations('UniversitiesPage.createModal');
    const tDashboard = useTranslations('Dashboard');
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {tDashboard('addUniversity')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>
                <CreateUniversityForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
