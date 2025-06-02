import { apiClient } from "@/lib/api";
import MyAgentCard from "@/components/myAgentCard";
import { Button, Flex, Grid, Heading } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { UUID } from "@elizaos/core";
import { useEffect, useState } from "react";
import { Character } from "@elizaos/core";

interface Agent {
    id: UUID;
    character: Character;
}

export default function MyAgents() {
    const walletAddress = localStorage.getItem("walletAddress");
    const [myAgentCharacters, setMyAgentCharacters] = useState<Character[]>([]);

    const queryAgents = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 3_000,
    });

    useEffect(() => {
        if (queryAgents.data && queryAgents.data.agents) {
            // Fetch characters for each agent
            const fetchCharacters = async () => {
                const charactersPromises = queryAgents.data.agents.map(
                    async (agent: Agent) => {
                        const response = await apiClient.getAgent(agent.id);
                        if (
                            response.character.walletAddress === walletAddress
                        ) {
                            return response.character; // Assuming response contains { character: Character }
                        }
                        return null; // Return null if it doesn't match
                    }
                );

                const characters = await Promise.all(charactersPromises);
                const filteredCharacters = characters.filter(
                    (character) => character !== null
                );
                setMyAgentCharacters(filteredCharacters);
            };
            fetchCharacters();
        }
    }, [queryAgents.data]);

    return (
        <Flex gap="5" direction="column" align="center" className="w-full">
            <Heading weight="bold" size="7">
                My Agents
            </Heading>
            <div className="w-full p-3 lg:p-0">
                <Flex direction="column" gap="5" align="start">
                    <Button asChild size="3">
                        <NavLink to="/agents/create">
                            <Plus size="18" />
                            Create Agent
                        </NavLink>
                    </Button>
                    <Grid
                        columns={{ initial: "1", sm: "2", md: "3" }}
                        gap={{ initial: "4", md: "8" }}
                        className="w-full"
                    >
                        {myAgentCharacters.map((character: Character) => {
                            return (
                                <MyAgentCard
                                    key={character.id}
                                    name={character.name}
                                    description={character.description ?? ""}
                                    credit={character.credits ?? 0}
                                    id={character.id ?? ""}
                                    active={character.verify ?? false}
                                />
                            );
                        })}
                    </Grid>
                </Flex>
            </div>
        </Flex>
    );
}
