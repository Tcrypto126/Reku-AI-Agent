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
    col: string;
    title: "Top" | "New Agent Launches" | "Most Used";
}

export const AgentListTable: React.FC<AgentListTableProps> = ({
    col,
    title,
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
                sortAgents(title, agents);
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
        <>
            <table className={`w-full min-w-[400px]`}>
                <thead>
                    <tr className="border-b-[2px]">
                        <th className="text-start px-[5px] md:pr-2 py-1">#</th>
                        <th className="text-start px-[2px] md:px-6 py-1">
                            Agents
                        </th>
                        <th className="text-center px-[2px] md:px-6 py-1">
                            Mcap
                        </th>
                        <th className="text-end ps-1 md:ps-6 py-1 pr-[1px]">
                            Credits used
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAgents?.map((agent, index) => {
                        if (
                            (index < 5 && col == "first") ||
                            (index > 4 && index < 10 && col == "second") ||
                            (index < 10 && col == "third")
                        ) {
                            return (
                                <tr
                                    key={agent.id}
                                    className=" hover:bg-[#373737] cursor-pointer"
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
                                                className=" w-[70px] md:w-[86px] h-[70px] md:h-[86px] rounded-[15px] md:rounded-[20px] mr-1 md:mr-3"
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
                        }
                    })}
                </tbody>
            </table>
        </>
    );
};
