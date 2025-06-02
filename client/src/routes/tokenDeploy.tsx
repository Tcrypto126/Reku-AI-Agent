import TokenDeployComp from "@/components/tokenDeployComp";
import { Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useParams, useNavigate } from "react-router";
import { UUID } from "@elizaos/core";

import { BackIcon } from "@/components/ui/icons";
import bumpFun from "/assets/buttonIcon/pumpfun.png";

export default function TokenDeploy() {
    const navigate = useNavigate();
    const { agentId } = useParams<{ agentId: UUID }>();

    const query = useQuery({
        queryKey: ["agent", agentId],
        queryFn: () => apiClient.getAgent(agentId ?? ""),
        refetchInterval: 3_000,
        enabled: Boolean(agentId),
    });

    if (!agentId) return <div>No data.</div>;
    const character = query?.data?.character;
    if (!character) return null;

    return (
        <>
            <div className="flex w-full md:w-[60%] m-auto flex-col p-10">
                <div className="flex pb-5">
                    <div
                        className="flex gap-1 items-center cursor-pointer"
                        onClick={() => {
                            navigate(`/agents/${agentId}`);
                        }}
                    >
                        <BackIcon width="24" height="24" />
                        <Text>Back</Text>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center pr-5">
                        <div className="flex justify-center items-center gap-2">
                            <Text size="5" weight="bold">
                                Create a new token
                            </Text>
                            <img
                                src={bumpFun}
                                alt="Pump Fun"
                                className="w-[18px] h-[18px]"
                            />
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <Text color="gray">Agent name: </Text>
                            <Text color="cyan">{character.name}</Text>
                        </div>
                    </div>
                </div>
                <TokenDeployComp agentId={agentId} character={character} />
            </div>
        </>
    );
}
