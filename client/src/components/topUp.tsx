import { toast } from "@/hooks/use-toast";
import { Character, UUID } from "@elizaos/core";
import { Switch, Text, Grid, Button, Spinner } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface CharacterType {
    credits: number;
}

export default function TopUp({
    agentId,
    character,
    setIsClose,
}: {
    agentId: UUID;
    character: Character;
    setIsClose: (value: boolean) => void;
}) {
    const queryClient = new QueryClient();
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState("0");
    const [tronWeb, setTronWeb] = useState<any | null>(null);
    const recipientAddress: string = "TXCenN7ASStT8vgPsRjJaDxeQppz3K29BR";

    let credits = 0;
    let totalCredits = 0;

    useEffect(() => {
        const initTronWeb = () => {
            if (window.tronWeb && window.tronWeb.ready) {
                setTronWeb(window.tronWeb);
            } else {
                // Wait for TronLink to load
                window.addEventListener("load", () => {
                    if (window.tronWeb && window.tronWeb.ready) {
                        setTronWeb(window.tronWeb);
                    }
                });
            }
        };
        initTronWeb();
    }, []);

    const mutation = useMutation({
        mutationFn: async (values: CharacterType) => {
            return await apiClient.updateAgent(agentId, values, character);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            setTimeout(() => {
                toast({
                    title: "Success",
                    description: "Updated credits successfully!",
                    variant: "default",
                });
            }, 500);
            setIsClose(true);
        },
        onError: (err: any) => {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        },
    });

    const sendTRX = async (amount: number) => {
        if (amount == 10) {
            setLoading("1");
            credits = (character.credits ?? 0) + 100;
            totalCredits = (character.totalCredits ?? 0) + 100;
        } else if (amount == 30) {
            setLoading("2");
            credits = (character.credits ?? 0) + 1000;
            totalCredits = (character.totalCredits ?? 0) + 1000;
        } else if (amount == 50) {
            setLoading("3");
            credits = (character.credits ?? 0) + 4000;
            totalCredits = (character.totalCredits ?? 0) + 4000;
        } else {
            setLoading("0");
        }

        const values = {
            credits,
            totalCredits,
            activeButton: "credits",
        };

        if (!window.tronLink) {
            console.error("TronLink not found");
            return;
        }

        try {
            await window.tronLink.request({ method: "tron_requestAccounts" });
            setTronWeb(window.tronWeb);

            const amountSun: string = tronWeb.toSun(amount); //convert TRX to ...

            const transaction = await tronWeb.trx.sendTransaction(
                recipientAddress,
                amountSun
            );

            if (transaction.result) {
                setLoading("0");
                console.log("Successfully paid!");

                mutation.mutate(values);
            } else {
                setLoading("0");
                setTimeout(() => {
                    toast({
                        title: "Error",
                        description: "Transaction failed",
                        variant: "destructive",
                    });
                }, 500);
            }
        } catch (error) {
            setLoading("0");
            console.error("Error sending: ", error);
            setTimeout(() => {
                toast({
                    title: "Error",
                    description: "Failed to pay! Try again.",
                    variant: "destructive",
                });
            }, 500);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between gap-3 px-5">
                    <Text size="1">Your agent runs on credits.</Text>
                    <div className="flex items-center gap-2">
                        <Text as="label" size="1" className=" cursor-pointer">
                            Pay in $HAT and get 20% off
                            <Switch
                                size="1"
                                className="!ml-2 !cursor-pointer"
                                checked={isChecked}
                                onCheckedChange={() => {
                                    setIsChecked(!isChecked);
                                }}
                            />
                        </Text>
                    </div>
                </div>
                <Grid
                    columns={{ initial: "1", md: "3" }}
                    gap="5"
                    className="w-full"
                >
                    <div className="flex flex-col rounded-[20px] overflow-hidden">
                        <div>
                            <img
                                src="/assets/gift/gift1-CQ38a7eO.png"
                                alt="gift1"
                                className="h-[237px] w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col h-full gap-4 p-5 pb-6 bg-[#222222]">
                            <Text size="5" weight="bold">
                                Kick-off Package
                            </Text>
                            <Text size="1">
                                Contains 100 credits to help you get familiar
                                with the world of autonomous agents.
                            </Text>
                            <Button
                                className="!cursor-pointer !h-[40px] !rounded-[7px]"
                                onClick={() => {
                                    sendTRX(10);
                                }}
                            >
                                {loading === "1" || mutation.isPending ? (
                                    <Spinner />
                                ) : (
                                    <></>
                                )}
                                <Text size="4" weight="bold">
                                    10 TRX
                                </Text>
                            </Button>
                            <div className="flex justify-center">
                                <Text size="1" className="!text-[#747474]">
                                    10% will be used to buy back & burning $HAT
                                </Text>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col h-full rounded-[20px] overflow-hidden">
                        <div>
                            <img
                                src="/assets/gift/gift2-CGFEOJer.png"
                                alt="gift1"
                                className="h-[237px] w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col h-full gap-4 p-5 pb-6 bg-[#222222]">
                            <Text size="5" weight="bold">
                                Goatse Package
                            </Text>
                            <Text size="1">
                                Contains 1000 credits as you’ve learned how to
                                interact and experiment with autonomous agents.
                            </Text>
                            <Button
                                className="!cursor-pointer !h-[40px] !rounded-[7px]"
                                onClick={() => {
                                    sendTRX(30);
                                }}
                            >
                                {loading === "2" || mutation.isPending ? (
                                    <Spinner />
                                ) : (
                                    <></>
                                )}
                                <Text size="4" weight="bold">
                                    30 TRX
                                </Text>
                            </Button>
                            <div className="flex justify-center">
                                <Text size="1" className="!text-[#747474]">
                                    10% will be used to buy back & burning $HAT
                                </Text>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col h-full rounded-[20px] overflow-hidden">
                        <div>
                            <img
                                src="/assets/gift/gift3-Ok5Pri9s.png"
                                alt="gift1"
                                className="h-[237px] w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col h-full gap-4 p-5 pb-6 bg-[#222222]">
                            <Text size="5" weight="bold">
                                Terminator Package
                            </Text>
                            <Text size="1">
                                Contains 4000 credits for you, the ultimate
                                boss, to supercharge your AI agent to infiltrate
                                humanity.
                            </Text>
                            <Button
                                className="!cursor-pointer !h-[40px] !rounded-[7px]"
                                onClick={() => {
                                    sendTRX(50);
                                }}
                            >
                                {loading === "3" || mutation.isPending ? (
                                    <Spinner />
                                ) : (
                                    <></>
                                )}
                                <Text size="4" weight="bold">
                                    50 TRX
                                </Text>
                            </Button>
                            <div className="flex justify-center">
                                <Text size="1" className="!text-[#747474]">
                                    10% will be used to buy back & burning $HAT
                                </Text>
                            </div>
                        </div>
                    </div>
                </Grid>
            </div>
        </>
    );
}
