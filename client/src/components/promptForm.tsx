import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import {
    Box,
    Button,
    Flex,
    Heading,
    RadioGroup,
    Spinner,
    Text,
} from "@radix-ui/themes";
import FormField from "./ui/formField";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { UUID } from "@elizaos/core";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { Character } from "@elizaos/core";

interface Agent {
    id: UUID;
    character: Character;
}

interface FormValues {
    name: string;
    description: string;
    personality: string;
    instruction: string;
}

export default function PromptForm() {
    const navigate = useNavigate();
    const queryClient = new QueryClient();
    const { toast } = useToast();
    const formikRef = useRef<FormikProps<FormValues>>(null);
    const [withToken, setWithToken] = useState(false);
    const [loadingWithToken, setLoadingWithToken] = useState(false);
    const [loadingWithoutToken, setLoadingWithoutToken] = useState(false);

    const validationSchema = Yup.object({
        name: Yup.string()
            .max(50, "Must be 50 characters or less")
            .required("Name is Required"),
        description: Yup.string().required("Description is required"),
        personality: Yup.string().required("Personality is required"),
        instruction: Yup.string().required("Instruction is required"),
    });

    const mutation = useMutation({
        mutationFn: async (values: FormValues) => {
            return await apiClient.createAgent(values);
        },
        onSuccess: (agent: Agent) => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            toast({
                title: "Success",
                description: "Created your agent successfully",
                variant: "default",
            });
            setLoadingWithToken(false);
            setLoadingWithoutToken(false);
            if (!withToken) {
                navigate(`/agents/${agent.id}`);
            } else {
                navigate(`/agents/${agent.id}/deploy-token`);
            }
        },
        onError: (error: any) => {
            console.log(error.message);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const createWithoutNewToken = () => {
        setWithToken(false);
        setLoadingWithToken(true);
        if (formikRef.current) {
            formikRef.current.submitForm().then(() => {
                console.log("Created without new token!");
            });
        }
    };

    const createWithNewToken = () => {
        setWithToken(true);
        setLoadingWithoutToken(false);
        if (formikRef.current) {
            formikRef.current.submitForm().then(() => {
                console.log("Created with new token!");
            });
        }
    };

    return (
        <Box className="rounded text-sm overflow-hidden">
            <Flex>
                <Flex
                    direction="column"
                    className="w-full p-2 md:p-4 lg:p-6 lg:max-w-4xl rounded-4 gap-8 background-gradient shadow"
                >
                    <Flex direction="column">
                        <Heading
                            size="7"
                            weight="bold"
                            className="!text-[#d4d4d8]"
                        >
                            Prompt Your Agent
                        </Heading>
                        <Text size="1" color="gray" className="!text-[#666666]">
                            Don't worry — you can edit it in the future
                        </Text>
                    </Flex>
                    <Formik
                        innerRef={formikRef}
                        initialValues={{
                            name: "",
                            description: "",
                            personality: "",
                            instruction: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values: any) => {
                            mutation.mutate(values);
                        }}
                    >
                        <Form className="space-y-6">
                            <Flex className="space-y-2">
                                <RadioGroup.Root defaultValue="2">
                                    <Flex gap="4" className="text-[#d4d4d8] !flex-wrap">
                                        <Text as="label" size="2">
                                            <Flex
                                                gap="2"
                                                className="cursor-pointer "
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
                                className="h-9 !rounded-[5px]"
                                placeholder="Public name of your agent showing on the Top Hat discovery site"
                            />
                            <FormField
                                label="Description"
                                name="description"
                                as="textarea"
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
                                className="h-48 !rounded-[5px]"
                                placeholder={`- bullet points on do/don't
- how long should each message be? 1 sentence? 80 characters? be verbose?
- should he/she use emojis? what emojis should she use? should he/she ever double emojis to show excitement?
- what should she say when someone asks her her opinion on Trump, SEC, crypto and financial advice?
- "Do not make things up, if you don't know the answer, it's okay to admit it, ask for explanations from others on topics you don't understand" — especially helpful for projects
- who are the admins in the chat (handles) and should he/she tag them when x happens?`}
                            />
                            <Flex
                                pt="4"
                                pb="4"
                                justify="center"
                                gap="5"
                                className=" flex-col md:flex-row"
                            >
                                <Button
                                    type="button"
                                    size="4"
                                    // loading={mutation.isPending}
                                    className=" w-[100%] lg:!w-[49%] !min-w-[300px] !rounded-[4px] hover:cursor-pointer !bg-transparent !text-[#D4D4D8] hover:!bg-[#1d1d1d]"
                                    style={{
                                        border: "0.5px solid hsl(240 3.7% 15.9%)",
                                    }}
                                    onClick={() => {
                                        createWithoutNewToken();
                                    }}
                                >
                                    {loadingWithToken ? <Spinner /> : <></>}
                                    Create without Token
                                </Button>
                                <Button
                                    type="button"
                                    size="4"
                                    // loading={mutation.isPending}
                                    className=" w-[100%] lg:!w-[49%] !min-w-[300px] !rounded-[4px] hover:cursor-pointer !text-[#D4D4D8]"
                                    onClick={() => {
                                        createWithNewToken();
                                    }}
                                >
                                    {loadingWithoutToken ? <Spinner /> : <></>}
                                    Next: Create a New Token
                                </Button>
                            </Flex>
                        </Form>
                    </Formik>
                </Flex>
            </Flex>
        </Box>
    );
}
