import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-card shadow-card border border-gray-100 p-6 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
