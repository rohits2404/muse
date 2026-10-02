import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { generateAppAction, generatePageAction } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [generateAppAction, generatePageAction],
});
