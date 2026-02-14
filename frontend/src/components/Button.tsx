import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "pill" | "danger" | "ghost" | "emergency";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "min-h-touch px-4 py-2 bg-recall-green text-white rounded-card font-medium hover:bg-recall-greenDark transition disabled:opacity-50",
  secondary:
    "min-h-touch px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-card font-medium hover:border-gray-300 transition shadow-card",
  pill:
    "min-h-touch px-4 py-2 rounded-full bg-recall-mint text-gray-800 font-medium hover:bg-recall-mint/90 transition",
  danger:
    "min-h-touch px-4 py-2 bg-red-100 text-red-700 rounded-card font-medium hover:bg-red-200 transition",
  ghost:
    "min-h-touch px-4 py-2 text-recall-nav font-medium rounded-card hover:bg-gray-100 transition",
  emergency:
    "min-h-touch px-6 py-4 bg-emergency text-white rounded-card font-bold text-xl shadow-card hover:bg-red-600 transition",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${variantClasses[variant]} ${className}`.trim();
  return <button className={classes} {...props}>{children}</button>;
}
