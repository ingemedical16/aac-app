import './globals.scss';


export const metadata = {
  title: 'AAC App',
  description: 'AAC Communication Board for children'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
