import { BrowserRouter, Route, Routes } from "react-router";
//@ts-ignore
import ProtectedRoute from "@/auth/ProtectedRoute";

import Home from "./routes/home";
import Home2 from "./routes/home2";
import Chat from "./routes/chat";
import Header from "./components/header";
import Providers from "./components/providers";
import CreateAgent from "./routes/createAgent";
import MyAgents from "./routes/myAgents";
import AgentById from "./routes/agentById";
import MyAgent from "./routes/myAgent";
import { Toaster } from "./components/ui/toaster";
import TokenDeploy from "./routes/tokenDeploy";
// import TokenDeployComp from "./components/tokenDeployComp";
// import Overview from "./routes/overview";


export default function App() {
    return (
        <Providers>
            <div
                className="dark antialiased pt-20"
                style={{
                    colorScheme: "dark",
                }}
            >
                <BrowserRouter>
                    <Header />
                    <div className="max-w-[1400px] mx-auto py-6 px-1 lg:px-6 lt-md:px-2 lt-md:py-3 lt-md:px-0">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/home2" element={<Home2 />} />
                            <Route path="chat/:agentId" element={<Chat />} />
                            <Route
                                path="/agents/create"
                                // element={
                                //     <ProtectedRoute element={<CreateAgent />} />
                                // }
                                
                                element={<CreateAgent />}
                            />
                            <Route
                                path="/agents"
                                // element={
                                //     <ProtectedRoute element={<MyAgents />} />
                                // }
                                element={<MyAgents />}
                            />
                            <Route
                                path="/agents/:agentId"
                                // element={
                                //     <ProtectedRoute element={<MyAgent />} />
                                // }
                                element={<MyAgent />}
                            />
                            <Route 
                                path="/agents/:agentId/deploy-token"
                                element={<TokenDeploy />}
                            />

                            <Route
                                path="/agent/:agentId"
                                element={<AgentById />}
                            />
                        </Routes>
                    </div>
                </BrowserRouter>
            </div>
            <Toaster />
        </Providers>
    );
}
