import SocialButton from "./ui/socialButton";
import { useState } from "react";
import * as Yup from "yup";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Formik, Form } from "formik";
import {
    Button,
    Flex,
    RadioGroup,
    Select,
    Spinner,
    Text,
    TextArea,
} from "@radix-ui/themes";
import FormField from "./ui/formField";
import { Character, UUID } from "@elizaos/core";

interface CharacterType {
    name: string;
    description: string;
    personality: string;
    instruction: string;
}

export default function PromptTesting({
    agentId,
    character,
}: {
    agentId: UUID;
    character: Character;
}) {
    const { toast } = useToast();
    const queryClient = new QueryClient();
    const [activeButton, setActiveButton] = useState<string>("Edit the Prompt");
    const [response, setResponse] = useState("");
    const [isResponse, setIsResponse] = useState(false);
    //@ts-ignore
    const [selectedOption, setSelectedOption] = useState("telegram");
    const [message, setMessage] = useState("");

    const validationSchema = Yup.object({
        name: Yup.string()
            .max(50, "Must be 50 characters or less")
            .required("Name is Required"),
        description: Yup.string().required("Description is required"),
        personality: Yup.string().required("Personality is required"),
        instruction: Yup.string().required("Instruction is required"),
    });

    const mutation = useMutation({
        mutationFn: async (values: CharacterType) => {
            return await apiClient.updateAgent(agentId, values, character);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            toast({
                title: "Success",
                description: "Updated your agent successfully!",
                variant: "default",
            });
        },
        onError: (err: any) => {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        },
    });

    const updatePrompt = (values: any) => {
        if ((character.credits ?? 0) < 1) {
            console.error(
                "Failed to update the prompt! Please charge your credits"
            );
            toast({
                title: "Error",
                description:
                    "You don't have enough credits! Please click the 'Top Up' button to recharge.",
                variant: "destructive",
            });
        } else {
            mutation.mutate(values);
        }
    };

    // Handle change in Select component
    const handleSelectChange = (event: any) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async () => {
        setIsResponse(true);
        setResponse("");

        if (!message) return;

        try {
            const res = await apiClient.sendMessage(agentId, message);

            if (!res || !Array.isArray(res) || res.length === 0) {
                console.error("No valid response received");
                return;
            }

            // Assuming the response is an array with objects
            setResponse(res[0].text);
            setIsResponse(false);
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    return (
        <>
            <div className="flex gap-10 justify-between">
                <div className="w-full max-w-[716px] flex flex-col gap-8 px-0 sm:px-10">
                    <div className="flex justify-center">
                        <SocialButton
                            name="Edit the Prompt"
                            position="0"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                        <SocialButton
                            name="Scenario Testing"
                            position="2"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                        {/* <SocialButton
                            name="Testing Chatroom"
                            position="2"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        /> */}
                    </div>
                    {activeButton === "Edit the Prompt" ? (
                        <div className="flex flex-col">
                            <Text className="!text-[18px] !text-[#d4d4d8]">
                                Modify the Existing Prompt
                            </Text>
                            <Text className="!text-[13px] !text-[#b3b3b3] mb-10">
                                The prompt sets the base personality and
                                restrictions for the agent, which you can modify
                                after creation. While agents can learn from chat
                                histories, any fundamental changes (such as
                                personality or behavior instructions) should be
                                made in the prompt.
                            </Text>
                            <Formik
                                initialValues={{
                                    name: character.name,
                                    description: character.description,
                                    personality: character.personality,
                                    instruction: character.instruction,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values) => {
                                    updatePrompt(values);
                                }}
                            >
                                <Form className="space-y-6">
                                    <Flex className="space-y-2">
                                        <RadioGroup.Root defaultValue="2">
                                            <Flex gap="2">
                                                <Text as="label" size="2">
                                                    <Flex
                                                        gap="2"
                                                        className=" cursor-pointer"
                                                    >
                                                        <RadioGroup.Item
                                                            value="1"
                                                            id="r1"
                                                            className=" !cursor-pointer"
                                                        />
                                                        Wild Mode
                                                    </Flex>
                                                </Text>
                                                <Text as="label" size="2">
                                                    <Flex
                                                        gap="2"
                                                        className=" cursor-pointer"
                                                    >
                                                        <RadioGroup.Item
                                                            value="2"
                                                            id="r2"
                                                            className=" !cursor-pointer"
                                                        />
                                                        Netural
                                                    </Flex>
                                                </Text>
                                                <Text as="label" size="2">
                                                    <Flex
                                                        gap="2"
                                                        className=" cursor-pointer"
                                                    >
                                                        <RadioGroup.Item
                                                            value="3"
                                                            id="r3"
                                                            className=" !cursor-pointer"
                                                        />
                                                        Safe Mode
                                                    </Flex>
                                                </Text>
                                            </Flex>
                                        </RadioGroup.Root>
                                    </Flex>
                                    <FormField
                                        label="Name"
                                        name="name"
                                        type="text"
                                        // value={character.name}
                                        className="h-9 !rounded-[5px]"
                                        placeholder="Public name of your agent showing on the Top Hat discovery site"
                                    />
                                    <FormField
                                        label="Description"
                                        name="description"
                                        as="textarea"
                                        // value={character.description}
                                        className="h-24 !rounded-[5px]"
                                        placeholder={`- (start each point with "you are...")
- What is the agent? a cat? a fanboy?
- What&apos;s the background story? what should he/she know about him/herself?
- any other information she should know? birth date, friends, social relations, culture, family...`}
                                    />
                                    <FormField
                                        label="Personality"
                                        name="personality"
                                        as="textarea"
                                        // value={character.personality}
                                        className="h-40 !rounded-[5px]"
                                        placeholder={`- what's the personality? Always positive, enthusiastic, friendly, retarded, unhinged, kinky, explicit, socially marginalised…
- what value does he/she believe in? Friends are important, family first, everyone is mentally ill, covid was an alien tech…
- what culture (japanese, anime, 4chan, reddit...) does he/she associate with?
- how should he/she react in unexpected scenarios? When faced with hostility/impoliteness/nsfw requests/racism/discrimination he/she should...`}
                                    />
                                    <FormField
                                        label="Instruction"
                                        name="instruction"
                                        as="textarea"
                                        // value={character.instruction}
                                        className="h-48 !rounded-[5px]"
                                        placeholder={`- bullet points on do/donts
- how long should each message be? 1 sentence? 80 characters? be verbose?
- should he/she use emojis? what emojis should she use? should he/she ever double emojis to show excitement?
- what should she say when someone asks her her opinion on Trump, SEC, crypto and financial advice?
- &quot;Do not make things up, if you don't know the answer, it's okay to admit it, ask for explanations from others on topics you don't understand&quot; — especially helpful for projects
- who are the admins in the chat (handles) and should he/she tag them when x happens?`}
                                    />
                                    <Flex
                                        pt="4"
                                        pb="4"
                                        justify="center"
                                        className=""
                                    >
                                        <Button
                                            type="submit"
                                            // variant="ghost"
                                            size="4"
                                            loading={mutation.isPending}
                                            className=" w-[100%] lg:!w-[49%] !min-w-[300px] !rounded-[4px] hover:cursor-pointer"
                                            style={{
                                                border: "0.5px solid hsl(240 3.7% 15.9%)",
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </Flex>
                                </Form>
                            </Formik>
                        </div>
                    ) : activeButton === "Scenario Testing" ? (
                        <div className="flex flex-col">
                            <Text className="!text-[#b3b3b3] !text-[14px] !text-center">
                                Sandbox is an environment for testing, used to
                                preview the agent's response content. It does
                                not consume credits.
                            </Text>
                            <Text className="!text-[#d4d4d8] !text-[18px] !font-bold !mt-10">
                                Select Scenario
                            </Text>
                            <Select.Root
                                defaultValue="telegram"
                                onValueChange={handleSelectChange}
                            >
                                <Select.Trigger
                                    color="gray"
                                    variant="classic"
                                    className="!h-11 !rounded-[8px] !my-3"
                                />
                                <Select.Content
                                    color="gray"
                                    className="!ml-[20px]"
                                >
                                    <Select.Group>
                                        <Select.Item value="telegram">
                                            Telegram Reply
                                        </Select.Item>
                                    </Select.Group>
                                </Select.Content>
                            </Select.Root>
                            <Text className="!text-[#d4d4d8] !text-[18px] !font-bold !mt-1">
                                User Message
                            </Text>
                            <TextArea
                                name="message"
                                resize="vertical"
                                className="!rounded-[8px] !my-3"
                                placeholder="Enter user message here"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                }}
                            ></TextArea>
                            <div className="flex justify-end">
                                <Button
                                    className="!cursor-pointer !w-[180px]"
                                    onClick={() => {
                                        handleSubmit();
                                    }}
                                >
                                    {isResponse ? <Spinner /> : <></>}
                                    Preview Response
                                </Button>
                            </div>
                            <Text className="!text-[#d4d4d8] !text-[18px] !font-bold !mt-5">
                                Response Preview
                            </Text>
                            <div className="border w-full h-[160px] rounded-[8px] my-3 p-3 !text-[#d4d4d8]">
                                {!response ? (
                                    <div className="w-full h-full flex justify-center items-center">
                                        <Text className="!text-center ">
                                            Your response will appear here.{" "}
                                            <br />
                                            Generate a response to see the
                                            preview.
                                        </Text>
                                    </div>
                                ) : (
                                    <div>{response}</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>No data</>
                    )}
                </div>
            </div>
        </>
    );
}
