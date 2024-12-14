import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import * as yup from "yup";

import { toast } from "sonner";

export interface INewsletterFormValues {
    email: string;
}

const schema = yup.object({
    email: yup
        .string()
        .email("Please enter a valid email")
        .required("Please enter your email"),
});

const useNewsletterForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<INewsletterFormValues>({
        resolver: yupResolver(schema) as Resolver<INewsletterFormValues>,
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = form;

    const postNewsletterSubscription = async (data: INewsletterFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            setIsLoading(false);
            return response;
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
        }
    };

    const onSubmit = async (data: INewsletterFormValues) => {
        console.log("Newsletter Form Submit Success");
        const res = await postNewsletterSubscription(data);
        if (res?.status === 200) {
            toast.success("Successfully subscribed to the newsletter!");
            reset();
        } else {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return { handleSubmit, register, errors, isLoading, onSubmit };
};

export default useNewsletterForm;
