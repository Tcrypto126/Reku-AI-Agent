import { Flex } from "@radix-ui/themes";
import { ErrorMessage, Field, useField } from "formik";

export default function FormField({ label, name, className, ...props }: any) {
    const [, meta] = useField(name);
    const hasError = meta.touched && meta.error;

    return (
        <Flex direction="column" className="space-y-2">
            <label htmlFor={name} className={hasError ? "text-red-500 !text-[14px]" : "!text-[14px] !text-[#d4d4d8]"}>
                {label}
            </label>
            <Field
                id={name}
                name={name}
                {...props}
                className={`${className} flex w-full rounded-sm border-2 ${
                    hasError ? "!border-red-500" : ""
                } bg-transparent text-[#d4d4d8] placeholder-[#666666] px-3 py-1 text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:border-solid focus-visible:border-violet-800 disabled:cursor-not-allowed disabled:opacity-50`}
            />
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-xs"
            />
        </Flex>
    );
}
