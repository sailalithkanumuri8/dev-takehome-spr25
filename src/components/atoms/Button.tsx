import React from "react";

type ButtonVariant = "primary" | "inverted";

interface ButtonProps {
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  children,
}: ButtonProps) {
  const baseStyles = "py-2 px-4 rounded-md transition w-full ";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-primary border border-primary text-white hover:bg-white hover:text-primary",
    inverted:
      "bg-primary-fill text-primary border border-white hover:bg-primary hover:text-white",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
