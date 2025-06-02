import { useParams } from "react-router";
import { UUID } from "@elizaos/core";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import {
    Heading,
    Button,
    Badge,
    Text,
    TextField,
    Tabs,
    Box,
    Select,
} from "@radix-ui/themes";
import TruncatedText from "@/components/ui/trancateText";

import avatar from "/assets/avatar/avatar.png";
import tronBadge from "/assets/badge/tron-badge.png";
import verifyBadge from "/assets/badge/verify-badge.png";

import { TGIcon } from "@/components/ui/icons";
import { DiscordIcon } from "@/components/ui/icons";
import { XIcon } from "lucide-react";
import { TokenIcon } from "@/components/ui/icons";
import { EditIcon } from "@/components/ui/icons";
import checkIcon from "/assets/buttonIcon/checked.svg";
import minusIcon from "/assets/buttonIcon/minus.svg";
import { TopUpIcon } from "@/components/ui/icons";

import { useState } from "react";
import BindChat from "@/components/bindChat";
import BindSocial from "@/components/bindSocial";
import CreateToken from "@/components/createToken";
import AdvancedComp from "@/components/advancedComp";
import PromptTesting from "@/components/promptTesting";
import TopUp from "@/components/topUp";

export default function MyAgent() {
    //@ts-ignore
    const [isVerify, setIsVerify] = useState(false);
    //@ts-ignore
    const [isConnectX, setIsConnectX] = useState(false);
    //@ts-ignore
    const [activeStatus, setActiveStatus] = useState(true);
    const [isPromoCode, setIsPromoCode] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [tabValue, setTabValue] = useState("chat");
    const [activeButton, setActiveButton] = useState("Telegram");

    const { agentId } = useParams<{ agentId: UUID }>();

    const query = useQuery({
        queryKey: ["agent", agentId],
        queryFn: () => apiClient.getAgent(agentId ?? ""),
        refetchInterval: 3_000,
        enabled: Boolean(agentId),
    });

    if (!agentId) return <div>No data.</div>;

    const character = query?.data?.character;

    console.log("my character: ", character);

    if (!character) return null;

    return (
        <>
            <div className="flex flex-col gap-10 p-4">
                <div className="flex flex-col lg:flex-row gap-5 justify-between items-start">
                    <div className="flex gap-5 items-center">
                        <div className="flex gap-5 flex-wrap">
                            <img
                                src={
                                    character.avatar == ""
                                        ? avatar
                                        : character.avatar
                                }
                                alt="avatar"
                                width={112}
                                height={112}
                                className="rounded-[10px]"
                            />
                            <div className="flex gap-2 flex-col justify-between">
                                <div className="flex gap-3 items-center flex-wrap">
                                    <Heading style={{ fontSize: "30px" }}>
                                        {character.name}
                                    </Heading>
                                    <Badge className="!bg-transparent !p-0">
                                        <img
                                            src={tronBadge}
                                            alt="tron badge"
                                            width={24}
                                            height={24}
                                            className="rounded-[100%]"
                                        />
                                    </Badge>
                                    {isVerify ? (
                                        <Badge className="!bg-transparent !p-0">
                                            <img
                                                src={verifyBadge}
                                                alt="verify badge"
                                                width={24}
                                                height={24}
                                                className="rounded-[100%]"
                                            />
                                        </Badge>
                                    ) : (
                                        <Text className="!text-[14px] text-[#B3B3B3] !bg-[#252525] !px-1 !py-[2px] !rounded-[5px]">
                                            Unverified
                                        </Text>
                                    )}
                                    <Text
                                        className="flex items-center gap-1 !text-[14px] cursor-pointer text-[#B3B3B3] !bg-[#252525] !px-1 !py-[2px] !rounded-[5px]"
                                        onClick={() => {
                                            setTabValue("prompt");
                                        }}
                                    >
                                        <EditIcon width="12" height="12" /> edit
                                    </Text>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        onClick={() => {
                                            setActiveButton("Telegram");
                                            setTabValue("chat");
                                        }}
                                        className="!bg-[#252525] hover:!bg-[#373737] !px-2 !h-[36px] !p-0 !cursor-pointer !text-[14px] !text-[#D4D4D8]"
                                    >
                                        {character.telegramBotUsername ? (
                                            <div className="relative flex gap-2 text-white">
                                                <TGIcon
                                                    width="22"
                                                    height="22"
                                                />
                                                <img
                                                    src={checkIcon}
                                                    alt="check"
                                                    width={15}
                                                    height={15}
                                                    className="absolute top-3 left-3"
                                                />
                                                <Text className="">
                                                    @
                                                    {
                                                        character.telegramBotUsername
                                                    }
                                                </Text>
                                            </div>
                                        ) : (
                                            <div className="relative flex gap-2">
                                                <TGIcon
                                                    width="22"
                                                    height="22"
                                                />
                                                <img
                                                    src={minusIcon}
                                                    alt="check"
                                                    width={15}
                                                    height={15}
                                                    className="absolute top-3 left-3"
                                                />
                                                Telegram
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setActiveButton("Discord");
                                            setTabValue("chat");
                                        }}
                                        className="!bg-[#252525] hover:!bg-[#373737] !px-2 !h-[36px] !p-0 !cursor-pointer !text-[14px] !text-[#D4D4D8]"
                                    >
                                        {character.discordBotUsername ? (
                                            <div className="relative flex gap-2 text-white">
                                                <DiscordIcon
                                                    width="22"
                                                    height="22"
                                                />
                                                <img
                                                    src={checkIcon}
                                                    alt="check"
                                                    width={15}
                                                    height={15}
                                                    className="absolute top-3 left-3"
                                                />
                                                <Text className="">
                                                    @
                                                    {
                                                        character.discordBotUsername
                                                    }
                                                </Text>
                                            </div>
                                        ) : (
                                            <div className="relative flex gap-2">
                                                <DiscordIcon
                                                    width="22"
                                                    height="22"
                                                />
                                                <img
                                                    src={minusIcon}
                                                    alt="check"
                                                    width={15}
                                                    height={15}
                                                    className="absolute top-3 left-3"
                                                />
                                                Discord
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setTabValue("social");
                                        }}
                                        className="!bg-[#252525] hover:!bg-[#373737] !px-2 !h-[36px] !p-0 !cursor-pointer !text-[14px] !text-[#D4D4D8]"
                                    >
                                        {isConnectX ? (
                                            <div className="relative flex gap-2">
                                                <XIcon width="22" height="22" />
                                                <img
                                                    src={checkIcon}
                                                    alt="check"
                                                    width={15}
                                                    height={15}
                                                    className="absolute top-3 left-3"
                                                />
                                                Twitter
                                            </div>
                                        ) : (
                                            <div className="relative flex gap-2">
                                                <XIcon width="22" height="22" />
                                                <img
                                                    src={minusIcon}
                                                    alt="check"
                                                    width={15}
                                                    height={15}
                                                    className="absolute top-3 left-3"
                                                />
                                                Twitter
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setTabValue("token");
                                        }}
                                        className="!bg-[#252525] hover:!bg-[#373737] !px-2 !h-[36px] !p-0 !cursor-pointer !text-[14px] !text-[#D4D4D8]"
                                    >
                                        {character.contractAddress ? (
                                            <div className="relative flex gap-2 text-white">
                                                <TokenIcon
                                                    width="22"
                                                    height="22"
                                                />
                                                <img
                                                    src={checkIcon}
                                                    alt="check"
                                                    width={15}
                                                    height={15}
                                                    className="absolute top-3 left-3"
                                                />
                                                <TruncatedText
                                                    option="middle"
                                                    text={
                                                        character.contractAddress ??
                                                        ""
                                                    }
                                                    maxLength={9}
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative flex gap-2">
                                                <TokenIcon
                                                    width="22"
                                                    height="22"
                                                />
                                                <img
                                                    src={minusIcon}
                                                    alt="check"
                                                    width={15}
                                                    height={15}
                                                    className="absolute top-3 left-3"
                                                />
                                                Token
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full lg:w-[307px] py-3 px-5 rounded-[12px] bg-[#282a2e]">
                        <div className="flex gap-16 justify-between">
                            <div className="flex flex-col justify-between gap-5">
                                <div className="flex gap-2 items-center">
                                    <Text>Credits</Text>
                                    {(character.credits ?? 0) > 0 ? (
                                        <Badge color="cyan" variant="solid">
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge
                                            color="red"
                                            variant="outline"
                                            className="!bg-orange-100"
                                        >
                                            Inactive
                                        </Badge>
                                    )}
                                </div>
                                <div>
                                    <Text size="7">{character.credits}</Text>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 items-center">
                                <Button
                                    className="flex gap-2 text-[14px] !cursor-pointer !min-w-[96px]"
                                    onClick={() => {
                                        setTabValue("topUp");
                                    }}
                                >
                                    <TopUpIcon width="18" height="18" />
                                    Top Up
                                </Button>
                                <Text
                                    size="1"
                                    className="!text-[#b3b3b3] underline !cursor-pointer"
                                    onClick={() => {
                                        isPromoCode
                                            ? setIsPromoCode(false)
                                            : setIsPromoCode(true);
                                    }}
                                >
                                    Promo code
                                </Text>
                            </div>
                        </div>
                        {isPromoCode ? (
                            <div className="flex gap-2 justify-between items-center mt-2">
                                <div>
                                    <TextField.Root
                                        className="!h-[32px] !text-[12px]"
                                        placeholder="Promo code"
                                        onChange={(e) => {
                                            setPromoCode(e.target.value);
                                        }}
                                    ></TextField.Root>
                                </div>
                                <Button
                                    disabled={promoCode ? false : true}
                                    className="!text-[12px] !cursor-pointer"
                                >
                                    Verify
                                </Button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className="">
                    <Tabs.Root
                        defaultValue="chat"
                        value={tabValue}
                        onValueChange={setTabValue}
                        className="flex flex-col md:flex-row gap-6"
                    >
                        <div className="block md:hidden">
                            <Select.Root
                                defaultValue="chat"
                                value={tabValue}
                                onValueChange={(value) => {
                                    setTabValue(value);
                                }}
                            >
                                <Select.Trigger className="!w-full" />
                                <Select.Content className="">
                                    <Select.Item value="profile">
                                        Create A Profile *
                                    </Select.Item>
                                    <Select.Item value="chat">
                                        Bind Chat Interface *
                                    </Select.Item>
                                    <Select.Item value="social">
                                        Bind Social Media
                                    </Select.Item>
                                    <Select.Item value="token">
                                        Create A Token
                                    </Select.Item>
                                    <Select.Item value="advanced">
                                        Advanced
                                    </Select.Item>
                                    <Select.Item value="prompt">
                                        Prompt Testing Sandbox
                                    </Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </div>
                        <div className="hidden md:block">
                            <Tabs.List className="inline-block border-r pr-5 !shadow-none ">
                                <Box className="px-4 py-6">
                                    <Tabs.Trigger
                                        className="!w-full !justify-start cursor-not-allowed !text-[#696969]"
                                        value="profile"
                                        disabled
                                    >
                                        Create A Profile *
                                        <Badge className="!px-[3px] !py-0 !ml-5">
                                            <Text className="!text-[9px]">
                                                Coming Soon
                                            </Text>
                                        </Badge>
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="!w-full !justify-start !cursor-pointer"
                                        value="chat"
                                    >
                                        Bind Chat Interface *
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="!w-full !justify-start !cursor-pointer"
                                        value="social"
                                    >
                                        Bind Social Media
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="!w-full !justify-start !cursor-pointer"
                                        value="token"
                                    >
                                        Create A Token
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="!w-full !justify-start !cursor-pointer"
                                        value="advanced"
                                    >
                                        Advanced
                                    </Tabs.Trigger>
                                    <Tabs.Trigger
                                        className="!w-full !justify-start !cursor-pointer"
                                        value="prompt"
                                    >
                                        Prompt Testing Sandbox
                                    </Tabs.Trigger>
                                </Box>
                            </Tabs.List>
                        </div>
                        <Tabs.Content value="profile" className="flex-1">
                            {/* <ProfileForm /> */}
                            Profile
                        </Tabs.Content>
                        <Tabs.Content value="chat" className="flex-1">
                            <BindChat
                                agentId={agentId}
                                character={character}
                                activeButton={activeButton}
                                setActiveButton={setActiveButton}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="social" className="flex-1">
                            <BindSocial agentId={agentId} />
                        </Tabs.Content>
                        <Tabs.Content value="token" className="flex-1">
                            <CreateToken
                                agentId={agentId}
                                character={character}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="advanced" className="flex-1">
                            <AdvancedComp
                                agentId={agentId}
                                character={character}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="prompt" className="flex-1">
                            <PromptTesting
                                agentId={agentId}
                                character={character}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="topUp" className="flex-1">
                            <TopUp
                                agentId={agentId}
                                character={character}
                                setIsClose={() => {}}
                            />
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </>
    );
}
