import './globals.css';

export const metadata = {
  title: 'XL100 | XferLogic',
  description: 'The ETRM enterprise and talent network by XferLogic.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
