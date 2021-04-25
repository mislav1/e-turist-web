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

const ListComments = () => {

    const dispatch = useDispatch();
    let history = useHistory();
    const [headerColumns, setHeaderColumns] = useState(["ID", "Komentar", "Ime Korisnika", "Ruta", "Kreirano", "Ažurirano"])
    const [dbColumns, setDbColumns] = useState(["id", "comment", "fullName", "route", "createdAt", "modifiedAt"])
    const [filters, setFilters] = useState({
        page: 1,
        orderBy: 'id',
        ascOrDesc: 'asc',
        limit: 8,
    })

    const localActions = {
        getAllCommentsData: (params) => dispatch(actions.comments.getAllCommentsData(params)),
        deleteOne: (params) => dispatch(actions.comments.deleteOne(params))
    };

    const globalState = {
        commentsData: useSelector(state => state.comments.commentsData),
    };

    useEffect(() => {
        localActions.getAllCommentsData(filters)
    }, [])

    useEffect(() => {
        localActions.getAllCommentsData(filters)
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
        history.push(`/admin/comments/${id}/details`)
    }

    const newCommentAction = () => {
        history.push(`/admin/comments/new`)
    }

    const deleteRow = (id) => {
        localActions.deleteOne({
            id,
            successCallback: () => {
                localActions.getAllCommentsData(filters)
            }
        })
    }

    return (
        <AdminBase title={"Komentari"} selectedElement={"comments"}>
            <TableBase>
                <TableHeader headerColumns={headerColumns} updateFilters={updateOrderBy} dbColumns={dbColumns} />
                {
                    globalState.commentsData.comments.map((comment) => {
                        const item = [
                            comment.id,
                            comment.comment,
                            comment.fullName,
                            comment.route,
                            moment(comment.createdAt).format("DD.MM.YYYY HH:MM"),
                            moment(comment.modifiedAt).format("DD.MM.YYYY HH:MM")
                        ]
                        return (
                            <TableRow 
                                item={item} 
                                key={comment.id}
                                id={comment.id}
                                firstAction={goToDetails}
                                firstTitle={"Detalji"}
                                secondAction={deleteRow}
                                secondTitle={"Obriši komentar"} 
                            />
                        )
                    })
                }
                {
                    globalState.commentsData.allCommentsCount > 0 &&
                    <Pagination 
                        rowsPerPage={filters.limit} 
                        updatePage={updatePage} 
                        currentPage={filters.page} 
                        updateRowsPerPage={updateRowsPerPage} 
                        count={globalState.commentsData.allCommentsCount}
                        buttonAction={newCommentAction}
                        buttonName={"Novi komentar"}
                    />
                }
            </TableBase>
        </AdminBase>
    )
}

export default ListComments;