"use client"
import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}

const theme = extendTheme({
  colors,
  fonts: {
    body: inter.style.fontFamily,
    heading: "Inter, system-ui, sans-serif",
    mono: "Menlo, monospace",
  },
})

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </>
  )
}

export default ThemeProvider
