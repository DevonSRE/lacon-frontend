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


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[]; // List of roles allowed
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
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
    roles: ["ADMIN", "PRO_BONO_LAWYER", "DECONGESTION UNIT HEAD", "PDSS", "DIRECTOR GENERAL", "ZONAL DIRECTOR", "STATE COORDINATOR", "CENTRE COORDINATOR", "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD", "OSCAR UNIT HEAD", "PREROGATIVE OF MERCY UNIT HEAD", "DIO", "PARALEGAL"],
  },
  {
    icon: <Icons.userRole />,
    name: "Users Role",
    path: "/users-role/all",
    roles: ["PLATFORM ADMIN",],
  },
  {
    icon: <Icons.userRole />,
    name: "Users Role",
    // path: "/users-role/all",
    roles: ["ADMIN", "DIRECTOR GENERAL"],
    subItems: [
      {
        name: "All Users",
        path: "/users-role/all",
      },
      {
        name: "Request",
        path: "/users-role/request",
      },
    ]
  },
  {
    icon: <Icons.lawyerIcons />,
    name: "Lawyers",
    path: "/lawyers",
    roles: ["ZONAL DIRECTOR", "STATE COORDINATOR", "CENTRE COORDINATOR", "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD", "PREROGATIVE OF MERCY UNIT HEAD", "DIO"],
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
  console.log(user);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button onClick={() => handleSubmenuToggle(index, menuType)} className={`menu-item p-2 justify-between group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
              ? "menu-item-active p-2"
              : "menu-item-inactive p-2"
              } cursor-pointer ${!isExpanded && !isHovered
                ? "lg:justify-center p-2"
                : "lg:justify-start p-2"}`}>
              <span className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
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
              <Link href={nav.path} className={`menu-item group p-2 ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>

            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div ref={(el) => {
              subMenuRefs.current[`${menuType}-${index}`] = el;
            }}
              className="overflow-hidden p-2 transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 text-sm ">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`p-4 menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
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
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = navItems;
      items.forEach((nav, index) => {
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
  }, [pathname, isActive]);

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

  return (
    <aside className={`fixed mt-16 flex flex-col   lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
        ? "w-[290px]"
        : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} onMouseEnter={() => !isExpanded && setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>

      <div className="py-4 flex justify-center">
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex justify-center items-center w-full">
              <Image
                className="dark:hidden"
                src="/logo.png"
                alt="Logo"
                width={80}
                height={40}
              />
            </div>
          ) : (
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className=" justify-center pb-2.5">
        <p className="text-center text-red-500 font-semibold text-lg">{user?.role}</p>
        {/* <p className="text-center  text-gray-500 text-lg">#{user?.id.substring(0, 7)}</p> */}
      </div>
      <hr />

      <div className="flex flex-col flex-grow overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                ? "lg:justify-center"
                : "justify-start"
                }`}>
                {isExpanded || isHovered || isMobileOpen ? ("") : (<Icons.HorizontaLDots />)}
              </h2>
              {/* {renderMenuItems(navItems, "main")} */}
              {renderMenuItems(
                navItems.filter((item) =>
                  !item.roles || (user?.role && item.roles.includes(user.role as ROLES))
                ), "main"
              )}

            </div>
          </div>
        </nav>
      </div>
      <div className="p-4 border-t mb-20 border-gray-200 dark:border-gray-800">
        <LogoutModal />
      </div>
    </aside>
  );
};

export default AppSidebar;
