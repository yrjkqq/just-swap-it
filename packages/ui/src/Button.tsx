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
    <button onClick={onClick} className="btn-primary">
      {children}
    </button>
  );
};
