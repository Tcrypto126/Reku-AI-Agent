import { NavLink, useNavigate } from "react-router";
import { Character, UUID } from "@elizaos/core";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { Text, Button, Spinner } from "@radix-ui/themes";
import { Formik, Form } from "formik";
import FormField from "./ui/formField";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";

import { UploadIcon } from "./ui/icons";
import ABI from "../contractData/abi.json";
import ByteCode from "../contractData/byteCode.json";

const BASE_URL =
    import.meta.env.VITE_SERVER_BASE_URL ||
    `${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}`;

export default function TokenDeployComp({
    agentId,
    character,
}: {
    agentId: UUID;
    character: Character;
}) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [contractAddress, setContractAddress] = useState("");
    const [logoURL, setLogoURL] = useState("");
    const [loading, setLoading] = useState(false);

    const queryClient = new QueryClient();

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        const formData = new FormData();
        if (file) {
            formData.append("file", file);
        }
        // formData.append('previousFilename', existingFilename);

        try {
            const response = await fetch(`${BASE_URL}/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            console.log("Upload successful:", data);
            setLogoURL(`/assets/uploads/${data.filename}`);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    function isValidTronContractAddress(address: string) {
        const regExp = /^T[a-zA-Z0-9]{33}$/; // Regular expression to check length and starting character
        // Check if the address matches the regular expression for Tron addresses
        if (!regExp.test(address)) {
            return false;
        }
        // Check if the address contains only valid Base58 characters
        const base58Regex = /^[1-9A-HJ-NP-Za-km-z]*$/;
        if (!base58Regex.test(address)) {
            return false;
        }
        return true;
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is Required"),
        symbol: Yup.string().required("Symbol is required"),
        description: Yup.string().required("Description is required"),
    });

    const mutation = useMutation({
        mutationFn: async (values: any) => {
            return await apiClient.updateAgent(agentId, values, character);
        },
        onSuccess: (agent: any) => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            setTimeout(() => {
                toast({
                    title: "Success",
                    description: "Created TRC20 token successfully",
                    variant: "default",
                });
            }, 500);
            navigate(`/agents/${agent.id}`);
        },
        onError: (error: any) => {
            setTimeout(() => {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            }, 500);
            console.log(error.message);
        },
    });

    const handleSubmit = async (values: any = { contractAddress: "" }) => {
        const contractAddress = values.contractAddress;
        const newValues = {
            ...values,
            activeButton: "BindToken",
        };

        if (contractAddress !== "") {
            try {
                const isValid = await isValidTronContractAddress(
                    contractAddress
                );
                if (isValid) {
                    mutation.mutate(newValues);
                } else {
                    toast({
                        title: "Error",
                        description: "Invalid Address",
                        variant: "destructive",
                    });
                    console.error("Invalid contract address");
                }
            } catch (err) {
                console.error("Address validation failed: ", err);
            }
        } else {
            mutation.mutate(newValues);
        }
    };

    const createTRC20Token = async (values: any) => {
        setLoading(true);
        // Check if TronWeb is connected
        if (!window.tronLink) {
            console.error("TronLink not found");
            return;
        }

        try {
            await window.tronLink.request({ method: "tron_requestAccounts" });

            const tronWeb = window.tronWeb;

            if (!tronWeb || !tronWeb.defaultAddress.base58) {
                console.error("TronWeb or default address is missing");
                return;
            }

            console.log("Wallet address:", tronWeb.defaultAddress.base58);

            const contractABI = ABI;
            const contractBytecode = ByteCode.byteCode;

            const issuer_address = tronWeb.defaultAddress.hex.toString();

            const transaction =
                await tronWeb.transactionBuilder.createSmartContract(
                    {
                        abi: contractABI,
                        bytecode: contractBytecode,
                        feeLimit: 1e9,
                        callValue: 0,
                        userFeePercentage: 30,
                        originEnergyLimit: 1e7,
                        parameters: [
                            values.name, //token name
                            values.symbol, //token symbol
                            6, // decimals
                            1000000, //total supply
                            logoURL, //token logo
                            values.description, //token description
                            values.website, //website
                            values.twitter, //twitter
                            values.telegram, //telegram
                        ],
                    },
                    issuer_address
                );

            const signedTransaction = await tronWeb.trx.sign(transaction);
            const transactionResult = await tronWeb.trx.sendRawTransaction(
                signedTransaction
            );

            // Check if transaction was successful
            if (transactionResult.result) {
                const contractAddress = tronWeb?.address.fromHex(
                    transactionResult.transaction.contract_address
                );
                setTimeout(() => {
                    toast({
                        title: "Success",
                        description: `Successfully created TRC20 token: ${contractAddress}`,
                        variant: "default",
                    });
                }, 500);

                console.log(
                    "Contract deployed successfully at:",
                    contractAddress
                );
                setLoading(false);
                setContractAddress(contractAddress);
                const newValues = {
                    contractAddress,
                    avatar: logoURL,
                };
                handleSubmit(newValues);
            } else {
                setLoading(false);
                console.error("Transaction failed:", transactionResult);
                setTimeout(() => {
                    toast({
                        title: "Error",
                        description: "Transaction failed",
                        variant: "destructive",
                    });
                }, 500);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error deploying contract:", error);
            setTimeout(() => {
                toast({
                    title: "Error",
                    description: "Failed to create token.",
                    variant: "destructive",
                });
            }, 500);
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center">
                {contractAddress ? (
                    <div className="flex flex-col ">
                        <Text
                            size="4"
                            weight="bold"
                            align="center"
                            className="!text-center !w-full"
                            color="green"
                        >
                            Perfect! Your TRC20 token created successfully!
                        </Text>
                        <Text size="2" align="center">
                            Contract Address:{" "}
                            <NavLink
                                to={`https://dexscreener.com/tron/${contractAddress}`}
                                className="underline text-[#838282]"
                            >
                                {contractAddress}
                            </NavLink>
                        </Text>
                    </div>
                ) : (
                    <></>
                )}

                <Formik
                    initialValues={{
                        name: "",
                        symbol: "",
                        description: "",
                        website: "",
                        tokenLogo: "",
                        twitter: "",
                        telegram: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={createTRC20Token}
                >
                    <Form className="space-y-6">
                        <FormField
                            label="Name"
                            name="name"
                            type="text"
                            className="h-9 !rounded-[5px] !text-[14px]"
                        />
                        <FormField
                            label="Symbol"
                            name="symbol"
                            type="text"
                            className="h-9 !rounded-[5px] !text-[14px]"
                        />
                        <FormField
                            label="Description"
                            name="description"
                            type="text"
                            as="textarea"
                            className="!bg-transparent !rounded-[5px]"
                        />
                        <FormField
                            label="Image"
                            id="file-input"
                            name="tokenLogo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="!hidden"
                        />
                        {/* Custom File Input Section */}
                        <label
                            htmlFor="file-input"
                            style={{
                                width: "78px",
                                height: "78px",
                                marginTop: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                            }}
                            className="!border overflow-hidden flex justify-center items-center hover:bg-[#585858]"
                        >
                            {logoURL ? (
                                <img src={logoURL} alt="token logo" />
                            ) : (
                                <div className="flex flex-col gap-1 items-center justify-center">
                                    <UploadIcon width="20" height="20" />
                                    <span className="text-[12px]">
                                        Select file
                                    </span>
                                </div>
                            )}{" "}
                        </label>
                        <FormField
                            label="Twitter"
                            name="twitter"
                            type="text"
                            className="h-9 !rounded-[5px] !text-[14px]"
                            placeholder="(Optional)"
                        />
                        <FormField
                            label="Telegram"
                            name="telegram"
                            type="text"
                            className="h-9 !rounded-[5px] !text-[14px]"
                            placeholder="(Optional)"
                        />
                        <FormField
                            label="Website"
                            name="website"
                            type="text"
                            className="h-9 !rounded-[5px] !text-[14px]"
                            placeholder="(Optional)"
                        />
                        {/* <FormField
                                        label="Dev Buy (SOL)"
                                        name="devSol"
                                        type="number"
                                        className="h-9 !rounded-[5px] !text-[14px]"
                                    /> */}
                        <div className="flex flex-col items-center">
                            <Text size="1">
                                The token creation fee is 534 TRX, and you will
                                receive 500 credits for the agent in return.
                            </Text>
                            <Button
                                type="submit"
                                className="!w-full !cursor-pointer"
                            >
                                {loading || mutation.isPending ? (
                                    <Spinner />
                                ) : (
                                    <></>
                                )}
                                Create Token (534 TRX)
                                <img
                                    src="/assets/buttonIcon/pumpfun.png"
                                    alt="pump fun"
                                    width={16}
                                    height={16}
                                />
                            </Button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    );
}
