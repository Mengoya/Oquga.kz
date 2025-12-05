import { University, UniversitySchema } from './types';

const MOCK_UNIVERSITIES: University[] = Array.from({ length: 50 }).map(
    (_, i) => ({
        id: `uni-${i + 1}`,
        name:
            i % 2 === 0
                ? `Kazakh National University #${i + 1}`
                : `Astana IT University #${i + 1}`,
        city: i % 3 === 0 ? 'Almaty' : 'Astana',
        programsCount: 20 + i * 2,
        studentsCount: 5000 + i * 100,
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        status: i % 5 === 0 ? 'archived' : 'active',
        updatedAt: new Date().toISOString(),
    }),
);

export async function fetchUniversities({
    search,
    page = 1,
    limit = 10,
}: {
    search?: string;
    page?: number;
    limit?: number;
}) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    let data = [...MOCK_UNIVERSITIES];

    if (search) {
        const lowerSearch = search.toLowerCase();
        data = data.filter(
            (u) =>
                u.name.toLowerCase().includes(lowerSearch) ||
                u.city.toLowerCase().includes(lowerSearch),
        );
    }

    const total = data.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    const parsedData = UniversitySchema.array().parse(data.slice(start, end));

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
