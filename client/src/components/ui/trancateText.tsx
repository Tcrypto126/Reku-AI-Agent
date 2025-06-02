import { useEffect, useState } from "react";

const TruncatedText = ({
    option,
    text,
    maxLength,
}: {
    option: string;
    text: string;
    maxLength: number;
}) => {
    const [displayText, setDisplayText] = useState<string>("");

    useEffect(() => {
        if (option === "middle") {
            setDisplayText(truncateMiddle(text, maxLength));
        } else {
            setDisplayText(truncateEnd(text, maxLength));
        }
    }, []);

    return <span>{displayText}</span>;
};

function truncateMiddle(str: string, maxLength: number = 30) {
    if (str.length <= maxLength) return str;

    const charsToShow = maxLength - 3;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return str.slice(0, frontChars) + "..." + str.slice(str.length - backChars);
}

function truncateEnd(str: string, maxLength = 30) {
    if (str.length <= maxLength) return str;

    return str.slice(0, maxLength) + "...";
}

export default TruncatedText;
