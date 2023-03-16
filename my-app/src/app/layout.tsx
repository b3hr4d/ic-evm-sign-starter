import ThemeProvider from "../theme"

interface layoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<layoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
