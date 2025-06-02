import { Button, Text, TextField, Separator } from "@radix-ui/themes";
import SocialButton from "./ui/socialButton";
import { useState } from "react";
import { Character, UUID } from "@elizaos/core";
import { CopyIcon, UnViewIcon, UploadIcon } from "./ui/icons";
import { ViewIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QueryClient, useMutation } from "@tanstack/react-query";
import FormField from "./ui/formField";
import { Formik, Form } from "formik";
import { apiClient } from "@/lib/api";
import * as Yup from "yup";

interface FormType {
    knowledgeBase: string;
}

//@ts-ignore
export default function AdvancedComp({
    agentId,
    character,
}: {
    agentId: UUID;
    character: Character;
}) {
    const { toast } = useToast();
    const [activeButton, setActiveButton] = useState<string>("Knowledge Base");
    const [view, setView] = useState(true);
    const queryClient = new QueryClient();
    //@ts-ignore
    const [secretKey, setSecretKey] = useState<string>(agentId);
    //@ts-ignore
    const clipCopy = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast({
                    title: "Success",
                    description:
                        "Copied your agent API secret key successfully!",
                    variant: "default",
                });
            })
            .catch((err) => {
                toast({
                    title: "Error",
                    description: err.message,
                    variant: "destructive",
                });
            });
    };

    const jsonData1 = {
        message: "Hi!",
    };
    const jsonData2 = {
        status: "success",
        data: {
            response: "Hello!",
        },
    };
    const jsonData3 = {
        status: "success",
        data: {
            knowledge: "KNOWLEDGE BASE IN TEXT",
        },
    };
    const jsonData4 = {
        knowledge: "NEW KNOWLEDGE BASE IN TEXT",
    };
    const jsonData5 = {
        status: "success",
        data: {
            knowledge: "NEW KNOWLEDGE BASE IN TEXT",
        },
    };

    const validationSchema = Yup.object({
        knowledgeBase: Yup.string().required("KnowledgeBase is Required"),
    });

    const mutation = useMutation({
        mutationFn: async (values: FormType) => {
            return await apiClient.updateAgent(agentId, values, character);
            // return await handleSubmit(values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            setTimeout(() => {
                toast({
                    title: "Success",
                    description: "Updated your agent successfully!",
                    variant: "default",
                });
            }, 400);
        },
        onError: (err: any) => {
            setTimeout(() => {
                toast({
                    title: "Error",
                    description: err.message,
                    variant: "destructive",
                });
            }, 400);
        },
    });

    return (
        <>
            <div className="flex gap-10 justify-between">
                <div className="w-full max-w-[716px] flex flex-col gap-8 px-0 md:px-10">
                    <div className="flex justify-center">
                        <SocialButton
                            name="Knowledge Base"
                            position="0"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                        <SocialButton
                            name="Webpage Uploads"
                            position="1"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                        <SocialButton
                            name="APIs"
                            position="2"
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                        />
                    </div>
                    {activeButton === "Knowledge Base" ? (
                        <Formik
                            initialValues={{
                                knowledgeBase: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={mutation.mutate}
                        >
                            <Form className="">
                                <div className="flex flex-col">
                                    <Text className="!text-[18px] !text-[#d4d4d8]">
                                        Knowledge Base (Optional)
                                    </Text>
                                    <FormField
                                        name="knowledgeBase"
                                        resize="vertical"
                                        radius="large"
                                        as="textarea"
                                        className="!mt-2 !h-[200px] !rounded-[8px] !py-2"
                                        placeholder="Project information, Twitter text, article text, whitepaper text..."
                                    />
                                    <div className="flex justify-center !mt-5">
                                        <Button
                                            type="submit"
                                            loading={mutation.isPending}
                                            className="!w-full sm:!w-[200px] !h-[40px] !cursor-pointer"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </Formik>
                    ) : activeButton === "Webpage Uploads" ? (
                        <div>
                            <Text className="!text-[18px] !text-[#d4d4d8]">
                                Add link to automatically extract knowledge base
                            </Text>
                            <div className="flex gap-3 my-5">
                                <TextField.Root
                                    placeholder="https://..."
                                    className="w-full !h-[40px] !rounded-[6px]"
                                    // onChange={(e) => {
                                    //     setTokenAddress(e.target.value);
                                    // }}
                                ></TextField.Root>
                                <Button
                                    className="!w-[80px] !h-[40px] !bg-[#252525] !flex !gap-2 !cursor-pointer"
                                    onClick={() => {}}
                                >
                                    <UploadIcon width="14" height="14" />
                                    <Text className="!text-[#d4d4d8]">Add</Text>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-7">
                            <div className=" rounded-[15px] p-6 bg-[#252525]">
                                <Text className="!text-[18px] !text-[#d4d4d8]">
                                    Your Agent API Secret Key
                                </Text>
                                <div className="flex gap-2 my-3 items-center">
                                    <TextField.Root
                                        disabled
                                        type={view ? "password" : "text"}
                                        className="!h-9 !w-full"
                                        placeholder="Agent API Key..."
                                        value={secretKey}
                                    ></TextField.Root>
                                    <Button
                                        className="!bg-[#121212] !w-9 !h-9 !p-0 !cursor-pointer"
                                        onClick={() => {
                                            view
                                                ? setView(false)
                                                : setView(true);
                                        }}
                                    >
                                        {view ? (
                                            <ViewIcon width="16" height="16" />
                                        ) : (
                                            <UnViewIcon
                                                width="16"
                                                height="16"
                                            />
                                        )}
                                    </Button>
                                    <Button
                                        className="!bg-[#121212] !w-9 !h-9 !p-0 !cursor-pointer"
                                        onClick={() => {
                                            clipCopy(secretKey);
                                        }}
                                    >
                                        <CopyIcon width="16" height="16" />
                                    </Button>
                                </div>
                                <div>
                                    <Text size="1" className="">
                                        This key is used to authenticate your
                                        agent when sending data to the Tophat
                                        API. Keep it safe and do not share it
                                        with anyone.
                                        <br />
                                        Include the API key in the Authorization
                                        header as an auth token:{" "}
                                        <span className="text-[13px] font-bold">{`{ "Authorization": "YOUR_AGENT_API_SECRET_KEY" }`}</span>
                                    </Text>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Text size="3" className="!font-bold">
                                    API Docs
                                </Text>
                                <div className="flex flex-col gap-1 rounded-[15px] p-6 bg-[#252525]">
                                    <Text
                                        size="4"
                                        className="!font-bold !text-[#d4d4d8]"
                                    >
                                        Chat
                                    </Text>
                                    <Text size="1" className=" !text-[#717172]">
                                        Chat with the agent via API
                                    </Text>
                                    <div className="flex justify-between text-[12px] mt-5">
                                        <Text>Method</Text>
                                        <Text className="!font-bold">POST</Text>
                                    </div>
                                    <div className="flex justify-between text-[12px]">
                                        <Text>Path</Text>
                                        <Text className="!font-bold">
                                            https://api.tophat.one/agent-api/7beb674c-a498-4c9e-8f09-82d2c69f3764/chat
                                        </Text>
                                    </div>
                                    <Separator size="4" className="my-3" />
                                    <Text size="1">Request:</Text>
                                    <pre
                                        className="bg-[#0a0a0a] rounded-[5px] p-4"
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {JSON.stringify(jsonData1, null, 2)}
                                    </pre>
                                    <Text size="1" className="!mt-3">
                                        Response:
                                    </Text>
                                    <pre
                                        className="bg-[#0a0a0a] rounded-[5px] p-4"
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {JSON.stringify(jsonData2, null, 2)}
                                    </pre>
                                </div>
                                <div className="flex flex-col gap-1 rounded-[15px] mt-5 p-6 bg-[#252525]">
                                    <Text
                                        size="4"
                                        className="!font-bold !text-[#d4d4d8]"
                                    >
                                        Get knowledge
                                    </Text>
                                    <Text size="1" className=" !text-[#717172]">
                                        Get the latest knowledge base of the
                                        agent
                                    </Text>
                                    <div className="flex justify-between text-[12px] mt-5">
                                        <Text>Method</Text>
                                        <Text className="!font-bold">GET</Text>
                                    </div>
                                    <div className="flex justify-between text-[12px]">
                                        <Text>Path</Text>
                                        <Text className="!font-bold">
                                            https://api.tophat.one/agent-api/7beb674c-a498-4c9e-8f09-82d2c69f3764/knowledge
                                        </Text>
                                    </div>
                                    <Separator size="4" className="my-3" />
                                    <Text size="1">Response:</Text>
                                    <pre
                                        className="bg-[#0a0a0a] rounded-[5px] p-4"
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {JSON.stringify(jsonData3, null, 2)}
                                    </pre>
                                </div>
                                <div className="flex flex-col gap-1 rounded-[15px] mt-5 p-6 bg-[#252525]">
                                    <Text
                                        size="4"
                                        className="!font-bold !text-[#d4d4d8]"
                                    >
                                        Update knowledge
                                    </Text>
                                    <Text size="1" className=" !text-[#717172]">
                                        Update the knowledge base. Attention: it
                                        will override the Knowledge Base field
                                        in web portal
                                    </Text>
                                    <div className="flex justify-between text-[12px] mt-5">
                                        <Text>Method</Text>
                                        <Text className="!font-bold">POST</Text>
                                    </div>
                                    <div className="flex justify-between text-[12px]">
                                        <Text>Path</Text>
                                        <Text className="!font-bold">
                                            https://api.tophat.one/agent-api/7beb674c-a498-4c9e-8f09-82d2c69f3764/knowledge
                                        </Text>
                                    </div>
                                    <Separator size="4" className="my-3" />
                                    <Text size="1">Request:</Text>
                                    <pre
                                        className="bg-[#0a0a0a] rounded-[5px] p-4"
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {JSON.stringify(jsonData4, null, 2)}
                                    </pre>
                                    <Text size="1" className="!mt-3">
                                        Response:
                                    </Text>
                                    <pre
                                        className="bg-[#0a0a0a] rounded-[5px] p-4"
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {JSON.stringify(jsonData5, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
