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

const ListDestinations = () => {

    const dispatch = useDispatch();
    let history = useHistory();
    const [headerColumns, setHeaderColumns] = useState(["ID", "Ime destinacije", "Slika", "Koordinate", "Grad", "Kreirano", "Ažurirano"])
    const [dbColumns, setDbColumns] = useState(["id", "name", "picturePath", "coordinates", "city", "createdAt", "modifiedAt"])
    const [filters, setFilters] = useState({
        page: 1,
        orderBy: 'id',
        ascOrDesc: 'asc',
        limit: 8,
    })

    const localActions = {
        getAllDestinationsData: (params) => dispatch(actions.destinations.getAllDestinationsData(params)),
        deleteOne: (params) => dispatch(actions.destinations.deleteOne(params))
    };

    const globalState = {
        destinationsData: useSelector(state => state.destinations.destinationsData),
    };

    useEffect(() => {
        localActions.getAllDestinationsData(filters)
    }, [])

    useEffect(() => {
        localActions.getAllDestinationsData(filters)
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
        history.push(`/admin/destinations/${id}/details`)
    }

    const newRouteAction = () => {
        history.push(`/admin/destinations/new`)
    }

    const deleteRow = (id) => {
        localActions.deleteOne({
            id,
            successCallback: () => {
                localActions.getAllDestinationsData(filters)
            }
        })
    }

    return (
        <AdminBase title={"Destinacije"} selectedElement={"destinations"}>
            <TableBase>
                <TableHeader headerColumns={headerColumns} updateFilters={updateOrderBy} dbColumns={dbColumns} />
                {
                    globalState.destinationsData.destinations.map((destination) => {
                        const item = [
                            destination.id,
                            destination.name,
                            destination.picturePath,
                            destination.coordinates.coordinates.join(", "),
                            destination.city,
                            moment(destination.createdAt).format("DD.MM.YYYY HH:mm"),
                            moment(destination.modifiedAt).format("DD.MM.YYYY HH:mm")
                        ]
                        return (
                            <TableRow
                                item={item}
                                key={destination.id}
                                id={destination.id}
                                firstAction={goToDetails}
                                firstTitle={"Detalji"}
                                secondAction={deleteRow}
                                secondTitle={"Obriši destinaciju"}
                            />
                        )
                    })
                }
                <Pagination
                    rowsPerPage={filters.limit}
                    updatePage={updatePage}
                    currentPage={filters.page}
                    updateRowsPerPage={updateRowsPerPage}
                    count={globalState.destinationsData.allDestinationsCount}
                    buttonAction={newRouteAction}
                    buttonName={"Nova destinacija"}
                />
            </TableBase>
        </AdminBase>
    )
}

export default ListDestinations;