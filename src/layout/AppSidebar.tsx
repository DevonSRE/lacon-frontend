"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { Icons } from "@/icons/icons";
import LogoutModal from "@/components/logout-modal";
import { useAppSelector } from "@/hooks/redux";
import { ROLES } from "@/types/auth";
import { Dot } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[]; // List of roles allowed
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
    roles: ["PLATFORM ADMIN", "ADMIN", "DECONGESTION UNIT HEAD", "LACON LAWYER", "PRO BONO LAWYER", "DECONGESTION UNIT HEAD", "PDSS", "PRO_BONO_LAWYER", "LAWYER", "DIRECTOR GENERAL", "ZONAL DIRECTOR", "STATE COORDINATOR", "CENTRE COORDINATOR", "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD", "OSCAR UNIT HEAD", "PREROGATIVE OF MERCY UNIT HEAD", "DIO", "PARALEGAL"],
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
        roles: ["ADMIN", "DIRECTOR GENERAL",],
      },
      {
        name: "Lawyers",
        path: "/users/lawyers",
        roles: ["DECONGESTION UNIT HEAD"],
      },
      {
        name: "Request",
        path: "/users/request",
        roles: ["ADMIN", "DIRECTOR GENERAL",],
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
    roles: ["ADMIN", "PLATFORM ADMIN", "DIRECTOR GENERAL", "DIRECTOR GENERAL"],
  },
  {
    name: "Settings",
    icon: <Icons.settings />,
    path: "/settings",
    roles: ["ADMIN"],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { data: user } = useAppSelector((state) => state.profile);

  // Filter navigation items based on user role
  const getFilteredNavItems = useCallback(() => {
    return navItems
      .filter((item) => !item.roles || (user?.role && item.roles.includes(user.role as ROLES)))
      .map((item) => {
        // If the item has subItems, filter them based on user role
        if (item.subItems) {
          const filteredSubItems = item.subItems.filter((subItem) =>
            !subItem.roles || (user?.role && subItem.roles.includes(user.role as ROLES))
          );

          // Only return the item if it has at least one accessible subitem or no role restrictions
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
  }, [user?.role]);

  const renderMenuItems = (navItems: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name} className="w-full">
          {nav.subItems && nav.subItems.length > 0 ? (
            <button onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item w-60 h-11 px-4 py-5 justify-between group flex items-center border-none rounded-lg transition-all
                 duration-200 ${(openSubmenu?.type === menuType && openSubmenu?.index === index) || isParentActive(nav)
                  ? "menu-item-active"
                  : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}>
              <span className={`${(openSubmenu?.type === menuType && openSubmenu?.index === index) || isParentActive(nav)
                ? "menu-item-icon-active"
                : "menu-item-icon-inactive"
                }`}>
                {nav.icon}
              </span>
              {(isExpanded) && (
                <span className={`menu-item-text font-medium`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <Icons.ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
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
                className={`menu-item w-60 px-4 py-5 h-11 group flex items-center rounded-lg transition-all duration-200 ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  } ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text font-medium`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && nav.subItems.length > 0 && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              {/* Timeline Container */}
              <div className="ml-8 relative">
                {/* Timeline Line */}
                <div className="absolute left-2 top-0 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>

                <ul className="space-y-1 text-sm w-full relative">
                  {nav.subItems.map((subItem, subIndex) => (
                    <li key={subItem.name} className="w-full relative">
                      <Link href={subItem.path} className={`w-full pl-8 pr-4 py-4 flex items-center justify-between menu-dropdown-item relative rounded-lg transition-all duration-200 ${isActive(subItem.path)
                        ? "menu-dropdown-item-active bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                        : "menu-dropdown-item-inactive"
                        }`}
                      >

                        <div className="flex items-center justify-between mt-2 gap-3">
                          <span className="flex items-center gap-2">
                            {subItem.icon && (
                              <span className={`${isActive(subItem.path)
                                ? "menu-item-icon-active text-brand-600"
                                : "menu-item-icon-inactive"
                                }`}>
                                {subItem.icon}
                              </span>
                            )}
                            <span className=" flex items-center">
                              <Dot />
                              {subItem.name}
                            </span>
                          </span>
                          {isActive(subItem.path) && (
                            <div className="absolute right-10 mr-2 mx-2 flex w-1 h-2/3 items-center justify-center  bg-gray-300 dark:bg-gray-700"></div>
                          )}
                        </div>


                        {/* Badges */}
                        <span className="flex items-center gap-1">
                          {subItem.new && (
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${isActive(subItem.path)
                                ? "bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-200"
                                : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                                }`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${isActive(subItem.path)
                                ? "bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-200"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200"
                                }`}
                            >
                              pro
                            </span>
                          )}
                        </span>

                        {/* Active indicator line */}
                        {isActive(subItem.path) && (
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-l-md"></div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    const filteredNavItems = getFilteredNavItems();

    ["main"].forEach((menuType) => {
      filteredNavItems.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, getFilteredNavItems]);

  // Check if any subitem of a parent menu is active
  const isParentActive = useCallback((nav: NavItem) => {
    if (!nav.subItems) return false;
    return nav.subItems.some(subItem => isActive(subItem.path));
  }, [isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const filteredNavItems = getFilteredNavItems();

  return (
    <aside className={`fixed  flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
        ? "w-[300px]"
        : isHovered
          ? "w-[300px]"
          : "w-[90px]"
      }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="py-4 flex justify-center">
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex justify-center items-center w-full">
              <Image className="dark:hidden" src="/logo.png"
                alt="Logo"
                width={60}
                height={30}
              />
            </div>
          ) : (
            <Image src="/logo.png" alt="Logo" width={24} height={24} />
          )}
        </Link>
      </div>
      {isExpanded && (
        <div className="justify-center pb-2.5">
          <p className="text-center text-red-500 font-semibold ">{user?.role}</p>
        </div>
      )}
      <hr />
      <div className="flex flex-col flex-grow overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 mt-6">
          <div className="flex flex-col px-5 gap-4">
            {renderMenuItems(filteredNavItems, "main")}
          </div>
        </nav>
      </div>

      <div className="border-t  border-gray-200 dark:border-gray-800">
        <div className="p-4">
          <LogoutModal />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;