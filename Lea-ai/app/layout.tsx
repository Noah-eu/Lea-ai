import './globals.css';

export const metadata = {
  title: 'Lea',
  description: 'Romantic AI chat companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
