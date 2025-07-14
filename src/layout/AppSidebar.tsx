"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { Icons } from "@/icons/icons";
import LogoutModal from "@/components/logout-modal";
import { useAppSelector } from "@/hooks/redux";
import { ROLES } from "@/types/auth";
import { Dot } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[];
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    icon?: React.ReactNode;
    roles?: string[];
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <Icons.home />,
    name: "Home",
    path: "/dashboard",
    roles: ["PLATFORM ADMIN", "ADMIN", "DECONGESTION UNIT HEAD", "LACON LAWYER", "PRO BONO LAWYER", "PDSS", "PRO_BONO_LAWYER", "EXTERNAL PARALEGAL", "LAWYER", "DIRECTOR GENERAL", "ZONAL DIRECTOR", "STATE COORDINATOR", "CENTRE COORDINATOR", "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD", "OSCAR UNIT HEAD", "PREROGATIVE OF MERCY UNIT HEAD", "DIO", "PARALEGAL"],
  },
  {
    icon: <Icons.casesIcon />,
    name: "Cases",
    path: "/cases",
    roles: ["ADMIN", "PRO_BONO_LAWYER", "DECONGESTION UNIT HEAD", "PDSS", "DIRECTOR GENERAL", "ZONAL DIRECTOR", "STATE COORDINATOR", "CENTRE COORDINATOR", "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD", "OSCAR UNIT HEAD", "PREROGATIVE OF MERCY UNIT HEAD", "DIO"],
  },
  {
    icon: <Icons.casesIcon />,
    name: "Filed Cases",
    path: "/cases",
    roles: ["PARALEGAL"],
  },
  {
    icon: <Icons.userRole />,
    name: "Users Role",
    path: "/users/all",
    roles: ["PLATFORM ADMIN"],
  },
  {
    icon: <Icons.userRole />,
    name: "Users Role",
    roles: ["ADMIN", "DIRECTOR GENERAL", "DECONGESTION UNIT HEAD"],
    subItems: [
      {
        name: "All Users",
        path: "/users/all",
        roles: ["ADMIN", "DIRECTOR GENERAL"],
      },
      {
        name: "Lawyers",
        path: "/users/lawyers",
        roles: ["DECONGESTION UNIT HEAD"],
      },
      {
        name: "Request",
        path: "/users/request",
        roles: ["ADMIN", "DIRECTOR GENERAL"],
      },
      {
        name: "Request",
        path: "/users/probuno-request",
        roles: ["DECONGESTION UNIT HEAD"],
      },
    ]
  },
  {
    icon: <Icons.lawyerIcons />,
    name: "Lawyers",
    path: "/lawyers",
    roles: ["ZONAL DIRECTOR", "OSCAR UNIT HEAD", "STATE COORDINATOR", "CENTRE COORDINATOR", "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD", "PREROGATIVE OF MERCY UNIT HEAD", "DIO", "PDSS"],
  },
  {
    icon: <Icons.report />,
    name: "Reports",
    path: "/reports",
    roles: ["ADMIN", "PLATFORM ADMIN", "DIRECTOR GENERAL"],
  },
  {
    name: "Settings",
    icon: <Icons.settings />,
    path: "/settings",
    roles: ["ADMIN"],
  },
];

