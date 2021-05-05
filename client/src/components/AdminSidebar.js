import React from "react"
import { useDispatch } from "react-redux"
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

const AdminSidebar = ({ selectedElement }) => {    
    return (
        <div className={styles["sidebar"]}>
            <div className={styles["sidebar-title"]}>eTurist</div>
            <SidebarItem title={"Rute"} selected={selectedElement === "routes"} goTo={"routes"}>
                <RouteIcon />
            </SidebarItem>
            <SidebarItem title={"Destinacije"} selected={selectedElement === "destinations"} goTo={"destinations"}>
                <DestinationIcon />
            </SidebarItem>
            <SidebarItem title={"Gradovi"} selected={selectedElement === "cities"} goTo={"cities"}>
                <CityIcon />
            </SidebarItem>
            <SidebarItem title={"Komentari"} selected={selectedElement === "comments"} goTo={"comments"}>
                <CommentsIcon />
            </SidebarItem>
            <div className={styles["divider"]}></div>
            <SidebarItem title={"Korisnici"} selected={selectedElement === "users"} goTo={"users"}>
                <UsersIcon />
            </SidebarItem>
            <SidebarItem title={"Administratori"} selected={selectedElement === "admins"} goTo={"admins"}>
                <AdminIcon />
            </SidebarItem>
            <div className={styles["divider"]}></div>
            <SidebarItem title={"Odjava"} selected={selectedElement === "logout"} goTo={"logout"}>
                <LogoutIcon />
            </SidebarItem>
        </div>
    )
}

function SidebarItem({ title, selected = false, children, goTo }) {
    const history = useHistory();
    const dispatch = useDispatch();

    const localActions = {
        logoutAdmin: (cb) => dispatch(actions.admin.logoutAdmin(cb))
    };

    const handleClick = () => {
        if(goTo === "logout"){
            localActions.logoutAdmin(logoutCallback)
        } else {
            history.push("/admin/" + goTo)
        }
    }

    const logoutCallback = () => {
        history.push("/")
    }

    return (
        <div className={selected ? styles["sidebar-item-selected"] : styles["sidebar-item"]}>
            <div className={styles["item-icon"]} onClick={handleClick}>{children}</div>
            <div className={styles["item-text"]} onClick={handleClick}>{title}</div>
        </div>
    )
}

export default AdminSidebar;