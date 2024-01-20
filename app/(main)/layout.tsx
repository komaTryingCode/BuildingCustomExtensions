import { AuthCheckProvider } from "@/components/providers/convex-auth-check-provider";

interface ApplicationLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({
  children,
}: ApplicationLayoutProps) {
  return (
    <>
      <AuthCheckProvider>{children}</AuthCheckProvider>
    </>
  );
}