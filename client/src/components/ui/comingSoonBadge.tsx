import { Badge, Text } from "@radix-ui/themes";

export default function ComingSoonBadge() {
    return (
        <>
            <Badge className="!px-[3px] !py-[1px] !rounded-full !bg-[#b8a1bde0] !ml-5 !absolute !top-[-10px] !right-[5px]">
                <Text className="!text-[9px] !text-[#292929]">Coming Soon</Text>
            </Badge>
        </>
    );
}
