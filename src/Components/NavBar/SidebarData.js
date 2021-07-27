import React from "react";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";

export const SidebarData = [
  {
    title: "รายชื่อพนักงาน",
    path: "/list",
    icon: <BsIcons.BsFillPeopleFill />,
    cName: "nav-text",
  },
  {
    title: "เพิ่มพนักงาน",
    path: "/adduser",
    icon: <BsIcons.BsFillPersonPlusFill />,
    cName: "nav-text",
  },
  {
    title: "ประวัติการเข้าทำงาน",
    path: "/checking",
    icon: <FaIcons.FaCalendarCheck />,
    cName: "nav-text",
  },
  {
    title: "ประวัติการลางาน",
    path: "/leave",
    icon: <FaIcons.FaCalendarTimes />,
    cName: "nav-text",
  },
];
