import { ReactNode } from "react";

type PageHeadingProps = {
  children: ReactNode;
  className?: string;
};

export default function PageHeading({ children, className = "" }: PageHeadingProps) {
  return (
    <h1 className={`text-xl font-bold text-gray-900 tracking-tight ${className}`}>
      {children}
    </h1>
  );
}
