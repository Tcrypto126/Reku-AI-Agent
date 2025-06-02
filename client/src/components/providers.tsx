import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@radix-ui/themes/styles.css";
import { TronLinkAdapter } from "@tronweb3/tronwallet-adapters";
import { WalletProvider } from "@tronweb3/tronwallet-adapter-react-hooks";
import { WalletModalProvider } from "@tronweb3/tronwallet-adapter-react-ui";
import "@tronweb3/tronwallet-adapter-react-ui/style.css";

import { AuthProvider } from "@/auth/AuthContext";
import { TooltipProvider } from "./ui/tooltip";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Number.POSITIVE_INFINITY,
        },
    },
});

export default function Providers({ children }: { children: React.ReactNode }) {
    // Define the adapters you want to support
    const adapters = [new TronLinkAdapter()];

    return (
        <AuthProvider>
            <TooltipProvider delayDuration={0}>
                <Theme accentColor="purple" grayColor="sand">
                    <QueryClientProvider client={queryClient}>
                        <WalletProvider adapters={adapters}>
                            <WalletModalProvider>
                                {children}
                            </WalletModalProvider>
                        </WalletProvider>
                    </QueryClientProvider>
                </Theme>
            </TooltipProvider>
        </AuthProvider>
    );
}
