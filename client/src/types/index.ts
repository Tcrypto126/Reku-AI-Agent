import { SVGProps } from "react";
interface IAttachment {
    url: string;
    contentType: string;
    title: string;
}

interface IconSvgProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

interface CharacterType {
    name: string;
    bio: string;
    lore: string;
}

export type { IAttachment, IconSvgProps, CharacterType };
