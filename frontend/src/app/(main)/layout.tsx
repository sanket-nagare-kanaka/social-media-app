export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Main pages share the app shell (sidebar, right sidebar via root layout)
    return <>{children}</>;
}
