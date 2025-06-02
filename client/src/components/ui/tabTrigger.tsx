import { Flex, Tabs } from "@radix-ui/themes";

export function TabTrigger({
    title,
    value,
    ...props
}: {
    title: string;
    value: string;
} & React.ComponentProps<typeof Tabs.Trigger>) {
    return (
        <Tabs.Trigger
            className="flex-1 !w-full !justify-start"
            value={value}
            {...props}
        >
            <Flex align="center" justify="between" gap="2">
                <div>{title}</div>
                <div className="bg-[#3E1F47] rounded-[2px] text-[7px] text-white dark:text-foreground leading-tight px-1">
                    Coming Soon
                </div>
            </Flex>
        </Tabs.Trigger>
    );
}
