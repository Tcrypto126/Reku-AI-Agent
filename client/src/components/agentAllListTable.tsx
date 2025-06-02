import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { UUID, Character } from "@elizaos/core";
import { Badge, Heading } from "@radix-ui/themes";

import avatar from "/assets/avatar/avatar.png";
import tronBadge from "/assets/badge/tron-badge.png";
import verifyBadge from "/assets/badge/verify-badge.png";

interface Agent {
    id: UUID;
    character: Character;
}

interface AgentListTableProps {
    twitter: boolean;
    telegram: boolean;
    token: boolean;
    verify: boolean;
    sort: string;
}

export const AgentAllListTable: React.FC<AgentListTableProps> = ({
    twitter,
    telegram,
    token,
    verify,
    sort,
}) => {
    const navigate = useNavigate();

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
                sortAgents(agents);
            };
            fetchAgents();
        }
    }, [queryAgents.data, telegram, token, twitter, verify, sort]);

    const [sortedAgents, setSortedAgents] = useState<Agent[]>([]);

    const sortAgents = (agents: Agent[]) => {
        let sorted: Agent[] = [...agents]; // Create a copy to avoid mutation

        if (twitter) {
            sorted = sorted.filter(
                (agent) => agent.character.twitterProfile?.username !== ""
            );
        }
        if (telegram) {
            sorted = sorted.filter((agent) => agent.character.telegramBotToken);
        }
        if (token) {
            sorted = sorted.filter((agent) => agent.character.contractAddress);
        }
        if (verify) {
            sorted = agents.filter((agent) => agent.character.verify);
        }

        if (sort === "Market Cap") {
            sorted.sort(
                (a, b) =>
                    (b.character.marketCap ?? 0) - (a.character.marketCap ?? 0)
            );
        } else if (sort === "Agent Creation Time") {
            sorted.sort(
                (a, b) =>
                    (b.character.launchDate ?? 0) -
                    (a.character.launchDate ?? 0)
            );
        } else if (sort === "Usage") {
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
        <>
            <table className="w-full min-w-[400px]">
                <thead>
                    <tr className="border-b-[2px]">
                        <th className="text-start px-[2px] md:pr-2 py-1">#</th>
                        <th className="text-start px-1 md:px-6 py-1">Agents</th>
                        <th className=" text-center px-1 md:px-6 py-1">Mcap</th>
                        <th className="text-end ps-1 md:ps-6 py-1 pr-[1px]">
                            Credits used
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAgents?.map((agent, index) => {
                        // if (1) {
                        return (
                            <tr
                                key={agent.id}
                                className=" hover:bg-[#47474783] cursor-pointer"
                                onClick={() => {
                                    navigate(`/agent/${agent.id}`);
                                }}
                            >
                                <td>{index + 1}</td>
                                <td>
                                    <div className=" flex gap-1 items-center">
                                        <img
                                            src={
                                                agent.character.avatar == ""
                                                    ? avatar
                                                    : agent.character.avatar
                                            }
                                            alt="avatar"
                                            width={86}
                                            height={86}
                                            className=" w-[70px] md:w-[86px] h-[70px] md:h-[86px] rounded-[10px] md:rounded-[15px] mr-1 md:mr-3"
                                        />
                                        <Heading
                                            style={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            {agent.character.name}
                                        </Heading>
                                        <Badge className="!bg-transparent !p-0">
                                            <img
                                                src={tronBadge}
                                                alt="chain-badge"
                                                width={15}
                                                height={15}
                                                className="rounded-[100%]"
                                            />
                                        </Badge>
                                        <Badge className="!bg-transparent !p-0">
                                            <img
                                                src={verifyBadge}
                                                alt="verify-badge"
                                                width={16}
                                                height={16}
                                            />
                                        </Badge>
                                    </div>
                                </td>
                                <td>0 Mcap</td>
                                <td>
                                    {(agent.character.totalCredits ?? 0) -
                                        (agent.character.credits ?? 0)}
                                </td>
                            </tr>
                        );
                        // }
                    })}
                </tbody>
            </table>
        </>
    );
};
