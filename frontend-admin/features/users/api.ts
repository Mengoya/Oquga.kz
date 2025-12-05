import { CreateUserValues, User, UserSchema } from './types';

export const MOCK_UNIVERSITIES_LIST = [
    { id: 'uni-1', name: 'Kazakh National University' },
    { id: 'uni-2', name: 'Astana IT University' },
    { id: 'uni-3', name: 'Nazarbayev University' },
    { id: 'uni-4', name: 'KIMEP University' },
];

const ROLES = ['admin', 'manager', 'viewer'] as const;

const MOCK_USERS: User[] = Array.from({ length: 40 }).map((_, i) => {
    const uni = MOCK_UNIVERSITIES_LIST[i % MOCK_UNIVERSITIES_LIST.length];
    const role = ROLES[i % 3];
    const universityId = role === 'admin' && i % 5 === 0 ? null : uni.id;

    return {
        id: `usr-${i + 1}`,
        name: `User Name ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: role,
        universityId: universityId,
        universityName: universityId ? uni.name : undefined,
        status: i % 10 === 0 ? 'blocked' : 'active',
        lastLogin: new Date(Date.now() - i * 10000000).toISOString(),
        createdAt: new Date(Date.now() - i * 50000000).toISOString(),
    };
});

export async function fetchUsers({
    search,
    role,
    universityId,
    page = 1,
    limit = 10,
}: {
    search?: string;
    role?: string;
    universityId?: string;
    page?: number;
    limit?: number;
}) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let data = [...MOCK_USERS];

    if (search) {
        const lowerSearch = search.toLowerCase();
        data = data.filter(
            (u) =>
                u.name.toLowerCase().includes(lowerSearch) ||
                u.email.toLowerCase().includes(lowerSearch),
        );
    }

    if (role && role !== 'all') {
        data = data.filter((u) => u.role === role);
    }

    if (universityId && universityId !== 'all') {
        data = data.filter((u) => u.universityId === universityId);
    }

    const total = data.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    const parsedData = UserSchema.array().parse(data.slice(start, end));

    return {
        data: parsedData,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function createUser(data: CreateUserValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Creating user:', data);
    return { success: true };
}
