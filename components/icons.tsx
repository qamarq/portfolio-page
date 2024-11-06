import { ArrowLeft, Command, Eye, Loader2, Send } from "lucide-react";
import { SiAndroid, SiDiscord, SiFivem, SiGithub, SiGmail, SiLinkedin, SiNextdotjs, SiOpenai } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

export type ValidIcon = keyof typeof Icons;

export const Icons = {
    Logo: Command,
    Contact: Send,
    Next: SiNextdotjs,
    Android: SiAndroid,
    Fivem: SiFivem,
    OpenAI: SiOpenai,
    Github: SiGithub,
    Star: FaStar,
    LinkedIn: SiLinkedin,
    Discord: SiDiscord,
    Gmail: SiGmail,
    Loading: ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
        <Loader2 className={cn("animate-spin w-4 h-4", className)} />   
    ),
    ArrowLeft,
    Eye
}