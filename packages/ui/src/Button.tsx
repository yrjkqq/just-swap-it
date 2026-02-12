"use client";

import React from "react";

export const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-[5px] bg-[#0070f3] px-5 py-2.5 text-white border-none hover:bg-[#0060df]"
    >
      {children}
    </button>
  );
};
