import React, { useState, useEffect } from "react"
import AdminBase from "../../components/AdminBase"
import TableBase from "../../components/TableBase"
import TableHeader from "../../components/TableHeader"
import TableRow from "../../components/TableRow"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "../../actions"
import moment from "moment"
import Pagination from "../../components/Pagination"
import { useHistory } from "react-router-dom";

const ListAdmins = () => {

    const dispatch = useDispatch();
    let history = useHistory();
    const [headerColumns, setHeaderColumns] = useState(["ID", "Korisničko ime", "Kreirano", "Ažurirano"])
    const [dbColumns, setDbColumns] = useState(["id", "username", "createdAt", "modifiedAt"])
    const [filters, setFilters] = useState({
        page: 1,
        orderBy: 'id',
        ascOrDesc: 'asc',
        limit: 8,
    })

    const localActions = {
        getAllAdminsData: (params) => dispatch(actions.admins.getAllAdminsData(params)),
        deleteOne: (params) => dispatch(actions.admins.deleteOne(params))
    };

    const globalState = {
        adminsData: useSelector(state => state.admins.adminsData),
    };

    useEffect(() => {
        localActions.getAllAdminsData(filters)
    }, [])

    useEffect(() => {
        localActions.getAllAdminsData(filters)
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

    const goToDetails = (id) => {
        history.push(`/admin/admins/${id}/details`)
    }

    const newAdminAction = () => {
        history.push(`/admin/admins/new`)
    }

    const deleteRow = (id) => {
        localActions.deleteOne({
            id,
            successCallback: () => {
                localActions.getAllAdminsData(filters)
            }
        })
    }

    return (
        <AdminBase title={"Administratori"} selectedElement={"admins"}>
            <TableBase>
                <TableHeader headerColumns={headerColumns} updateFilters={updateOrderBy} dbColumns={dbColumns} />
                {
                    globalState.adminsData.admins.map((admin) => {
                        const item = [
                            admin.id,
                            admin.username,
                            moment(admin.createdAt).format("DD.MM.YYYY HH:MM"),
                            moment(admin.modifiedAt).format("DD.MM.YYYY HH:MM")
                        ]
                        return (
                            <TableRow
                                item={item}
                                key={admin.id}
                                id={admin.id}
                                firstAction={goToDetails}
                                firstTitle={"Detalji"}
                                secondAction={deleteRow}
                                secondTitle={"Obriši administratora"}
                            />
                        )
                    })
                }
                <Pagination
                    rowsPerPage={filters.limit}
                    updatePage={updatePage}
                    currentPage={filters.page}
                    updateRowsPerPage={updateRowsPerPage}
                    count={globalState.adminsData.allAdminsCount}
                    buttonAction={newAdminAction}
                    buttonName={"Novi administrator"}
                />
            </TableBase>
        </AdminBase>
    )
}

export default ListAdmins;