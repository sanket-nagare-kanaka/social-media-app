import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Social Publishing Platform",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Auth pages get a clean layout without sidebar
    return <>{children}</>;
}
