import React, { useState, useEffect } from "react"
import AdminBase from "../../components/AdminBase"
import TableBase from "../../components/TableBase"
import TableHeader from "../../components/TableHeader"
import TableRow from "../../components/TableRow"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../../actions"
import moment from "moment"
import Pagination from "../../components/Pagination"

const ListRoutes = () => {

    const dispatch = useDispatch();
    const [headerColumns, setHeaderColumns] = useState(["ID", "Ime rute", "Slika", "Grad", "Kreirano", "Ažurirano"])
    const [dbColumns, setDbColumns] = useState(["id", "name", "picturePath", "city", "createdAt", "modifiedAt"])
    const [filters, setFilters] = useState({
        page: 1,
        orderBy: 'id',
        ascOrDesc: 'asc',
        limit: 8,
    })

    const localActions = {
        getAllRoutesData: (params) => dispatch(actions.routes.getAllRoutesData(params))
    };

    const globalState = {
        routesData: useSelector(state => state.routes.routesData),
    };

    useEffect(() => {
        localActions.getAllRoutesData(filters)
    }, [])

    useEffect(() => {
        localActions.getAllRoutesData(filters)
    }, [filters.page, filters.orderBy, filters.ascOrDesc, filters.limit])

    const updateOrderBy = (column) => {
        if (filters.orderBy === column) {
            setFilters({
                ...filters,
                ascOrDesc: filters.ascOrDesc === "desc" ? "asc" : "desc"
            })
        } else {
            setFilters({
                ...filters,
                orderBy: column,
                ascOrDesc: "asc"
            })
        }
    }

    const updatePage = (page) => {
        setFilters({
            ...filters,
            page
        })
    }

    const updateRowsPerPage = (limit) => {
        setFilters({
            ...filters,
            limit,
            page: 1
        })
    }

    return (
        <AdminBase title={"Rute"} selectedElement={"routes"}>
            <TableBase>
                <TableHeader headerColumns={headerColumns} updateFilters={updateOrderBy} dbColumns={dbColumns} />
                {
                    globalState.routesData.routes.map((route) => {
                        const item = [
                            route.id,
                            route.name,
                            route.picturePath,
                            route.city,
                            moment(route.createdAt).format("DD.MM.YYYY HH:MM"),
                            moment(route.modifiedAt).format("DD.MM.YYYY HH:MM")
                        ]
                        return <TableRow item={item} key={route.id} />
                    })
                }
                {
                    globalState.routesData.allRoutesCount > 0 &&
                    <Pagination 
                        rowsPerPage={filters.limit} 
                        updatePage={updatePage} 
                        currentPage={filters.page} 
                        updateRowsPerPage={updateRowsPerPage} 
                        count={globalState.routesData.allRoutesCount}
                    />
                }
            </TableBase>
        </AdminBase>
    )
}

export default ListRoutes;