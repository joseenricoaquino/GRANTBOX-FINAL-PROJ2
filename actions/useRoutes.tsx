import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  BadgeDollarSignIcon,
  BookCopyIcon,
  Camera,
  CompassIcon,
  CreditCardIcon,
  DownloadCloudIcon,
  GraduationCapIcon,
  InfoIcon,
  LayoutDashboardIcon,
  PackageCheckIcon,
  School,
  SettingsIcon,
  User2,
  UserPlus2Icon,
} from "lucide-react";

const useRoutes = () => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboardIcon,
        active: pathname.includes("/dashboard"),
        role: "ANY",
      },
      {
        label: "College Scholars",
        href: "/college-scholars",
        icon: School,
        active: pathname.includes("/college-scholars"),
        role: "ADMINISTRATOR",
      },
      {
        label: "Scholarships",
        href: "/scholarships",
        icon: GraduationCapIcon,
        active: pathname.includes("/scholarships"),
        role: "ADMINISTRATOR",
      },
      {
        label: "Scholarships",
        href: "/scholarships-student",
        icon: GraduationCapIcon,
        active: pathname.includes("/scholarships-student"),
        role: "STUDENT",
      },
      {
        label: "Scholarship Compass",
        href: "/scholarships-compass",
        icon: CompassIcon,
        active: pathname.includes("/scholarships-compass"),
        role: "STUDENT",
      },
      {
        label: "Account Settings",
        href: "/settings",
        icon: SettingsIcon,
        active: pathname.includes("/settings"),
        role: "STUDENT",
      },
      {
        label: "Student Profile",
        href: "/profile",
        icon: User2,
        active: pathname.includes("/profile"),
        role: "STUDENT",
      },
      {
        label: "Help Desk",
        href: "/help-desk",
        icon: InfoIcon,
        active: pathname.includes("/help-desk"),
        role: "ADMINISTRATOR",
      },
    ],
    [pathname]
  );
  return routes;
};

export default useRoutes;
