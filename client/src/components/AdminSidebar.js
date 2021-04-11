import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as actions from "../actions"
import { useHistory } from "react-router-dom";
import styles from "./AdminSidebar.module.scss"
import { ReactComponent as RouteIcon } from "../assets/route.svg"
import { ReactComponent as DestinationIcon } from "../assets/destination.svg"
import { ReactComponent as CityIcon } from "../assets/city.svg"
import { ReactComponent as CommentsIcon } from "../assets/comments.svg"
import { ReactComponent as UsersIcon } from "../assets/user.svg"
import { ReactComponent as AdminIcon } from "../assets/admin.svg"
import { ReactComponent as LogoutIcon } from "../assets/logout.svg"

export default ({ children, selectedElement }) => {
    const dispatch = useDispatch();
    let history = useHistory();
    
    return (
        <div className={styles["sidebar"]}>
            <div className={styles["sidebar-title"]}>eTurist</div>
            <SidebarItem title={"Rute"} selected={selectedElement === "routes"}>
                <RouteIcon />
            </SidebarItem>
            <SidebarItem title={"Destinacije"} selected={selectedElement === "destinations"}>
                <DestinationIcon />
            </SidebarItem>
            <SidebarItem title={"Gradovi"} selected={selectedElement === "cities"}>
                <CityIcon />
            </SidebarItem>
            <SidebarItem title={"Komentari"} selected={selectedElement === "comments"}>
                <CommentsIcon />
            </SidebarItem>
            <div className={styles["divider"]}></div>
            <SidebarItem title={"Korisnici"} selected={selectedElement === "users"}>
                <UsersIcon />
            </SidebarItem>
            <SidebarItem title={"Administratori"} selected={selectedElement === "admins"}>
                <AdminIcon />
            </SidebarItem>
            <div className={styles["divider"]}></div>
            <SidebarItem title={"Odjavite se"} selected={selectedElement === "logout"}>
                <LogoutIcon />
            </SidebarItem>
        </div>
    )
}

function SidebarItem({ title, selected = false, children }) {

    return (
        <div className={selected ? styles["sidebar-item-selected"] : styles["sidebar-item"]}>
            <div className={styles["item-icon"]}>{children}</div>
            <div className={styles["item-text"]}>{title}</div>
        </div>
    )
}