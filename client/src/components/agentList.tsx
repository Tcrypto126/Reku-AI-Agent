import { AgentListTable } from "./agentListTable";

import "./agentList.css";

export default function AgentList({ title }: { title: 'Top' | 'New Agent Launches' | 'Most Used' }) {
    
    return (
        <>
            <div className="agent-list w-full grid lg:grid-cols-2 gap-12">
                {/* when screen width > 1024px */}
                <div className=" hidden lg:block">
                    <AgentListTable col="first" title={title} />
                </div>
                <div className=" hidden lg:block">
                    <AgentListTable col="second" title={title} />
                </div>

                {/* when screen width < 1024px */}
                <div className=" block lg:hidden overflow-x-scroll">
                    <AgentListTable col="third" title={title} />
                </div>
            </div>
        </>
    );
}
