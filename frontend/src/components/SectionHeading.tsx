import { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionHeading({ children, className = "" }: SectionHeadingProps) {
  return (
    <h2 className={`text-3xl font-bold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}
