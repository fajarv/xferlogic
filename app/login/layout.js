export const metadata = {
  title: "XferLogic",
  description: "ETRM & Trading Professionals Community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
