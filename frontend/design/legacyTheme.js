import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";


const beVietnam = ['Be Vietnam Pro', 'sans-serif'].join(',')

export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode,
            ...(mode === 'dark'
                ? {
                    primary: {
                        main: colors.primary[500]
                    },
                    secondary: {
                        main: colors.greenAccent[500]
                    },
                    neutral: {
                        dark: colors.gray[700],
                        main: colors.gray[500],
                        light: colors.gray[100],
                    },
                     background: {
                        default: colors.primary[500],
                     }
                } : {
                        primary: {
                            main: colors.primary[500]
                        },
                        secondary: {
                            main: colors.greenAccent[100]
                        },
                        neutral: {
                            dark: colors.gray[700],
                            main: colors.gray[500],
                            light: colors.gray[100],
                        },
                        background: {
                            default: '#fcfcfc',
                        },
                    }
            ),
        },
        typography: {
            fontFamily: sourceSans,
            fontSize: 12,
            h1: {
                fontFamily: sourceSans,
                fontSize: 12,
            },h2: {
                fontFamily: sourceSans,
                fontSize: 32,
            },h3: {
                fontFamily: sourceSans,
                fontSize: 24,
            },h4: {
                fontFamily: sourceSans,
                fontSize: 20,
            },h5: {
                fontFamily: sourceSans,
                fontSize: 16,
            },h6: {
                fontFamily: sourceSans,
                fontSize: 14,
            },

        }
    };
};

//context for color mode
export const ColorModeContext = createContext({
    toggleColorMode: () => {}
});

export const useMode = () => {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
        }), []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return [theme, colorMode]
}