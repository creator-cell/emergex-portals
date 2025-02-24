import NavbarSuperAdmin from "@/components/super-admin/NavbarSuperAdmin";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" flex flex-col w-full min-h-screen bg-custom-gradient">
     <NavbarSuperAdmin/>

      <div className=" w-full container "> {children}</div>
    </main>
  );
}
