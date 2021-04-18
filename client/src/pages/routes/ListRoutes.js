import React from "react"
import AdminBase from "../../components/AdminBase"
import TableBase from "../../components/TableBase"
import TableHeader from "../../components/TableHeader"
import TableRow from "../../components/TableRow"

const ListRoutes = () => {

    const headerColumns = ["ID", "Ime rute", "Slika", "Grad", "Kreirano", "Ažurirano"]
    const item = ["1", "Restorani u Zagrebu", "ajfdgjnAGdgfgfh.jpeg", "Zagreb", "29.01.2021", "30.01.2021"]

    return (
        <AdminBase title={"Rute"} selectedElement={"routes"}>
            <TableBase>
                <TableHeader headerColumns={headerColumns} />
                <TableRow item={item}/>
                <TableRow item={item}/>
                <TableRow item={item}/>
                <TableRow item={item}/>
                <TableRow item={item}/>
                <TableRow item={item}/>
                <TableRow item={item}/>
                <TableRow item={item}/>
                <TableRow item={item}/>
                <TableRow item={item}/>
            </TableBase>
        </AdminBase>
    )
}

export default ListRoutes;