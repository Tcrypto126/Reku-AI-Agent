import { Box, Flex, TextField, Button } from "@radix-ui/themes";
import { NavLink } from "react-router";
import {
    BookIcon,
    DexScreenerIcon,
    DuneIcon,
    MagnifyingGlass,
    TGIcon,
    XIcon,
    MobileMenuIcon,
    MobileMenuCloseIcon,
    RightArrowIcon,
} from "./ui/icons";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { HeaderExternalLink } from "./ui/headerExternalLink";
import { useEffect, useState } from "react";
// import { apiClient } from "@/lib/api";
// import { fetcher } from "@/lib/api";

// const jwtSecretKey = import.meta.env.JWT_SECRET_KEY;

//@ts-ignore
const BASE_URL =
    import.meta.env.VITE_SERVER_BASE_URL ||
    `${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}`;

export default function Header() {
    const { connected, address } = useWallet();
    const [isMobileMenu, setIsMobileMenu] = useState(false);

    const walletLogin = (address: string) => {
        localStorage.setItem("walletAddress", address);
        // apiClient
        //     .getWalletToken(address)
        //     .then((token) => {
        //         console.log("wallet token: ", token);
        //         localStorage.setItem("walletToken", token);
        //     })
        //     .catch((err) => {
        //         console.error("Error retrieving wallet token: ", err);
        //     });
    };

    useEffect(() => {
        if (connected && address) {
            console.log("Connected to wallet:", address);
            // console.log("jwt secret key:", jwtSecretKey);

            walletLogin(address);
        } else {
            // localStorage.removeItem("walletToken");
            localStorage.removeItem("walletAddress");
        }
    }, [connected, address]);

    return (
        <Box className="z-20 fixed w-full top-0 py-3 shadow-sm backdrop-blur-[40px] bg-black">
            <Box className="max-w-[1400px] mx-auto">
                <Flex
                    align="center"
                    justify="between"
                    py="2"
                    className="px-3 lg:px-6"
                >
                    <Flex align="center" gap="4">
                        <NavLink to="/" className="text-[24px] w-[105px]">
                            Top Logo
                        </NavLink>
                        <div className="hidden lg:flex items-center gap-2">
                            <HeaderExternalLink href={"/"}>
                                <Flex align="center" gap="1" px="2">
                                    <DexScreenerIcon width="18" height="20" />
                                    DS
                                </Flex>
                            </HeaderExternalLink>
                            <HeaderExternalLink href={"/"}>
                                <Box px="2">
                                    <TGIcon width="20" height="20" />
                                </Box>
                            </HeaderExternalLink>
                            <HeaderExternalLink href={"/"}>
                                <Box px="2">
                                    <XIcon width="20" height="20" />
                                </Box>
                            </HeaderExternalLink>
                            <HeaderExternalLink href={"/"}>
                                <Box px="2">
                                    <BookIcon width="20" height="20" />
                                </Box>
                            </HeaderExternalLink>
                            <HeaderExternalLink href={"/"}>
                                <Flex align="center" px="2">
                                    <DuneIcon width="20" height="20" />
                                    Dune
                                </Flex>
                            </HeaderExternalLink>
                        </div>
                    </Flex>
                    <div className="hidden lg:flex items-center gap-3 lg:gap-6">
                        <TextField.Root
                            className="!h-[40px] !text-[14px]"
                            placeholder="Search"
                        >
                            <TextField.Slot>
                                <MagnifyingGlass width="24" height="24" />
                            </TextField.Slot>
                        </TextField.Root>
                        {connected ? (
                            <>
                                <NavLink to="/agents/create">
                                    Create Agent
                                </NavLink>
                                <NavLink to="/agents/">My Agents</NavLink>
                            </>
                        ) : null}
                        <WalletActionButton />
                    </div>
                    <div className="flex lg:hidden gap-3 justify-center items-center">
                        <div className="z-20">
                            <WalletActionButton className="!p-2 !h-[36px] !text-[12px]" />
                        </div>
                        <div className="">
                            <Button
                                className="!bg-black !cursor-pointer !p-0"
                                onClick={() => {
                                    setIsMobileMenu(true);
                                }}
                            >
                                <MobileMenuIcon width="30" height="30" />
                            </Button>
                            <div
                                className={`fixed top-0 left-0 w-full !z-50 bg-[#0f0f0f] transition-all duration-300 ${
                                    isMobileMenu
                                        ? "h-screen block"
                                        : "h-0 hidden"
                                }`}
                            >
                                <div className=" w-full h-[81px] px-3 border-b-[#1f1f1f] border-b-2 flex items-center justify-between">
                                    <NavLink
                                        to="/"
                                        className="text-[24px] w-[105px]"
                                        onClick={() => {
                                            setIsMobileMenu(false);
                                        }}
                                    >
                                        Top Logo
                                    </NavLink>
                                    <Button
                                        className="!bg-[#0f0f0f] !cursor-pointer !p-0"
                                        onClick={() => {
                                            setIsMobileMenu(false);
                                        }}
                                    >
                                        <MobileMenuCloseIcon
                                            width="30"
                                            height="30"
                                        />
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-5 w-full p-3 pt-8">
                                    {/* <div>
                                        <TextField.Root
                                            className="!h-[36px] !text-[14px]"
                                            placeholder="Search"
                                        >
                                            <TextField.Slot>
                                                <MagnifyingGlass
                                                    width="24"
                                                    height="24"
                                                />
                                            </TextField.Slot>
                                        </TextField.Root>
                                    </div> */}

                                    <div className="flex">
                                        <HeaderExternalLink href={"/"}>
                                            <Flex
                                                align="center"
                                                gap="1"
                                                px="2"
                                                onClick={() => {
                                                    setIsMobileMenu(false);
                                                }}
                                            >
                                                <DexScreenerIcon
                                                    width="18"
                                                    height="20"
                                                />
                                                DS
                                            </Flex>
                                        </HeaderExternalLink>
                                        <HeaderExternalLink href={"/"}>
                                            <Box
                                                px="2"
                                                onClick={() => {
                                                    setIsMobileMenu(false);
                                                }}
                                            >
                                                <TGIcon
                                                    width="20"
                                                    height="20"
                                                />
                                            </Box>
                                        </HeaderExternalLink>
                                        <HeaderExternalLink href={"/"}>
                                            <Box
                                                px="2"
                                                onClick={() => {
                                                    setIsMobileMenu(false);
                                                }}
                                            >
                                                <XIcon width="20" height="20" />
                                            </Box>
                                        </HeaderExternalLink>
                                        <HeaderExternalLink href={"/"}>
                                            <Box
                                                px="2"
                                                onClick={() => {
                                                    setIsMobileMenu(false);
                                                }}
                                            >
                                                <BookIcon
                                                    width="20"
                                                    height="20"
                                                />
                                            </Box>
                                        </HeaderExternalLink>
                                        <HeaderExternalLink href={"/"}>
                                            <Flex
                                                align="center"
                                                px="2"
                                                onClick={() => {
                                                    setIsMobileMenu(false);
                                                }}
                                            >
                                                <DuneIcon
                                                    width="20"
                                                    height="20"
                                                />
                                                Dune
                                            </Flex>
                                        </HeaderExternalLink>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {connected ? (
                                            <>
                                                <NavLink
                                                    to="/agents/create"
                                                    className="flex justify-between items-center hover:bg-[#7070701a] p-2"
                                                    onClick={() => {
                                                        setIsMobileMenu(false);
                                                    }}
                                                >
                                                    Create Agent
                                                    <RightArrowIcon
                                                        width="24"
                                                        height="24"
                                                    />
                                                </NavLink>
                                                <NavLink
                                                    to="/agents/"
                                                    className="flex justify-between items-center hover:bg-[#7070701a] p-2"
                                                    onClick={() => {
                                                        setIsMobileMenu(false);
                                                    }}
                                                >
                                                    My Agents
                                                    <RightArrowIcon
                                                        width="24"
                                                        height="24"
                                                    />
                                                </NavLink>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Flex>
            </Box>
        </Box>
    );
}
