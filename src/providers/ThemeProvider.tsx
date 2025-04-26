"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { FC } from "react";

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => {
    return (
        <NextThemeProvider {...props}>
            {children}
        </NextThemeProvider>
    );
}