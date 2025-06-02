import { Heading, Button, Text, TextField } from "@radix-ui/themes";
import SocialButton from "./ui/socialButton";
import * as Yup from "yup";
import { useState } from "react";
import { NavLink } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { UUID, Character } from "@elizaos/core";
import { Formik, Form } from "formik";

interface FormType {
    token: string;
}

export default function BindChat({
    agentId,
    character,
    activeButton,
    setActiveButton,
}: {
    agentId: UUID;
    character: Character;
    activeButton: string;
    setActiveButton: (value: string) => void
}) {
    const { toast } = useToast();
    const queryClient = new QueryClient();
    const [botToken, setBotToken] = useState<string>("");
    // const [inviteLink, setInviteLink] = useState<string>("");

    const validationSchema = Yup.object({
        token: Yup.string().required("Token is Required"),
    });

    const mutation = useMutation({
        mutationFn: async (values: FormType) => {
            return await apiClient.updateAgent(agentId, values, character);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            setTimeout(() => {
                toast({
                    title: "Success",
                    description: "Updated your agent successfully!",
                    variant: "default",
                });
            }, 500);
        },
        onError: (err: any) => {
            setTimeout(() => {
                toast({
                    title: "Error",
                    description: err.message,
                    variant: "destructive",
                });
            }, 500);
        },
    });

    const handleSubmit = async (values: any = { token: "" }) => {
        const token = values.token;
        const newValues = {
            ...values,
            activeButton,
        };

        if (activeButton === "Telegram") {
            if (token !== "") {
                try {
                    // Make a request to get the bot info
                    const response = await fetch(
                        `https://api.telegram.org/bot${token}/getMe`
                    );
                    const data = await response.json();

                    if (data.ok) {
                        // Handle success (data contains bot info)
                        try {
                            console.log("Bot Info:", data.result);
                            const values = {
                                ...newValues,
                                botUsername: data.result.username,
                            };

                            mutation.mutate(values);
                        } catch (err) {
                            console.error(err);
                        }
                    } else {
                        // Handle error (e.g., token might be invalid)
                        toast({
                            title: "Error",
                            description: "Invalid telegram bot token",
                            variant: "destructive",
                        });
                        console.error("Errors:", data.description);
                    }
                } catch (error) {
                    console.error("Token validation failed: ", error);
                }
            } else {
                const values = {
                    ...newValues,
                    botUsername: "",
                };
                mutation.mutate(values);
            }
        } else {
            console.log("Discord bot token: ", newValues);
            if (token !== "") {
                try {
                    const response = await fetch(
                        "https://discord.com/api/v10/users/@me",
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bot ${token}`, // For bot tokens, prepend "Bot "
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const data = await response.json(); // Parse the JSON response

                    if (response.ok) {
                        console.log("Bot Info:", data);
                        const values = {
                            ...newValues,
                            botUsername: data.username,
                        };
                        console.log("values: ", values);

                        mutation.mutate(values);
                    } else {
                        toast({
                            title: "Error",
                            description: "Invalid Discord API token",
                            variant: "destructive",
                        });
                        console.error("Errors:", data.message);
                    }
                } catch (error) {
                    console.error("Token validation failed:", error);
                }
            } else {
                const values = {
                    ...newValues,
                    botUsername: "",
                };
                mutation.mutate(values);
            }
        }
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-10 justify-between">
                <div className="w-full max-w-[716px] flex flex-col gap-8 px-0 md:px-10">
                    <div className="flex justify-center">
                        <SocialButton
                            name="Telegram"
                            position="0"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                        <SocialButton
                            name="Discord"
                            position="2"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                    </div>
                    {activeButton === "Telegram" ? (
                        <div className="flex flex-col">
                            {!character.telegramBotUsername ? (
                                <div className="flex flex-col">
                                    <Text className="!text-[18px] !text-[#d4d4d8]">
                                        Bind Telegram Interface (Free)
                                    </Text>
                                    <Text className="!text-[13px] !text-[#b3b3b3]">
                                        Set Your Telegram BOT Token to interact
                                        with the agent
                                    </Text>
                                    <Formik
                                        initialValues={{
                                            token: "",
                                        }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ handleChange }) => (
                                            <Form>
                                                <TextField.Root
                                                    name="token"
                                                    id="token"
                                                    size="3"
                                                    placeholder="Telegram bot token"
                                                    onChange={(e) => {
                                                        setBotToken(
                                                            e.target.value
                                                        );
                                                        handleChange(e); // Make sure Formik handles change as well
                                                    }}
                                                    className="!text-[13px] my-4"
                                                >
                                                    <TextField.Slot
                                                        side="right"
                                                        px="1"
                                                    >
                                                        <Button
                                                            type="submit"
                                                            loading={
                                                                mutation.isPending
                                                            }
                                                            size="2"
                                                            disabled={!botToken} // More concise check
                                                            className="!cursor-pointer"
                                                        >
                                                            Confirm
                                                        </Button>
                                                    </TextField.Slot>
                                                </TextField.Root>
                                            </Form>
                                        )}
                                    </Formik>
                                    <div className="text-[#b3b3b3] text-[13px]">
                                        <ul className=" list-decimal pl-4">
                                            <li>
                                                Open{" "}
                                                <NavLink
                                                    to="https://t.me/botfather"
                                                    target="_blank"
                                                    className="underline text-[#d4d4d8]"
                                                >
                                                    t.me/botfather
                                                </NavLink>
                                                , Telegram's official Bot
                                                creation tool
                                            </li>
                                            <li>
                                                Send{" "}
                                                <span className="text-[#d4d4d8]">
                                                    /newbot
                                                </span>{" "}
                                                to create your bot, it will
                                                return a Bot token after setting
                                                the name.Copy and paste the bot
                                                token here
                                            </li>
                                            <li>
                                                Edit the bot’s information/add
                                                pfp in the Bot Father. You can
                                                edit the bot's pfp in [Edit bot
                                                pic]
                                            </li>
                                            <li>
                                                Optional: Bind the Telegram
                                                group chat so your agent is only
                                                talks there. You can unbind or
                                                rebind the agent to a different
                                                bot/group chat any time.
                                            </li>
                                            <li>
                                                Make the bot an admin in your
                                                group chat, tag @youragent to
                                                start.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <Text className="!text-[18px] !text-[#d4d4d8]">
                                        Current Telegram Bot
                                    </Text>
                                    <div className="flex gap-5 !text-[#BEACFE] items-center flex-wrap">
                                        <Text className="!text-[20px] !font-bold">
                                            @{character.telegramBotUsername}
                                        </Text>
                                        <Button
                                            variant="ghost"
                                            loading={mutation.isPending}
                                            className="!cursor-pointer !bg-[#6a608f85] !ml-0"
                                            onClick={() => {
                                                handleSubmit();
                                            }}
                                        >
                                            Unbind
                                        </Button>
                                    </div>
                                    <Text className="!text-[18px] !text-[#d4d4d8] !mt-5">
                                        Current Telegram Bot
                                    </Text>
                                    <Text className="!text-[13px]">
                                        Bind the Telegram group chat so the
                                        agent will only be active there{" "}
                                        <span className="text-[#BEACFE] font-bold">
                                            (admin rights needed)
                                        </span>
                                        , the group chat link will be shown in
                                        the agent's profile on the discovery
                                        page. If the agent isn't bound to any
                                        group chats, it will be active in all
                                        group chats it's added too.
                                    </Text>
                                    {/* <Formik
                                        initialValues={{
                                            inviteLink: "",
                                        }}
                                        onSubmit={handleInvite}
                                    >
                                        {({ handleChange }) => (
                                            <Form>
                                                <TextField.Root
                                                    name="inviteLink"
                                                    size="3"
                                                    placeholder="Enter chat invite link"
                                                    onChange={(e) => {
                                                        setInviteLink(
                                                            e.target.value
                                                        );
                                                        handleChange(e);
                                                    }}
                                                    className="!text-[13px] my-4"
                                                >
                                                    <TextField.Slot
                                                        side="right"
                                                        px="1"
                                                    >
                                                        <Button
                                                            type="submit"
                                                            // loading={
                                                            //     mutation.isPending
                                                            // }
                                                            size="2"
                                                            disabled={
                                                                !inviteLink
                                                            }
                                                            className="!cursor-pointer"
                                                        >
                                                            Bind
                                                        </Button>
                                                    </TextField.Slot>
                                                </TextField.Root>
                                            </Form>
                                        )}
                                    </Formik> */}
                                </div>
                            )}

                            <div className="mt-10 flex justify-center">
                                <iframe
                                    height="340"
                                    className="w-full"
                                    src="https://www.youtube.com/embed/ccMDV6DLDLs"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {!character.discordBotUsername ? (
                                <div className="flex flex-col">
                                    <Text className="!text-[18px] !text-[#d4d4d8]">
                                        Bind Discord Interface(Free)
                                    </Text>
                                    <Formik
                                        initialValues={{
                                            token: "",
                                        }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ handleChange }) => (
                                            <Form>
                                                <TextField.Root
                                                    name="token"
                                                    size="3"
                                                    placeholder="Discord bot token"
                                                    onChange={(e) => {
                                                        setBotToken(
                                                            e.target.value
                                                        );
                                                        handleChange(e);
                                                    }}
                                                    className="!text-[13px] my-4"
                                                >
                                                    <TextField.Slot
                                                        side="right"
                                                        px="1"
                                                    >
                                                        <Button
                                                            type="submit"
                                                            loading={
                                                                mutation.isPending
                                                            }
                                                            size="2"
                                                            disabled={!botToken}
                                                            className="!cursor-pointer"
                                                        >
                                                            Confirm
                                                        </Button>
                                                    </TextField.Slot>
                                                </TextField.Root>
                                            </Form>
                                        )}
                                    </Formik>
                                    <div className="text-[#b3b3b3] text-[13px]">
                                        <ul className=" list-decimal pl-4">
                                            <li>
                                                Open{" "}
                                                <NavLink
                                                    to="https://discord.com/developers"
                                                    target="_blank"
                                                    className="underline text-[#d4d4d8]"
                                                >
                                                    Discord Developer Portal
                                                </NavLink>
                                                .
                                            </li>
                                            <li>Create a New Application.</li>
                                            <li>
                                                Navigate to the Bot tab on the
                                                left:
                                                <ul className=" list-disc pl-5">
                                                    <li>
                                                        If you don’t have a
                                                        token, click Reset Token
                                                        to generate one.
                                                    </li>
                                                    <li>
                                                        Ensure Message Content
                                                        Intent is turned ON.
                                                    </li>
                                                    <li>
                                                        Copy the bot token and
                                                        paste it here to bind.
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                Go to the OAuth2 {">"} URL
                                                Generator tab:
                                                <ul className=" list-disc pl-5">
                                                    <li>
                                                        Untick User Install.
                                                    </li>
                                                    <li>
                                                        Add bot under Default
                                                        Install Settings {">"}{" "}
                                                        Guild Install {">"}{" "}
                                                        Scopes.
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                Copy and open the generated
                                                install link in your browser to
                                                install the agent in your
                                                server.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <Text className="!text-[18px] !text-[#d4d4d8]">
                                        Current Discord Bot
                                    </Text>
                                    <div className="flex gap-5 !text-[#BEACFE] items-center flex-wrap">
                                        <Text className="!text-[20px] !font-bold">
                                            @{character.discordBotUsername}
                                        </Text>
                                        <Button
                                            variant="ghost"
                                            loading={mutation.isPending}
                                            className="!cursor-pointer !bg-[#6a608f85] !ml-0"
                                            onClick={() => {
                                                handleSubmit();
                                            }}
                                        >
                                            Unbind
                                        </Button>
                                    </div>
                                    {/* <Text className="!text-[18px] !text-[#d4d4d8] !mt-5">
                                        Bind Discord Server
                                    </Text>
                                    <Formik
                                        initialValues={{
                                            inviteLink: "",
                                        }}
                                        onSubmit={handleInvite}
                                    >
                                        {({ handleChange }) => (
                                            <Form>
                                                <TextField.Root
                                                    name="inviteLink"
                                                    size="3"
                                                    placeholder="Enter server invite link"
                                                    onChange={(e) => {
                                                        setInviteLink(
                                                            e.target.value
                                                        );
                                                        handleChange(e);
                                                    }}
                                                    className="!text-[13px] my-4"
                                                >
                                                    <TextField.Slot
                                                        side="right"
                                                        px="1"
                                                    >
                                                        <Button
                                                            type="submit"
                                                            // loading={
                                                            //     mutation.isPending
                                                            // }
                                                            size="2"
                                                            disabled={
                                                                !inviteLink
                                                            }
                                                            className="!cursor-pointer"
                                                        >
                                                            Bind
                                                        </Button>
                                                    </TextField.Slot>
                                                </TextField.Root>
                                            </Form>
                                        )}
                                    </Formik> */}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-6 w-full lg:max-w-[248px]">
                    <div className=" p-4 rounded-[15px] bg-[#38383863] text-[#B3B3B3]">
                        <Heading size="3">Pro Tips:</Heading>
                        <div className="mt-3 text-[12px]">
                            <ul className=" list-decimal pl-3">
                                <li>
                                    <b>Learning Through Interaction:</b>
                                    <br />
                                    Your agent learns and improves through chat
                                    interactions—the more you engage, the better
                                    it performs.
                                </li>
                                <li className="mt-2">
                                    <b>Memory Management:</b>
                                    <br />
                                    Chat memories are saved locally, so agents
                                    retain their memory even if you delete the
                                    chat history. However, unbinding and
                                    rebinding to a different group chat will
                                    reset their memory.
                                </li>
                                <li className="mt-2">
                                    <b>Prompt Adjustments:</b>
                                    <br />
                                    For recurring instructions or personality
                                    adjustments, update the prompt. The prompt
                                    acts as the DNA, while chat interactions
                                    shape personality manifestations over time.
                                </li>
                                <li className="mt-2">
                                    <b>Chat as Command Center:</b>
                                    <br />
                                    The chat serves as the main interface and
                                    command center; DMs with the agent are not
                                    currently supported.
                                </li>
                                <li className="mt-2">
                                    <b>Group Chat Binding:</b>
                                    <br />
                                    Binding to a group chat is optional. Without
                                    binding, your agent can interact in multiple
                                    group chats, but this may lead to
                                    unauthorized usage that consumes credits.
                                </li>
                            </ul>
                        </div>
                    </div>
                    {activeButton === "Telegram" && (
                        <div className=" p-4 rounded-[15px] bg-[#38383863] text-[#B3B3B3]">
                            <Heading size="3">
                                My Agent is not responding, what should I do?
                            </Heading>
                            <div className="mt-3 text-[12px]">
                                <ul className=" list-decimal pl-3">
                                    <li>
                                        Ensure the agent is bound to a group
                                        chat, not a channel. Rebind the group if
                                        necessary.
                                    </li>
                                    <li className="mt-2">
                                        Verify that the agent has admin rights
                                        in the group chat.
                                    </li>
                                    <li className="mt-2">
                                        Tag the agent to initiate the
                                        conversation.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
