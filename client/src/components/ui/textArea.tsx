
import { Flex, TextArea } from "@radix-ui/themes";
import { ErrorMessage, useField } from "formik";

export default function TextAreaCus({ label, name, className, ...props }: any) {
    const [, meta] = useField(name);
    const hasError = meta.touched && meta.error;

    return (
        <Flex direction="column" className="space-y-2">
            <label htmlFor={name} className={hasError ? "text-red-500" : ""}>
                {label}
            </label>
            <TextArea
                resize="vertical"
                id={name}
                name={name}
                {...props}
                className={`${className} flex w-full rounded-sm border-2 ${
                    hasError ? "!border-red-500" : ""
                } bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-solid focus-visible:border-violet-800 disabled:cursor-not-allowed disabled:opacity-50`}
            />
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-xs"
            />
        </Flex>
    );
}
