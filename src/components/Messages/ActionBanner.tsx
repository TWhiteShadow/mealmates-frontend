import { Button } from "../ui/button";
import { FC } from "react";

type ActionButtonProps = {
    action: () => void;
    text: string;
    disabled?: boolean;
    variant?: "default" | "destructive" | "outline" | "ghost" | "google" | "facebook" | "github" | null | undefined;
    className?: string;
};

type ActionBannerProps = {
    buttons?: ActionButtonProps[];
    title?: string;
    description?: string;
};

const ActionBanner: FC<ActionBannerProps> = ({ buttons, title, description }) => {
    return (
        <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
            <div className="textBox text-center">
                {title && (<p className="text-gray-600">{title}</p>)}
                {description && (<p className="text-gray-600">{description}</p>)}
            </div>
            <div className="flex gap-2">
                {buttons && buttons.map((button, index) => (
                    <Button
                        key={index}
                        size="lg"
                        variant={button.variant || "default"}
                        disabled={button.disabled || false}
                        className={button.className || (!button.variant && "bg-purple-dark hover:bg-purple-dark/90 text-white" || "")}
                        onClick={button.action}
                    >
                        {button.text}
                    </Button>
                ))}
            </div>
        </div>
    );

};

export default ActionBanner;