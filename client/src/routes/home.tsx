import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/page-title";
import { apiClient } from "@/lib/api";
import type { UUID } from "@elizaos/core";
import { useEffect, useState } from "react";
import { Tabs, Badge, Button } from "@radix-ui/themes";
import AgentList from "@/components/agentList";
import "@/components/agentList.css";
import AgentListCard from "@/components/agentListCard";
import { Character } from "@elizaos/core";
import { Text, Flex, Checkbox, Select } from "@radix-ui/themes";
// import { Swiper, SwiperSlide } from "swiper/react";
//@ts-ignore
// import "swiper/css";

import tronBadge from "/assets/badge/tron-badge.png";
import verifyBadge from "/assets/badge/verify-badge.png";
import newBadge from "/assets/badge/new-badge.png";
import { BackAllIcon } from "@/components/ui/icons";
import { AgentAllListTable } from "@/components/agentAllListTable";

interface Agent {
    id: UUID;
    character: Character;
    verify?: true;
}

export default function Home() {
    const [viewAll, setViewAll] = useState<boolean>(false);
    const [isTwitter, setIsTwitter] = useState(false);
    const [isTelegram, setIsTelegram] = useState(false);
    const [isToken, setIsToken] = useState(false);
    const [isVerify, setIsVerify] = useState(false);
    const [isOrder, setIsOrder] = useState("Usage");
    const [order, setOrder] = useState("Top");

    const queryAgents = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 3_000,
    });

    useEffect(() => {
        if (queryAgents.data && queryAgents.data.agents) {
            // Fetch characters for each agent
            const fetchAgents = async () => {
                const agentsPromises = queryAgents.data.agents.map(
                    async (agent: Agent) => {
                        const response = await apiClient.getAgent(agent.id);
                        return response;
                    }
                );

                const agents = await Promise.all(agentsPromises);
                sortAgents("Most Used", agents);
            };
            fetchAgents();
        }
    }, [queryAgents.data]);

    const [sortedAgents, setSortedAgents] = useState<Agent[]>([]);

    const sortAgents = (
        order: "Top" | "New Agent Launches" | "Most Used",
        agents: Agent[]
    ) => {
        let sorted: Agent[] = [...agents]; // Create a copy to avoid mutation
        if (order === "Top") {
            sorted.sort((a, b) =>
                a.character.name.localeCompare(b.character.name)
            );
        } else if (order === "New Agent Launches") {
            sorted.sort(
                (a, b) =>
                    (b.character.launchDate ?? 0) -
                    (a.character.launchDate ?? 0)
            );
        } else if (order === "Most Used") {
            sorted.sort(
                (a, b) =>
                    (b.character.totalCredits ?? 0) -
                    (b.character.credits ?? 0) -
                    ((a.character.totalCredits ?? 0) -
                        (a.character.credits ?? 0))
            );
        }
        setSortedAgents(sorted);
    };

    return (
        <div>
            {!viewAll ? (
                <div className="flex flex-col gap-4 p-4">
                    <PageTitle title="Agents" />
                    <div className="hidden lg:grid lg:grid-cols-5 gap-4 justify-items-center">
                        {sortedAgents?.map((agent, index) => {
                            if (index < 5) {
                                return (
                                    <div key={agent.id}>
                                        <AgentListCard
                                            id={agent.id}
                                            name={agent.character.name}
                                            avatar={
                                                agent.character.avatar ?? ""
                                            }
                                            mCap={0}
                                            tronBadge={tronBadge}
                                            verifyBadge={
                                                agent.verify
                                                    ? verifyBadge
                                                    : verifyBadge
                                            }
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>
                    <div className="grid lg:grid-cols-5 gap-4 justify-items-center lg:hidden">
                        {sortedAgents?.map((agent, index) => {
                            if (index < 1) {
                                return (
                                    <div key={agent.id}>
                                        <AgentListCard
                                            id={agent.id}
                                            name={agent.character.name}
                                            avatar={
                                                agent.character.avatar ?? ""
                                            }
                                            mCap={0}
                                            tronBadge={tronBadge}
                                            verifyBadge={
                                                agent.verify
                                                    ? verifyBadge
                                                    : verifyBadge
                                            }
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>

                    <div className="agent-list-tabs mt-10">
                        <Tabs.Root
                            className=" flex flex-col"
                            defaultValue="Top"
                            value={order}
                            onValueChange={(value) => {
                                setOrder(value);
                            }}
                        >
                            <div className="flex justify-between items-center flex-wrap">
                                <Tabs.List className=" border rounded-[20px] bg-[#252525] !hidden lg:!flex flex-col md:flex-row !text-[14px] md:!text-[18px]">
                                    <Tabs.Trigger
                                        className="!cursor-pointer !px-1 md:!px-5"
                                        value="Top"
                                    >
                                        Top
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="!cursor-pointer !px-1 md:!px-5"
                                        value="New Agent Launches"
                                    >
                                        New Agent Launches
                                        <Badge
                                            size="1"
                                            className="!bg-transparent"
                                        >
                                            <img
                                                src={newBadge}
                                                alt="new badge"
                                                width={30}
                                                height={14}
                                            />
                                        </Badge>
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="!cursor-pointer !px-1 md:!px-5"
                                        value="Most Used"
                                    >
                                        Most Used
                                    </Tabs.Trigger>
                                </Tabs.List>
                                <div className="block lg:hidden">
                                    <Select.Root
                                        defaultValue="Top"
                                        value={order}
                                        onValueChange={(value) => {
                                            setOrder(value);
                                        }}
                                    >
                                        <Select.Trigger className="!w-[180px]" />
                                        <Select.Content>
                                            <Select.Item value="Top">
                                                Top
                                            </Select.Item>
                                            <Select.Item value="New Agent Launches">
                                                New Agent Launches
                                            </Select.Item>
                                            <Select.Item value="Most Used">
                                                Most Used
                                            </Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                </div>
                                <Button
                                    className=" !cursor-pointer"
                                    size="3"
                                    onClick={() => {
                                        setViewAll(true);
                                    }}
                                >
                                    View All
                                </Button>
                            </div>

                            <div>
                                <Tabs.Content className="mt-10" value="Top">
                                    <AgentList title="Top" />
                                </Tabs.Content>
                                <Tabs.Content
                                    className="mt-10"
                                    value="New Agent Launches"
                                >
                                    <AgentList title="New Agent Launches" />
                                </Tabs.Content>
                                <Tabs.Content
                                    className="mt-10"
                                    value="Most Used"
                                >
                                    <AgentList title="Most Used" />
                                </Tabs.Content>
                            </div>
                        </Tabs.Root>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-7 p-4">
                    <div className="flex flex-col lg:flex-row gap-5 justify-between">
                        <div
                            className="flex gap-1 items-center cursor-pointer min-w-[120px]"
                            onClick={() => {
                                setViewAll(false);
                            }}
                        >
                            <BackAllIcon width="32" height="32" color="" />
                            <Text size="4">All Agents</Text>
                        </div>
                        <div className="flex gap-5 items-center flex-wrap">
                            <Text as="label" size="2">
                                <Flex gap="2">
                                    <Checkbox
                                        onCheckedChange={() => {
                                            setIsTwitter(!isTwitter);
                                        }}
                                    />
                                    Twitter linked
                                </Flex>
                            </Text>
                            <Text as="label" size="2">
                                <Flex gap="2">
                                    <Checkbox
                                        onCheckedChange={() => {
                                            setIsTelegram(!isTelegram);
                                        }}
                                    />
                                    TG linked
                                </Flex>
                            </Text>
                            <Text as="label" size="2">
                                <Flex gap="2">
                                    <Checkbox
                                        onCheckedChange={() => {
                                            setIsToken(!isToken);
                                        }}
                                    />
                                    Token created/bound
                                </Flex>
                            </Text>
                            <Text as="label" size="2">
                                <Flex gap="2">
                                    <Checkbox
                                        onCheckedChange={() => {
                                            setIsVerify(!isVerify);
                                        }}
                                    />
                                    Verified
                                </Flex>
                            </Text>
                            <Text size="2" className="flex items-center gap-2">
                                Sort by:
                                <Select.Root
                                    defaultValue={isOrder}
                                    onValueChange={(value) => {
                                        setIsOrder(value);
                                    }}
                                >
                                    <Select.Trigger className="!w-[180px]" />
                                    <Select.Content className="">
                                        <Select.Item value="Agent Creation Time">
                                            Agent Creation Time
                                        </Select.Item>
                                        <Select.Item value="Usage">
                                            Usage
                                        </Select.Item>
                                        <Select.Item value="Market Cap">
                                            Market Cap
                                        </Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Text>
                        </div>
                    </div>
                    <div className="agent-list overflow-x-scroll">
                        <AgentAllListTable
                            twitter={isTwitter}
                            telegram={isTelegram}
                            verify={isVerify}
                            token={isToken}
                            sort={isOrder}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
