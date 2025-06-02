import { useState, useRef } from "react";
import { Character, UUID } from "@elizaos/core";
import { Heading, Badge, Button, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import TruncatedText from "./ui/trancateText";

import { CloseIcon, TGIcon } from "@/components/ui/icons";
import { XIcon } from "@/components/ui/icons";
import { DexScreenerIcon } from "@/components/ui/icons";
import { ButtonIcon } from "@/components/ui/icons";
import { ClipBoardCopyIcon } from "@/components/ui/icons";
import { ClipBoardCopiedIcon } from "@/components/ui/icons";

import avatar from "/assets/avatar/avatar.png";
import tronBadge from "/assets/badge/tron-badge.png";
import verifyBadge from "/assets/badge/verify-badge.png";
import { useToast } from "@/hooks/use-toast";
import TopUp from "./topUp";

interface CharacterType extends Character {
    mCap?: string;
}

export default function AgentShowById({
    agentId,
    character,
}: {
    agentId: UUID;
    character: CharacterType;
}) {
    const creditsRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [close, setClose] = useState(true);
    const [closeColor, setCloseColor] = useState("gray");

    const handleFormOutSlideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (
            creditsRef.current &&
            !creditsRef.current.contains(e.target as HTMLElement)
        ) {
            setClose(true);
        }
    };

    const clipCopy = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 800);
                toast({
                    title: "Success",
                    description: "Successfully copied!",
                    variant: "default",
                });
            })
            .catch((err) => {
                setCopied(false);
                // console.error("Failed to copy text", err);
                toast({
                    title: "Error",
                    description: err.message,
                    variant: "default",
                });
            });
    };

    const handleCopy = () => {
        if (character.contractAddress) {
            clipCopy(character.contractAddress);
        } else {
            toast({
                title: "Error",
                description: "No contract address",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <div className="w-full flex flex-col lg:flex-row gap-6 p-4 py-8">
                <div className="flex flex-col gap-4 w-full lg:w-[64%] flex-initial">
                    <div className="flex flex-col sm:flex-row gap-5 justify-between">
                        <div className="flex gap-3">
                            <img
                                src={
                                    character.avatar == ""
                                        ? avatar
                                        : character.avatar
                                }
                                alt="avatar"
                                width={76}
                                height={76}
                                className="rounded-[10px]"
                            />
                            <div className="flex flex-col justify-between">
                                <div className="flex gap-1 items-center">
                                    <Heading style={{ fontSize: "16px" }}>
                                        {character.name}
                                    </Heading>
                                    <Badge className="!bg-transparent !p-0">
                                        <img
                                            src={tronBadge}
                                            alt="tron badge"
                                            width={15}
                                            height={15}
                                            className="rounded-[100%]"
                                        />
                                    </Badge>
                                    <Badge className="!bg-transparent !p-0">
                                        <img
                                            src={verifyBadge}
                                            alt="verify badge"
                                            width={16}
                                            height={16}
                                            className="rounded-[100%]"
                                        />
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => {
                                            navigate("");
                                        }}
                                        className="!bg-[#252525] hover:!bg-[#373737] !w-[28px] !h-[28px] !p-0 !cursor-pointer"
                                    >
                                        <TGIcon width="18" height="18" />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            navigate("");
                                        }}
                                        className="!bg-[#252525] hover:!bg-[#373737] !w-[28px] !h-[28px] !p-0 !cursor-pointer"
                                    >
                                        <XIcon width="18" height="18" />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            window.open(
                                                `https://dexscreener.com/tron/${character.contractAddress}`,
                                                "_blank"
                                            );
                                        }}
                                        className="!bg-[#252525] hover:!bg-[#373737] !w-[28px] !h-[28px] !p-0 !cursor-pointer"
                                    >
                                        <DexScreenerIcon
                                            width="18"
                                            height="18"
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-start sm:justify-end gap-7">
                            <div className="flex flex-col items-end gap-1">
                                <Text size="2" color="gray" align="right">
                                    Credit Used
                                </Text>
                                <Text size="3" weight="bold">
                                    {(character.totalCredits ?? 0) -
                                        (character.credits ?? 0)}
                                </Text>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Text size="2" color="gray" align="right">
                                    Remaining Credit
                                </Text>
                                <Text size="3" weight="bold">
                                    {character.credits ?? 0}
                                </Text>
                            </div>
                            <div className="flex flex-col items-end">
                                <Button
                                    className="!px-5 !py-5 !cursor-pointer !min-w-[110px]"
                                    onClick={() => {
                                        setClose(false);
                                    }}
                                >
                                    <ButtonIcon width="16" height="16" />
                                    Top Up
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div>
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-5 min-w-[263px] bg-[#252525] py-0 px-2 rounded-[8px] text-[14px] items-start">
                                <div className="flex flex-1 items-center text-[#35C77B]">
                                    <Text className="mr-3">Mcap:</Text>
                                    {character.mCap ?? "$0"}
                                </div>
                                <div className="flex items-center gap-3 flex-1 text-[#b3b3b3]">
                                    <Text>Contract:</Text>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer"
                                        onClick={() => {
                                            handleCopy();
                                        }}
                                    >
                                        {character.contractAddress ? (
                                            <TruncatedText
                                                option="middle"
                                                text={
                                                    character.contractAddress ??
                                                    ""
                                                }
                                                maxLength={20}
                                            />
                                        ) : (
                                            <Text>...</Text>
                                        )}
                                        {copied ? (
                                            <ClipBoardCopiedIcon
                                                width="16"
                                                height="16"
                                                color="#252525"
                                            />
                                        ) : (
                                            <ClipBoardCopyIcon
                                                width="16"
                                                height="16"
                                                color="#252525"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex max-w-full text-[#D4D4D8] text-[14px]">
                            <TruncatedText
                                option="end"
                                text={character.description ?? "Description"}
                                maxLength={150}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-10 w-full">
                        <div className="w-full">
                            <iframe
                                height="400px"
                                width="100%"
                                id="geckoterminal-embed"
                                title="GeckoTerminal Embed"
                                src={`https://www.geckoterminal.com/tron/pools/${character.contractAddress}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=15m`}
                                allow="clipboard-write"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 justify-center items-center">
                            <Button
                                color="green"
                                className="!w-[160px] !h-[36px] !cursor-pointer"
                                onClick={() => {
                                    navigate("/");
                                }}
                            >
                                <img
                                    src="/assets/buttonIcon/pumpfun.png"
                                    alt="pumpfun"
                                    width={16}
                                    height={16}
                                />
                                Trade
                            </Button>
                            <Button
                                color="cyan"
                                className="!w-[160px] !h-[36px] !cursor-pointer"
                                onClick={() => {
                                    window.open(
                                        `https://t.me/${
                                            character.telegramId ??
                                            "tronnetworkEN"
                                        }`
                                    );
                                }}
                            >
                                <img
                                    src="/assets/buttonIcon/telegram.png"
                                    alt="telegram"
                                    width={16}
                                    height={16}
                                />
                                Join Telegram
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[36%] flex-initial flex justify-center">
                    <div className="relative w-full h-[550px]">
                        <iframe
                            src="https://www.okx.com/web3/dex-widget?tradeType=swap%2Cbridge&amp;theme=dark&amp;walletType=phantom&amp;widgetVersion=1&amp;sdkVersion=1.4.0-beta.1&amp;inputChain=501&amp;outputChain=501&amp;inputCurrency=11111111111111111111111111111111&amp;outputCurrency=6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"
                            className="default-widget-iframe-1745914794269"
                            scrolling="no"
                            style={{
                                border: "none",
                                width: "100%",
                                height: "100%",
                            }}
                        ></iframe>
                        <div className="h-[100%] absolute top-0 left-0 z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
                            <h2 className="text-center max-w-[80%] text-[24px] font-bold">
                                OKX is temporarily suspending the DEX aggregator
                                services. Coming back soon!
                            </h2>
                        </div>
                    </div>
                </div>
                <div
                    className={`w-full h-full absolute top-0 left-0 z-40 ${
                        close ? "hidden" : "flex"
                    } justify-center md:items-center bg-[#61616171]`}
                    onClick={handleFormOutSlideClick}
                >
                    <div
                        ref={creditsRef}
                        className="w-full max-w-[1100px] bg-[#181818] p-8 rounded-[20px]"
                    >
                        <div className="flex justify-end">
                            <div
                                className="cursor-pointer z-30"
                                onClick={() => {
                                    setClose(true);
                                }}
                                onMouseOver={() => {
                                    setCloseColor("white");
                                }}
                                onMouseOut={() => {
                                    setCloseColor("gray");
                                }}
                            >
                                <CloseIcon
                                    width="15"
                                    height="15"
                                    color={closeColor}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-center mb-8 -mt-3">
                            <Text size="3" className="text-center px-5">
                                Your agent runs on credits. Each Telegram
                                message, prompt change, tweet, and API calls
                                uses 1 credit.
                            </Text>
                            <div className="flex items-center gap-2">
                                <Text size="3">Deposit Address:</Text>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => {
                                        clipCopy(character.walletAddress ?? "");
                                    }}
                                >
                                    <Text size="2" color="violet">
                                        TXCenN7ASStT8vgPsRjJaDxeQppz3K29BR
                                    </Text>
                                    {copied ? (
                                        <ClipBoardCopiedIcon
                                            width="16"
                                            height="16"
                                            color="#252525"
                                        />
                                    ) : (
                                        <ClipBoardCopyIcon
                                            width="16"
                                            height="16"
                                            color="#252525"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <TopUp
                            agentId={agentId}
                            character={character}
                            setIsClose={setClose}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
