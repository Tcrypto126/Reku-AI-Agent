//@ts-ignore
import { UUID, Character, Clients } from "@elizaos/core";
// import { CharacterType } from "../types";

const BASE_URL =
    import.meta.env.VITE_SERVER_BASE_URL ||
    `${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}`;

export const fetcher = async ({
    url,
    method,
    body,
    headers,
}: {
    url: string;
    method?: "GET" | "POST";
    body?: object | FormData;
    headers?: HeadersInit;
}) => {
    const token = localStorage.getItem("walletToken");
    const options: RequestInit = {
        method: method ?? "GET",
        headers: headers
            ? headers
            : {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
    };

    if (method === "POST") {
        if (body instanceof FormData) {
            if (options.headers && typeof options.headers === "object") {
                // Create new headers object without Content-Type
                options.headers = Object.fromEntries(
                    Object.entries(
                        options.headers as Record<string, string>
                    ).filter(([key]) => key !== "Content-Type")
                );
            }
            options.body = body;
        } else {
            options.body = JSON.stringify(body);
        }
    }

    return fetch(`${BASE_URL}${url}`, options).then(async (resp) => {
        const contentType = resp.headers.get("Content-Type");
        if (contentType === "audio/mpeg") {
            return await resp.blob();
        }

        if (!resp.ok) {
            const errorText = await resp.text();
            console.error("Error: ", errorText);

            let errorMessage = "An error occurred";

            try {
                const errorObj = await JSON.parse(errorText);
                errorMessage = errorObj.message || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        return resp.json();
    });
};

export const apiClient = {
    sendMessage: (
        agentId: string,
        message: string,
        selectedFile?: File | null
    ) => {
        const formData = new FormData();
        formData.append("text", message);
        formData.append("user", "user");

        if (selectedFile) {
            formData.append("file", selectedFile);
        }
        return fetcher({
            url: `/${agentId}/message`,
            method: "POST",
            body: formData,
        });
    },
    getAgents: () => fetcher({ url: "/agents" }),
    getAgent: (agentId: string): Promise<{ id: UUID; character: Character }> =>
        fetcher({ url: `/agents/${agentId}` }),
    tts: (agentId: string, text: string) =>
        fetcher({
            url: `/${agentId}/tts`,
            method: "POST",
            body: {
                text,
            },
            headers: {
                "Content-Type": "application/json",
                Accept: "audio/mpeg",
                "Transfer-Encoding": "chunked",
            },
        }),
    whisper: async (agentId: string, audioBlob: Blob) => {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");
        return fetcher({
            url: `/${agentId}/whisper`,
            method: "POST",
            body: formData,
        });
    },
    createAgent: async (values: any) => {
        const walletAddress = localStorage.getItem("walletAddress");
        const { name, description, personality, instruction } = values;

        const character = {
            name,
            description,
            personality,
            instruction,
            walletAddress: walletAddress,
        };

        return await fetcher({
            url: "/agent/start",
            method: "POST",
            body: { customCharacter: character },
        });
    },
    updateAgent: async (
        //@ts-ignore
        agentId: UUID,
        values: any,
        currentCharacter: Character
    ) => {
        const {
            name,
            description,
            personality,
            instruction,
            knowledgeBase,
            token,
            botUsername,
            activeButton,
            contractAddress,
            credits,
            totalCredits,
            avatar,
        } = values;

        let newCharacter: Character;
        if (name) { 
            newCharacter = {
                ...currentCharacter,
                name,
                description,
                personality,
                instruction,
                credits: (currentCharacter.credits ?? 0) - 1,
                settings: {
                    ...currentCharacter.settings,
                    secrets: {
                        TELEGRAM_BOT_TOKEN:
                            currentCharacter.telegramBotToken ?? "",
                        DISCORD_API_TOKEN:
                            currentCharacter.discordAPIToken ?? "",
                    },
                },
            };
        } else if (knowledgeBase) {
            newCharacter = {
                ...currentCharacter,
                knowledgeBase,
                settings: {
                    ...currentCharacter.settings,
                    secrets: {
                        TELEGRAM_BOT_TOKEN:
                            currentCharacter.telegramBotToken ?? "",
                        DISCORD_API_TOKEN:
                            currentCharacter.discordAPIToken ?? "",
                    },
                },
            };
        } else if (activeButton === "credits") {
            newCharacter = {
                ...currentCharacter,
                credits,
                totalCredits,
                settings: {
                    ...currentCharacter.settings,
                    secrets: {
                        TELEGRAM_BOT_TOKEN:
                            currentCharacter.telegramBotToken ?? "",
                        DISCORD_API_TOKEN:
                            currentCharacter.discordAPIToken ?? "",
                    },
                },
            };
        } else if (activeButton === "BindToken") {
            newCharacter = {
                ...currentCharacter,
                contractAddress,
                avatar: avatar ?? currentCharacter.avatar,
                settings: {
                    ...currentCharacter.settings,
                    secrets: {
                        TELEGRAM_BOT_TOKEN:
                            currentCharacter.telegramBotToken ?? "",
                        DISCORD_API_TOKEN:
                            currentCharacter.discordAPIToken ?? "",
                    },
                },
            };
        } else if (activeButton === "Telegram") {
            newCharacter = {
                ...currentCharacter,
                telegramBotToken: token,
                telegramBotUsername: botUsername,
                settings: {
                    ...currentCharacter.settings,
                    secrets: {
                        TELEGRAM_BOT_TOKEN: token,
                        DISCORD_API_TOKEN:
                            currentCharacter.discordAPIToken ?? "",
                    },
                },
            };
        } else if (activeButton === "Discord") {
            newCharacter = {
                ...currentCharacter,
                discordAPIToken: token,
                discordBotUsername: botUsername,
                settings: {
                    ...currentCharacter.settings,
                    secrets: {
                        DISCORD_API_TOKEN: token,
                        TELEGRAM_BOT_TOKEN:
                            currentCharacter.telegramBotToken ?? "",
                    },
                },
            };
        } else {
            newCharacter = {
                ...currentCharacter,
                settings: {
                    ...currentCharacter.settings,
                    secrets: {
                        TELEGRAM_BOT_TOKEN:
                            currentCharacter.telegramBotToken ?? "",
                        DISCORD_API_TOKEN:
                            currentCharacter.discordAPIToken ?? "",
                    },
                },
            };
        }

        console.log("new characer: ", newCharacter);

        return await fetcher({
            url: `/agents/${agentId}/set`,
            method: "POST",
            body: { character: newCharacter },
        });
    },
    getMyAgents: async () => {
        return await fetcher({ url: "/agents" });
    },
    getWalletToken: async (walletAddress: string) => {
        const { token } = await fetcher({
            url: "/wallet-token",
            method: "POST",
            body: {
                walletAddress,
            },
        });
        return token;
    },
};
