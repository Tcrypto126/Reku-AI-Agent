import { useMemo } from "react";
import { NavLink } from "react-router";
import { Badge, Card, Flex, Text } from "@radix-ui/themes";
import { DiscordIcon, TGIcon, TokenIcon, XIcon } from "./ui/icons";
// import { UUID } from "@elizaos/core";

interface MyAgentCardProps {
    name: string;
    id: string;
    description: string;
    credit: number;
    telegram?: string;
    discord?: string;
    twitter?: string;
    token?: string;
    active: boolean;
}

export default function MyAgentCard({
    name,
    description,
    id,
    credit,
    telegram,
    discord,
    twitter,
    token,
}: MyAgentCardProps) {
    const activeStatus = useMemo(() => {
        return credit > 0 ? true : false;
    }, []);

    const binding = useMemo(() => {
        const socialMap = [
            {
                condition: telegram,
                Icon: <TGIcon width="24" height="24" />,
                value: telegram,
            },
            {
                condition: discord,
                Icon: <DiscordIcon width="24" height="24" />,
                value: discord,
            },
            {
                condition: twitter,
                Icon: <XIcon width="24" height="24" />,
                value: twitter,
            },
            {
                condition: token,
                Icon: <TokenIcon width="24" height="24" />,
                value: token,
            },
        ];

        const activeItem = socialMap.find((item) => item.condition);

        if (!activeItem) return "";

        const { Icon, value } = activeItem;

        return (
            <>
                {Icon}
                <Text className="text-[#666]">{value}</Text>
            </>
        );
    }, [telegram, discord, twitter, token]);

    return (
        <Card asChild size="2" variant="classic">
            <NavLink to={`/agents/${id}`}>
                <Flex direction="column" gap="5">
                    <Flex
                        gap="2"
                        align="center"
                        justify="between"
                        className="p-0 space-y-1.5"
                    >
                        <Flex align="center" gap="2">
                            <Text weight="bold" size="4">
                                {name}
                            </Text>
                            {activeStatus ? (
                                <Badge color="cyan" variant="solid">
                                    Active
                                </Badge>
                            ) : (
                                <Badge
                                    color="red"
                                    variant="outline"
                                    className="!bg-orange-100"
                                >
                                    Inactive
                                </Badge>
                            )}
                        </Flex>
                        <Flex align="center" gap="1" className="text-[#6e56cf]">
                            {binding}
                        </Flex>
                    </Flex>
                    <div className="flex-1">
                        <div className="text-[#666] h-[3em] overflow-hidden">
                            <Text className="line-clamp-2">{description}</Text>
                        </div>
                    </div>
                    <div className="flex items-center mt-auto text-sm border-t border-[#666] justify-center p-0 py-5 gap-1">
                        <Flex align="center" gap="1">
                            <Text className="text-[#666]" size="3">
                                Credits:
                            </Text>
                            <Text weight="bold" color="gray" size="3">
                                {credit}
                            </Text>
                        </Flex>
                    </div>
                </Flex>
            </NavLink>
        </Card>
    );
}
