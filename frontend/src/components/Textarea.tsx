import { TextareaHTMLAttributes } from "react";

export default function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full min-h-touch px-4 py-2 rounded-card border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-recall-green focus:ring-1 focus:ring-recall-green outline-none transition ${className}`}
      {...props}
    />
  );
}
