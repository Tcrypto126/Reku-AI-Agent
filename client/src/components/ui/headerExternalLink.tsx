import { Link } from "@radix-ui/themes";

export function HeaderExternalLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            underline="none"
            href={href}
            target="_blank"
            className="flex items-center min-w-5 text-foreground hover:text-foreground"
        >
            {children}
        </Link>
    );
}
