import { codeToHtml } from "shiki";

export const highlightCode = async (code: string) => {
    return codeToHtml(code, {
        lang: "html",
        theme: "github-dark",
    });
};
