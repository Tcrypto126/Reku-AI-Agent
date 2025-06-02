import { Button } from "@radix-ui/themes";
import { useState } from "react";

import { TGIcon } from "./icons";
import { DiscordIcon } from "./icons";
import { XIcon } from "./icons";
import { TiktokIcon } from "./icons";
import { TwitchIcon } from "./icons";

import ComingSoonBadge from "./comingSoonBadge";

interface ButtonProps {
    name: string;
    position: string;
    activeButton: string;
    setActiveButton: (name: string) => void;
}

interface IconProps {
    name: string;
    onMouseOver: boolean;
    activeButton: string;
}

const IconSetting: React.FC<IconProps> = ({
    name,
    onMouseOver,
    activeButton,
}) => {
    return (
        <div>
            {name === "Telegram" ? (
                <TGIcon
                    width="24"
                    height="24"
                    color={
                        onMouseOver
                            ? "#D4D4D899"
                            : activeButton === name
                            ? "#fff"
                            : "#6e5d80"
                    }
                />
            ) : name === "Discord" ? (
                <DiscordIcon
                    width="24"
                    height="24"
                    color={
                        onMouseOver
                            ? "#D4D4D899"
                            : activeButton === name
                            ? "#fff"
                            : "#6e5d80"
                    }
                />
            ) : name === "Twitter" ? (
                <XIcon
                    width="24"
                    height="24"
                    color={
                        onMouseOver
                            ? "#D4D4D899"
                            : activeButton === name
                            ? "#fff"
                            : "#6e5d80"
                    }
                />
            ) : name === "Tiktok" ? (
                <TiktokIcon
                    width="24"
                    height="24"
                    color={
                        onMouseOver
                            ? "#D4D4D899"
                            : activeButton === name
                            ? "#fff"
                            : "#6e5d80"
                    }
                />
            ) : name === "Twitch" ? (
                <TwitchIcon
                    width="24"
                    height="24"
                    color={
                        onMouseOver
                            ? "#D4D4D899"
                            : activeButton === name
                            ? "#fff"
                            : "#6e5d80"
                    }
                />
            ) : (
                <div>No Telegram Icon</div> // Fallback when telegram is false or undefined
            )}
        </div>
    );
};

const SocialButton: React.FC<ButtonProps> = ({
    name,
    position,
    activeButton,
    setActiveButton,
}) => {
    const [onMouseOver, setOnMouseOver] = useState(false);
    // const [active, setActive] = useState(false);
    //@ts-ignore
    const [buttonType, setButtonType] = useState("");

    return (
        <>
            <Button
                className={`!relative !h-[40px] !p-0 !px-3 md:!px-5 !rounded-none ${
                    position === "0"
                        ? "!rounded-l-[10px]"
                        : position === "1"
                        ? ""
                        : "!rounded-r-[10px]"
                } !text-[12px] md:!text-[16px] !cursor-pointer !transition-all !duration-300 ${
                    onMouseOver
                        ? "!bg-[#3E1F4799] !text-[#D4D4D899]"
                        : activeButton === name
                        ? "!bg-[#3E1F47] !text-[#ffffff]"
                        : "!bg-[#1b1b1b] !text-[#6e5d80]"
                }`}
                style={{
                    borderLeft: position === "1" ? "1px solid #979797" : "none",
                    borderRight:
                        position === "1" ? "1px solid #979797" : "none",
                }}
                onClick={() => {
                    setActiveButton(name);
                }}
                onMouseOver={() => {
                    setOnMouseOver(true);
                }}
                onMouseOut={() => {
                    setOnMouseOver(false);
                }}
            >
                {name !== "Knowledge Base" &&
                    name !== "Webpage Uploads" &&
                    name !== "APIs" &&
                    name !== "Edit the Prompt" &&
                    name !== "Scenario Testing" &&
                    name !== "Testing Chatroom" && (
                        <IconSetting
                            name={name}
                            onMouseOver={onMouseOver}
                            activeButton={activeButton}
                        />
                    )}

                {name}

                {name === "Tiktok" && <ComingSoonBadge />}
                {name === "Twitch" && <ComingSoonBadge />}
                {name === "Testing Chatroom" && <ComingSoonBadge />}
            </Button>
        </>
    );
};

export default SocialButton;
