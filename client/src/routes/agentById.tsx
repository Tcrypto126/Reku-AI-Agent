import { UUID } from "@elizaos/core";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import AgentShowById from "@/components/agentShowById";

export default function AgentById() {
    const { agentId } = useParams<{ agentId: UUID }>();

    const query = useQuery({
        queryKey: ["agent", agentId],
        queryFn: () => apiClient.getAgent(agentId ?? ""),
        refetchInterval: 3_000,
    });

    if (!agentId) return <div>No data.</div>;

    const character = query?.data?.character;

    if (!character) return null;

    return (
        <>
            <AgentShowById agentId={agentId} character={character} />
        </>
    );
}
