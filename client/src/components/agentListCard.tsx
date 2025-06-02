import { UUID } from "@elizaos/core";
import { useNavigate } from "react-router";
import { Badge, Heading } from "@radix-ui/themes";

import avatar from "/assets/avatar/avatar.png";

interface AgentCardProp {
    id: UUID;
    name: string;
    avatar: string;
    tronBadge: any;
    verifyBadge: any;
    mCap: number;
}

export default function AgentListCard(agentCard: AgentCardProp) {
    const navigate = useNavigate();

    return (
        <>
            <div
                className=" relative cursor-pointer rounded-[15px] max-w-[230px] max-h-[230px] overflow-hidden"
                onClick={() => {
                    navigate(`/agent/${agentCard.id}`);
                }}
            >
                <img
                    src={agentCard.avatar == "" ? avatar : agentCard.avatar}
                    alt="avatar"
                    width={230}
                    height={230}
                    className="w-full h-full"
                />
                <div className=" absolute left-0 bottom-0 w-full py-2 px-4 backdrop-blur-sm bg-[#979797] bg-opacity-60">
                    <div className=" flex gap-1 items-center">
                        <Heading>{agentCard.name}</Heading>
                        <Badge className="!bg-transparent !p-0">
                            <img
                                src={agentCard.tronBadge}
                                alt="tron badge"
                                width={15}
                                height={15}
                                className="rounded-[100%]"
                            />
                        </Badge>
                        <Badge className="!bg-transparent !p-0">
                            <img
                                src={agentCard.verifyBadge}
                                alt="verify badge"
                                width={16}
                                height={16}
                                className=" rounded-[100%]"
                            />
                        </Badge>
                    </div>
                    <div>Mcap: {agentCard.mCap}</div>
                </div>
            </div>
        </>
    );
}
