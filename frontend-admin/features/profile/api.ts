import { UpdateProfileValues } from './types';

export async function updateProfile(data: UpdateProfileValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Updating profile:', data);

    return {
        success: true,
        user: {
            name: data.name,
        },
    };
}
