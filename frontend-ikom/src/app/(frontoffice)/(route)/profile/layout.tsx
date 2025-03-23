import Navbar from "@/components/frontoffice/navbar";

export default function UserSpaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar /> {children}
    </div>
  );
}
