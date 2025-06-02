import { Button, Text, RadioGroup, Flex, TextField } from "@radix-ui/themes";
import { Form, Formik } from "formik";
import { useState } from "react";
import { NavLink } from "react-router";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { Character, UUID } from "@elizaos/core";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import TokenDeployComp from "./tokenDeployComp";

import tronBadge from "/assets/badge/tron-badge.png";

interface FormType {
    contractAddress: string;
    activeButton: string;
}

export default function CreateToken({
    agentId,
    character,
}: {
    agentId: UUID;
    character: Character;
}) {
    const { toast } = useToast();
    const [tokenType, setTokenType] = useState<string>("1");
    const [contractAddress, setContractAddress] = useState<string>("");

    const queryClient = new QueryClient();

    function isValidTronContractAddress(address: string) {
        const regExp = /^T[a-zA-Z0-9]{33}$/; // Regular expression to check length and starting character
        // Check if the address matches the regular expression for Tron addresses
        if (!regExp.test(address)) {
            return false;
        }
        // Check if the address contains only valid Base58 characters
        const base58Regex = /^[1-9A-HJ-NP-Za-km-z]*$/;
        if (!base58Regex.test(address)) {
            return false;
        }
        return true;
    }

    const handleValueChange = (value: string) => {
        setTokenType(value);
    };

    const mutation = useMutation({
        mutationFn: async (values: FormType) => {
            return await apiClient.updateAgent(agentId, values, character);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            setTimeout(() => {
                toast({
                    title: "Success",
                    description: "Updated agent successfully",
                    variant: "default",
                });
            }, 500);
        },
        onError: (error: any) => {
            setTimeout(() => {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            }, 500);
            console.log(error.message);
        },
    });

    const handleSubmit = async (values: any = { contractAddress: "" }) => {
        const contractAddress = values.contractAddress;
        const newValues = {
            ...values,
            activeButton: "BindToken",
        };

        if (contractAddress !== "") {
            try {
                const isValid = await isValidTronContractAddress(
                    contractAddress
                );
                if (isValid) {
                    mutation.mutate(newValues);
                } else {
                    toast({
                        title: "Error",
                        description: "Invalid Address",
                        variant: "destructive",
                    });
                    console.error("Invalid contract address");
                }
            } catch (err) {
                console.error("Address validation failed: ", err);
            }
        } else {
            mutation.mutate(newValues);
        }
    };

    return (
        <>
            <div className="flex gap-10 justify-between">
                <div className="w-full max-w-[716px] flex flex-col gap-8 px-0 md:px-10">
                    <div>
                        <RadioGroup.Root
                            value={tokenType}
                            onValueChange={handleValueChange}
                            name="token"
                        >
                            <Flex gap="5">
                                <RadioGroup.Item value="1" id="eToken">
                                    Bind an Existing Token
                                </RadioGroup.Item>
                                <RadioGroup.Item value="2" id="nToken">
                                    Launch a New Token
                                </RadioGroup.Item>
                            </Flex>
                        </RadioGroup.Root>
                    </div>
                    {tokenType === "1" ? (
                        !character.contractAddress ? (
                            <Formik
                                initialValues={{
                                    contractAddress: "",
                                }}
                                onSubmit={handleSubmit}
                            >
                                {({ handleChange }) => (
                                    <Form>
                                        <div className="">
                                            <Text className="!text-[18px] !text-[#d4d4d8]">
                                                Bind Existing Token
                                            </Text>
                                            <div className="flex gap-3 my-5">
                                                <TextField.Root
                                                    name="contractAddress"
                                                    id="contractAddress"
                                                    placeholder="Token contract address"
                                                    className="w-full !h-[40px] !rounded-[6px]"
                                                    onChange={(e) => {
                                                        setContractAddress(
                                                            e.target.value
                                                        );
                                                        handleChange(e);
                                                    }}
                                                ></TextField.Root>
                                                <Button
                                                    type="button"
                                                    className="!w-[110px] !h-[40px] !bg-[#252525] !flex !gap-3 !cursor-pointer"
                                                >
                                                    <img
                                                        src={tronBadge}
                                                        alt="tron"
                                                        width={14}
                                                        height={14}
                                                        className="rounded-full"
                                                    />
                                                    <Text className="!text-[#d4d4d8]">
                                                        Tron
                                                    </Text>
                                                </Button>
                                            </div>
                                            <div className="flex justify-center">
                                                <Button
                                                    type="submit"
                                                    loading={mutation.isPending}
                                                    className="!w-[200px] !h-[40px] !cursor-pointer"
                                                    disabled={!contractAddress}
                                                >
                                                    Bind Now
                                                </Button>
                                            </div>
                                            <div className="flex flex-col gap-1 py-5">
                                                <Text className="!text-[#d4d4d8] !text-[13px]">
                                                    You cannot unbind the token
                                                    once it's bound.
                                                </Text>
                                                <Text className="!text-[#d4d4d8] !font-bold !mt-3 !underline !text-[13px]">
                                                    Swarm Feature:
                                                </Text>
                                                <Text className="!text-[#d4d4d8] !text-[13px]">
                                                    Bind multiple agents with
                                                    the same token to form a
                                                    swarm.
                                                </Text>
                                                <Text className="!text-[#d4d4d8] !font-bold !mt-3 !underline !text-[13px]">
                                                    Verification:
                                                </Text>
                                                <Text className="!text-[#d4d4d8] !text-[13px]">
                                                    If you're creating the agent
                                                    from the token deployer
                                                    wallet, it will be
                                                    automatically verified. If
                                                    it’s an CTO token, you will
                                                    need to apply for
                                                    verification here.
                                                </Text>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        ) : (
                            <div className="flex flex-col">
                                <Text className="!text-[20px] !text-[#d4d4d8]">
                                    Token Info
                                </Text>
                                <div className="flex flex-col justify-center mt-3">
                                    <div className="flex gap-5 justify-center items-center">
                                        <Text className="!text-[18px] !text-[#d4d4d8]">
                                            You have already bound
                                        </Text>
                                        <Button
                                            variant="ghost"
                                            loading={mutation.isPending}
                                            className="!cursor-pointer !bg-[#6a608f85]"
                                            onClick={() => {
                                                handleSubmit();
                                            }}
                                        >
                                            Unbind
                                        </Button>
                                    </div>
                                    <div className="flex justify-center">
                                        <NavLink
                                            target="_blank"
                                            to={`https://dexscreener.com/tron/${character.contractAddress}`}
                                            className="underline text-[#8f8e8e] text-[13px] mt-4"
                                        >
                                            {character.contractAddress}
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <TokenDeployComp
                            agentId={agentId}
                            character={character}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
