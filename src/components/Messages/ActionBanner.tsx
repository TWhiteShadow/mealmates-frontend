import { Button } from "../ui/button";
import { FC } from "react";

type ActionBannerProps = {
    buttonAction: () => void;
    buttonText?: string;
    buttonDisabledWhile?: boolean;
    buttonVariant?: "default" | "destructive" | "outline" | "ghost" | "google" | "facebook" | "github" | null | undefined
    title?: string;
    description?: string;
};

const ActionBanner: FC<ActionBannerProps> = ({ buttonAction, buttonText, buttonDisabledWhile, buttonVariant, title, description }) => {

    return (
        <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
            <div className="textBox text-center">
                {title && (<p className="text-gray-600">{title}</p>)}
                {description && (<p className="text-gray-600">{description}</p>)}
            </div>
            <Button
                size={"lg"}
                variant={buttonVariant || "default"}
                disabled={buttonDisabledWhile || false}
                className="bg-purple-dark hover:bg-purple-dark/90 text-white"
                onClick={buttonAction}
            >{buttonText}</Button>
        </div>
    );

};

export default ActionBanner;