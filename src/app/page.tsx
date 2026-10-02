import { authSession } from "@/lib/auth-utils";
import { LandingPage } from "@/modules/landing";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

const Home = async () => {
    const session = await authSession();

    if (session) {
        redirect("/projects");
    }

    return <LandingPage />;
};

export default Home;
