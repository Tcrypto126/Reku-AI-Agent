import PromptForm from "@/components/promptForm";
import ImageForm from "@/components/imageForm";
import ModeratorForm from "@/components/moderatorForm";
import TwitterForm from "@/components/twitterForm";
import TokenForm from "@/components/tokenForm";

import { Box, Tabs, Text, Badge } from "@radix-ui/themes";

export default function CreateAgent() {
    return (
        <Tabs.Root
            className="flex gap-6 px-2 py-2 md:px-6 md:py-12 max-w-7xl mx-auto"
            defaultValue="prompt"
        >
            <Tabs.List className="!hidden lg:!block border-r pr-5 !shadow-none ">
                <Box className="px-4 py-6 border">
                    <Text className="mb-2">Generate your Agent</Text>
                    <Tabs.Trigger
                        className="!w-full !justify-start !cursor-pointer"
                        value="prompt"
                    >
                        {/* <div>Prompt Your Agent</div> */}
                        Prompt Your Agent
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="!w-full !justify-start cursor-not-allowed !text-[#696969]"
                        value="image"
                        disabled
                    >
                        Create From Images
                        <Badge className="!px-[3px] !py-0 !ml-5">
                            <Text className="!text-[9px]">Coming Soon</Text>
                        </Badge>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="!w-full !justify-start cursor-not-allowed !text-[#696969]"
                        value="moderator"
                        disabled
                    >
                        Moderator Agent Pre-sets
                        <Badge className="!px-[3px] !py-0 !ml-5">
                            <Text className="!text-[9px]">Coming Soon</Text>
                        </Badge>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="cursor-not-allowed !text-[#696969]"
                        value="twitter"
                        disabled
                    >
                        witter Clones
                        <Badge className="!px-[3px] !py-0 !ml-5">
                            <Text className="!text-[9px]">Coming Soon</Text>
                        </Badge>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="!w-full !justify-start !cursor-pointer"
                        value="token"
                    >
                        Create From Tokens
                    </Tabs.Trigger>
                </Box>
            </Tabs.List>
            <Tabs.Content value="prompt" className="flex-1">
                <PromptForm />
            </Tabs.Content>
            <Tabs.Content value="image" className="flex-1">
                <ImageForm />
            </Tabs.Content>
            <Tabs.Content value="moderator" className="flex-1">
                <ModeratorForm />
            </Tabs.Content>
            <Tabs.Content value="twitter" className="flex-1">
                <TwitterForm />
            </Tabs.Content>
            <Tabs.Content value="token" className="flex-1">
                <TokenForm />
            </Tabs.Content>
        </Tabs.Root>
    );
}
