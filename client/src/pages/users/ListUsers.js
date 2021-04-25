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

const ListUsers = () => {

    const dispatch = useDispatch();
    let history = useHistory();
    const [headerColumns, setHeaderColumns] = useState(["ID", "Email", "Ime Korisnika", "Kreirano", "Ažurirano"])
    const [dbColumns, setDbColumns] = useState(["id", "email", "fullName", "createdAt", "modifiedAt"])
    const [filters, setFilters] = useState({
        page: 1,
        orderBy: 'id',
        ascOrDesc: 'asc',
        limit: 8,
    })

    const localActions = {
        getAllUsersData: (params) => dispatch(actions.users.getAllUsersData(params)),
        deleteOne: (params) => dispatch(actions.users.deleteOne(params))
    };

    const globalState = {
        usersData: useSelector(state => state.users.usersData),
    };

    useEffect(() => {
        localActions.getAllUsersData(filters)
    }, [])

    useEffect(() => {
        localActions.getAllUsersData(filters)
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
        history.push(`/admin/users/${id}/details`)
    }

    const newUserAction = () => {
        history.push(`/admin/users/new`)
    }

    const deleteRow = (id) => {
        localActions.deleteOne({
            id,
            successCallback: () => {
                localActions.getAllUsersData(filters)
            }
        })
    }

    return (
        <AdminBase title={"Korisnici"} selectedElement={"users"}>
            <TableBase>
                <TableHeader headerColumns={headerColumns} updateFilters={updateOrderBy} dbColumns={dbColumns} />
                {
                    globalState.usersData.users.map((user) => {
                        const item = [
                            user.id,
                            user.email,
                            user.fullName,
                            moment(user.createdAt).format("DD.MM.YYYY HH:MM"),
                            moment(user.modifiedAt).format("DD.MM.YYYY HH:MM")
                        ]
                        return (
                            <TableRow 
                                item={item} 
                                key={user.id}
                                id={user.id}
                                firstAction={goToDetails}
                                firstTitle={"Detalji"}
                                secondAction={deleteRow}
                                secondTitle={"Obriši korisnika"} 
                            />
                        )
                    })
                }
                {
                    globalState.usersData.allUsersCount > 0 &&
                    <Pagination 
                        rowsPerPage={filters.limit} 
                        updatePage={updatePage} 
                        currentPage={filters.page} 
                        updateRowsPerPage={updateRowsPerPage} 
                        count={globalState.usersData.allUsersCount}
                        buttonAction={newUserAction}
                        buttonName={"Novi korisnik"}
                    />
                }
            </TableBase>
        </AdminBase>
    )
}

export default ListUsers;