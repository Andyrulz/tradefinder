import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-32 pb-12 bg-background min-h-[60vh]">
        <div className="container mx-auto px-4 flex flex-col min-h-[60vh] justify-center items-center">
          <div className="bg-card shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">Sign in to TradeCraft</h1>
            <p className="mb-6 text-muted-foreground text-center max-w-md">Sign in with Google to generate trade plans and unlock all features.</p>
            <Button size="lg" variant="default" onClick={() => signIn('google', { callbackUrl: '/' })}>
              Sign in with Google
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}