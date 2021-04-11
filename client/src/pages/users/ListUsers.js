import React from "react"
import AdminBase from "../../components/AdminBase"

const ListUsers = (props) => {

    return (
        <AdminBase title={"Korisnici"} selectedElement={"users"}>
            <div>LISTA KORISNIKA</div>
        </AdminBase>
    )
}

export default ListUsers;