"use client";
// import { NavMain } from "@/components/naviqation/nav-main";
// import { NavContactUs } from "@/components/naviqation/nav-contactus";
// import { Dm } from "@/components/naviqation/nav-Dm";
// import { ProjectSwitcher } from "@/components/naviqation/ProjectSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
// import { useTranslations } from "next-intl";
// import { Plugin } from "./Plugin";
// import { NavOther } from "./nav-other";

export function AppSidebar({
  locale,
  ...props
}: React.ComponentProps<typeof Sidebar> & { locale: string }) {
  // const t = useTranslations("navigation");
  const data = {
    user: {
      name: "Social Media",
      email: "Devnadish@gmail.com",
      avatar: "/assets/dta.svg",
    },
    projectsLink: [
      {
        name: "Crombo",
        logo: "/assets/crombo.png",
        plan: "Enterprise",
        link: "https://www.google.com",
      },
      {
        name: "DoctorCar",
        logo: "/assets/testProject.webp",
        plan: "Enterprise",
        link: "https://www.yahoo.com",
      },
    ],
  };
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      side={locale === "ar" ? "right" : "left"}
    >
      <SidebarHeader>
        {/* <Dm user={data.user} /> */}
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        {/* <NavMain locale={locale} />
        <NavOther locale={locale} />

        <Plugin locale={locale} />
        <NavContactUs locale={locale} /> */}
      </SidebarContent>

      <SidebarFooter>
        {/* <ProjectSwitcher projectsLink={data.projectsLink} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
