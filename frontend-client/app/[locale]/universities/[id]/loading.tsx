export default function Loading() {
    return (
        <div className="min-h-screen bg-muted/10 pb-20">
            <div className="container mx-auto px-4 md:px-6 py-6">
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="container mx-auto px-4 md:px-6 mb-8">
                <div className="rounded-3xl border bg-card shadow-sm h-[350px] md:h-[400px] w-full bg-gray-200 animate-pulse relative">
                    <div className="absolute bottom-6 left-6 right-6 space-y-4">
                        <div className="h-8 w-32 bg-gray-300 rounded" />
                        <div className="h-12 w-3/4 bg-gray-300 rounded" />
                        <div className="flex gap-4">
                            <div className="h-6 w-24 bg-gray-300 rounded" />
                            <div className="h-6 w-24 bg-gray-300 rounded" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-card rounded-2xl p-8 border h-96 animate-pulse" />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="bg-card rounded-2xl p-6 border h-80 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
