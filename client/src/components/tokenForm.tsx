import { Box, Flex, Heading, Text, Button, TextField } from "@radix-ui/themes";
import { useState } from "react";

import tronBadge from "/assets/badge/tron-badge.png";

export default function TokenForm() {
    const [tokenAddress, setTokenAddress] = useState();

    return (
        <>
            <Box className="rounded text-sm flex-1 overflow-hidden">
                <Flex>
                    <Flex
                        direction="column"
                        className="w-full p-2 md:p-4 lg:p-6 lg:max-w-4xl rounded-4 gap-8 background-gradient shadow"
                    >
                        <Flex direction="column">
                            <Heading
                                size="7"
                                weight="bold"
                                className="!text-[#d4d4d8]"
                            >
                                Create From Tokens
                            </Heading>
                            <Text
                                size="1"
                                color="gray"
                                className="!text-[#666666] !mt-5"
                            >
                                Please enter the token's contract address <br />
                                We will design the most suitable agent for you
                            </Text>
                            <div className="flex gap-3 my-5">
                                <TextField.Root
                                    placeholder="Token contract address"
                                    className="w-full !h-[40px] !rounded-[6px]"
                                    onChange={(e: any) => {
                                        setTokenAddress(e.target.value);
                                    }}
                                ></TextField.Root>
                                <Button className="!w-[110px] !h-[40px] !bg-[#252525] !flex !gap-3 !cursor-pointer">
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
                                    className="!w-full md:!w-[200px] !h-[40px] !cursor-pointer"
                                    disabled={tokenAddress ? false : true}
                                >
                                    Create Agent
                                </Button>
                            </div>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}