// Extract submenu item component for better maintainability
const SubmenuItem = ({
  subItem,
  isActive,
  isExpanded,
  isHovered,
  isMobileOpen
}: {
  subItem: NonNullable<NavItem['subItems']>[0];
  isActive: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}) => (
  <li className="w-full relative">
    <Link
      href={subItem.path}
      className={`w-full pl-8 pr-4 py-4 flex items-center justify-between menu-dropdown-item relative rounded-lg transition-all duration-200 ${isActive
        ? "menu-dropdown-item-active bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
        : "menu-dropdown-item-inactive"
        }`}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="flex items-center justify-between mt-2 gap-3">
        <span className="flex items-center gap-2">
          {subItem.icon && (
            <span className={`${isActive
              ? "menu-item-icon-active text-brand-600"
              : "menu-item-icon-inactive"
              }`}>
              {subItem.icon}
            </span>
          )}
          <span className="flex items-center">
            <Dot />
            {subItem.name}
          </span>
        </span>
        {isActive && (
          <div className="absolute right-10 mr-2 mx-2 flex w-1 h-2/3 items-center justify-center bg-gray-300 dark:bg-gray-700"></div>
        )}
      </div>

      {/* Badges */}
      <span className="flex items-center gap-1">
        {subItem.new && (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${isActive
            ? "bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-200"
            : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
            }`}>
            new
          </span>
        )}
        {subItem.pro && (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${isActive
            ? "bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-200"
            : "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200"
            }`}>
            pro
          </span>
        )}
      </span>

      {/* Active indicator line */}
      {isActive && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-l-md"></div>
      )}
    </Link>
  </li>
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarContext = useSidebar();
  const { isExpanded = true, isMobileOpen = false, isHovered = false, setIsHovered } = sidebarContext || {};
  const pathname = usePathname();
  const { data: user } = useAppSelector((state) => state.profile);
  const filteredNavItems = useMemo(() => {
    const filtered = navItems
      .filter((item) => {
        const hasAccess = !item.roles || (user?.role && item.roles.includes(user.role as ROLES));
        return hasAccess;
      })
      .map((item) => {
        if (item.subItems) {
          const filteredSubItems = item.subItems.filter((subItem) =>
            !subItem.roles || (user?.role && subItem.roles.includes(user.role as ROLES))
          );

          if (filteredSubItems.length > 0 || !item.subItems.some(subItem => subItem.roles)) {
            return {
              ...item,
              subItems: filteredSubItems
            };
          }
          return null;
        }
        return item;
      })
      .filter((item): item is NavItem => item !== null);
    return filtered;
  }, [user?.role]);

  // Simplified submenu state management
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const isParentActive = useCallback((nav: NavItem) => {
    if (!nav.subItems) return false;
    return nav.subItems.some(subItem => isActive(subItem.path));
  }, [isActive]);

  // Auto-open submenu if any child is active
  useEffect(() => {
    let submenuMatched = false;

    filteredNavItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(`main-${index}`);
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, filteredNavItems]);

  // Calculate submenu heights
  useEffect(() => {
    if (openSubmenu !== null) {
      if (subMenuRefs.current[openSubmenu]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = useCallback((index: number) => {
    const key = `main-${index}`;
    setOpenSubmenu((prev) => prev === key ? null : key);
  }, []);

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4" role="navigation" aria-label="Main navigation">
      {navItems.map((nav, index) => (
        <li key={`${nav.name}-${index}`} className="w-full">
          {nav.subItems && nav.subItems.length > 0 ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item w-full max-w-60 h-11 px-4 py-5 justify-between group flex items-center border-none rounded-lg transition-all duration-200 ${openSubmenu === `main-${index}` || isParentActive(nav)
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
              aria-expanded={openSubmenu === `main-${index}`}
              aria-controls={`submenu-${index}`}
            >
              <span className={`${openSubmenu === `main-${index}` || isParentActive(nav)
                ? "menu-item-icon-active"
                : "menu-item-icon-inactive"
                }`}>
                {nav.icon}
              </span>
              {isExpanded && (
                <span className="menu-item-text font-medium">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <Icons.ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu === `main-${index}`
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item w-full ${isExpanded || isHovered || isMobileOpen ? 'max-w-60' : 'max-w-12'
                  } px-4 py-5 h-11 group flex items-center rounded-lg transition-all duration-200 ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  } ${isExpanded || isHovered || isMobileOpen ? 'justify-start' : 'justify-center'
                  }`}
                aria-current={isActive(nav.path) ? "page" : undefined}
                title={!(isExpanded || isHovered || isMobileOpen) ? nav.name : undefined}
              >
                <span className={`${isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text font-medium ml-3">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {/* Submenu - Only show when expanded, hovered, or mobile */}
          {nav.subItems && nav.subItems.length > 0 && (isExpanded || isHovered || isMobileOpen) && (
            <div
              id={`submenu-${index}`}
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu === `main-${index}`
                  ? `${subMenuHeight[`main-${index}`]}px`
                  : "0px",
              }}
            >
              <div className="ml-8 relative">
                <div className="absolute left-2 top-0 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                <ul className="space-y-1 text-sm w-full relative" role="menu">
                  {nav.subItems.map((subItem, subIndex) => (
                    <SubmenuItem
                      key={`${subItem.name}-${subIndex}`}
                      subItem={subItem}
                      isActive={isActive(subItem.path)}
                      isExpanded={isExpanded}
                      isHovered={isHovered}
                      isMobileOpen={isMobileOpen}
                    />
                  ))}
                </ul>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <Sidebar collapsible="icon" {...props} className="bg-white">
      <SidebarHeader>
        <div className="py-4 flex justify-center">
          <Link href="/" aria-label="Go to homepage">
            {isExpanded || isHovered || isMobileOpen ? (
              <div className="flex justify-center items-center w-full">
                <Image
                  className="dark:hidden h-16 w-16"
                  src="/logo.png"
                  alt="Company Logo"
                  width={100}

                  height={100}
                  priority
                />
              </div>
            ) : (
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={24}
                height={24}
                priority
              />
            )}
          </Link>
        </div>
        {isExpanded && user?.role && (
          <div className="justify-center pb-2.5">
            <p className="text-center text-red-500 font-semibold text-sm" role="status">
              {user.role}
            </p>
          </div>
        )}
      </SidebarHeader>

      <hr className="border-gray-200 dark:border-gray-800" />

      <SidebarContent>
        <div className="flex flex-col flex-grow overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6 mt-6">
            <div className={`flex flex-col gap-4 transition-all duration-300 ${isExpanded || isHovered || isMobileOpen ? 'px-5' : 'px-2'
              }`}>
              {renderMenuItems(filteredNavItems)}
            </div>
          </nav>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="p-4">
            <LogoutModal />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}