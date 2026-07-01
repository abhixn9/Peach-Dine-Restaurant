import React from "react";

interface LogoIconProps {
  className?: string;
  size?: number;
}

export default function LogoIcon({
  className = "",
  size = 36,
}: LogoIconProps) {
  return (
    <img
      src="/rest-logo.png"
      alt="Logo"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      draggable={false}
    />
  );
}