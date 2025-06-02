import { Heading, Button, Text } from "@radix-ui/themes";
import SocialButton from "./ui/socialButton";
import { useState } from "react";
//@ts-ignore
import { NavLink } from "react-router";
import { UUID } from "@elizaos/core";
//@ts-ignore
const BASE_URL =
    import.meta.env.VITE_SERVER_BASE_URL ||
    `${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}`;

export default function BindSocial({ agentId }: { agentId: UUID }) {
    const [activeButton, setActiveButton] = useState<string>("Twitter");

    const loginWithTwitter = () => {
        const TWITTER_CLIENT_ID = "your-client-id";
        const REDIRECT_URI = `http://localhost:5173/agents/${agentId}`;
        const SCOPES = "tweet.read users.read offline.access";

        console.log("login with twitter");

        const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&scope=${encodeURIComponent(
            SCOPES
        )}&state=yourCustomState&code_challenge=challenge&code_challenge_method=plain`;

        window.location.href = url;
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-10 justify-between">
                <div className="w-full max-w-[716px] flex flex-col gap-8 px-0 md:px-10">
                    <div className="flex justify-center">
                        <SocialButton
                            name="Twitter"
                            position="0"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                        <SocialButton
                            name="Tiktok"
                            position="1"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                        <SocialButton
                            name="Twitch"
                            position="2"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                    </div>
                    {activeButton === "Twitter" ? (
                        <div className="flex flex-col">
                            <Text className="!text-[18px] !text-[#d4d4d8]">
                                Bind Your Twitter Account
                            </Text>
                            <Text className="!text-[13px] !text-[#b3b3b3]">
                                Don’t forget to add{" "}
                                <span className="text-[#BEACFE]">
                                    "@Tophat_One 🎩"
                                </span>{" "}
                                to the agent’s bio!
                            </Text>
                            <div className="flex justify-center mt-5">
                                <Button
                                    className="!w-[200px] !h-[40px] !cursor-pointer"
                                    onClick={() => {
                                        loginWithTwitter();
                                    }}
                                >
                                    Click to bind
                                </Button>
                            </div>
                            <div className="mt-10 flex justify-center">
                                <iframe
                                    width="600"
                                    height="340"
                                    className="w-full"
                                    src="https://www.youtube.com/embed/jPKnarR2xdU"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    ) : activeButton === "Tiktok" ? (
                        <div>No data</div>
                    ) : (
                        <div>No data</div>
                    )}
                </div>
                {activeButton === "Twitter" ? (
                    <div className="flex flex-col gap-6 w-full lg:max-w-[248px]">
                        <div className=" p-4 rounded-[15px] bg-[#38383863] text-[#B3B3B3]">
                            <Heading size="3">
                                How do I get an “automated” label on Twitter?
                            </Heading>
                            <Text>To set the “automated” label:</Text>
                            <div className="mt-3 text-[12px]">
                                <ul className=" list-decimal pl-3">
                                    <li>Go to the agent’s Twitter.</li>
                                    <li className="mt-2">Select ‘Settings’.</li>
                                    <li className="mt-2">
                                        Select ‘Your Account’.
                                    </li>
                                    <li className="mt-2">
                                        Select “Account Information’.
                                    </li>
                                    <li className="mt-2">
                                        Select ‘Automation’ and bind the
                                        managing account. Top Hat cannot be the
                                        managing account.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className=" p-4 rounded-[15px] bg-[#38383863] text-[#B3B3B3]">
                            <Heading size="3">
                                My Agent is not Tweeting, how can I debug?
                            </Heading>
                            <div className="mt-3 text-[12px]">
                                <ul className=" list-decimal pl-3">
                                    <li>
                                        Check if the Twitter account is bound.
                                        Use the “/reply” and “/quote” commands
                                        to test the connection on a tweet.
                                    </li>
                                    <li className="mt-2">
                                        If the connection is good, verify that
                                        the relevant functions are turned on.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}
