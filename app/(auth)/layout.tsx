/*
* app/(auth)/layout.tsx
* Layout component for authentication pages.
*/

import React from "react";
import { ReactNode } from "react";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  return <main>{children}</main>;
};

export default AuthLayout;
