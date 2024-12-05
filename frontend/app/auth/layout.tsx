import Logo from "@/components/ui/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="lg:min-h-screen lg:grid lg:grid-cols-2">
        <div className="h-full relative bg-slate-900 lg:bg-auth lg:bg-no-repeat">
          <div className="absolute bottom-40 right-1/2">
            <Logo variant="white" />
          </div>
        </div>
        <div className="px-10 py-5">{children}</div>
      </div>
    </main>
  );
}
