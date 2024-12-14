import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const POST = async (request: NextRequest) => {
    try {
        const { email } = await request.json();
        console.log(email);

        const send = await resend.contacts.create({
            email,
            firstName: "",
            lastName: "",
            unsubscribed: false,
            audienceId: process.env.RESEND_AUDIENCE_ID!,
        });

        console.log("Resend API response:", send);

        if (send.data) {
            return NextResponse.json(
                { message: "Subscription successful" },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "Subscription failed" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error parsing request body:", error);
        return NextResponse.json(
            { message: "Invalid request body" },
            { status: 400 }
        );
    }
};
