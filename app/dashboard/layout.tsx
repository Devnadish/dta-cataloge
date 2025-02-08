import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar locale={locale} />
      <SidebarInset>
        {/* <Navbar /> */}
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
