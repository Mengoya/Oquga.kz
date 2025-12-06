'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadUniversityPhoto, deleteUniversityPhoto } from '../api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, Loader2, ImageIcon, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface PhotoUploadProps {
    universityId: string;
    currentPhotoUrl: string | null;
    onPhotoChange: (url: string | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.gif';

function shouldSkipOptimization(url: string): boolean {
    if (!url) return true;

    if (url.startsWith('data:')) return true;

    if (url.includes('localhost') || url.includes('127.0.0.1')) return true;

    if (url.includes('X-Amz-') || url.includes('x-amz-')) return true;

    return (
        url.includes('?') && (url.includes('Amz') || url.includes('Signature'))
    );
}

export function PhotoUpload({
    universityId,
    currentPhotoUrl,
    onPhotoChange,
}: PhotoUploadProps) {
    const tCommon = useTranslations('Common');
    const tPhoto = useTranslations('UniversityEdit.photo');
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    const uploadMutation = useMutation({
        mutationFn: (file: File) => uploadUniversityPhoto(universityId, file),
        onSuccess: (data) => {
            toast.success(tCommon('feedback.success'), {
                description: tPhoto('uploadSuccess'),
            });
            onPhotoChange(data.photoUrl);
            setPreviewUrl(null);
            setUploadError(null);
            setImageError(false);
            queryClient.invalidateQueries({
                queryKey: ['university', universityId],
            });
        },
        onError: (error: Error) => {
            setUploadError(error.message);
            setPreviewUrl(null);
            toast.error(tCommon('feedback.error'), {
                description: error.message,
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteUniversityPhoto(universityId),
        onSuccess: () => {
            toast.success(tCommon('feedback.success'), {
                description: tPhoto('deleteSuccess'),
            });
            onPhotoChange(null);
            setImageError(false);
            queryClient.invalidateQueries({
                queryKey: ['university', universityId],
            });
        },
        onError: (error: Error) => {
            toast.error(tCommon('feedback.error'), {
                description: error.message,
            });
        },
    });

    const validateFile = useCallback(
        (file: File): string | null => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                return tPhoto('invalidFormat');
            }
            if (file.size > MAX_FILE_SIZE) {
                return tPhoto('fileTooLarge');
            }
            return null;
        },
        [tPhoto],
    );

    const handleFileSelect = useCallback(
        (file: File) => {
            const error = validateFile(file);
            if (error) {
                setUploadError(error);
                toast.error(tCommon('feedback.error'), { description: error });
                return;
            }

            setUploadError(null);
            setImageError(false);

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            uploadMutation.mutate(file);
        },
        [validateFile, uploadMutation, tCommon],
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
        e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDelete = () => {
        if (window.confirm(tPhoto('deleteConfirm'))) {
            deleteMutation.mutate();
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const displayUrl = previewUrl || currentPhotoUrl;
    const isLoading = uploadMutation.isPending || deleteMutation.isPending;
    const showImage = displayUrl && !imageError;

    const skipOptimization = displayUrl
        ? shouldSkipOptimization(displayUrl)
        : true;

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    'relative border-2 border-dashed rounded-lg transition-colors',
                    isDragging && 'border-primary bg-primary/5',
                    uploadError && 'border-destructive',
                    !isDragging &&
                        !uploadError &&
                        'border-muted-foreground/25 hover:border-primary/50',
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {showImage ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <Image
                            src={displayUrl}
                            alt="University photo"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            onError={handleImageError}
                            unoptimized={skipOptimization}
                        />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                        )}
                        {!isLoading && (
                            <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 bg-white/90 hover:bg-white"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center p-8 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isLoading ? (
                            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                    <ImageIcon className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-medium">
                                        {tPhoto('dragAndDrop')}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {tPhoto('orClickToSelect')}
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">
                                    {tPhoto('allowedFormats')}
                                </p>
                            </>
                        )}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_EXTENSIONS}
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={isLoading}
                />
            </div>

            {imageError && currentPhotoUrl && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{tPhoto('loadError')}</span>
                </div>
            )}

            {uploadError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {uploadError}
                </div>
            )}
        </div>
    );
}
