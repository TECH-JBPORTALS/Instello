import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container/main h-max max-h-fit min-h-[calc(100vh-64px)]">
      <Header />

      <main className="h-full px-4 py-6 sm:px-8 md:px-10 xl:px-14">
        {children}
      </main>
      <Footer />
    </div>
  );
}
