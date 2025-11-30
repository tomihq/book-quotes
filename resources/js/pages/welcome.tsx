import { home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { QuoteDisplay, type QuoteDisplayRef } from '@/components/quote-display';
import { ThemeFilter } from '@/components/theme-filter';
import { CreateQuoteModal } from '@/components/create-quote-modal';
import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const quoteDisplayRef = useRef<QuoteDisplayRef | null>(null);

    return (
        <>
            <Head title="Literary Quotes">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 md:py-16">
                    <header className="mb-12 text-center">
                        <nav className="mb-6 flex items-center justify-end gap-4">
                            {auth.user ? (
                                <>
                                    <Button
                                        variant="outline"
                                        className="gap-2 border-primary/20 text-primary hover:bg-primary/5 bg-transparent"
                                        onClick={() => setIsCreateModalOpen(true)}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Crear Quote
                                    </Button>
                                    <Link
                                        href={home()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Home
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                        <h1 className="mb-3 font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                            Literary Quotes
                        </h1>
                        <p className="text-balance text-muted-foreground">Descubre y comparte la sabiduría de los grandes libros</p>
                    </header>

                    <div className="mx-auto max-w-4xl space-y-8">
                        <ThemeFilter />

                        <QuoteDisplay ref={quoteDisplayRef} />
                    </div>
                </div>
                {auth.user && (
                    <CreateQuoteModal 
                        open={isCreateModalOpen} 
                        onOpenChange={setIsCreateModalOpen}
                        onSuccess={() => {
                            // Refrescar la quote después de crear una nueva
                            if (quoteDisplayRef.current) {
                                quoteDisplayRef.current.refresh();
                            }
                        }}
                    />
                )}
            </main>
        </>
    );
}
