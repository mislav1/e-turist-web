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

const ListCities = () => {

    const dispatch = useDispatch();
    let history = useHistory();
    const [headerColumns, setHeaderColumns] = useState(["ID", "Ime grada", "Identifikator", "Kreirano", "Ažurirano"])
    const [dbColumns, setDbColumns] = useState(["id", "name", "identifier", "createdAt", "modifiedAt"])
    const [filters, setFilters] = useState({
        page: 1,
        orderBy: 'id',
        ascOrDesc: 'asc',
        limit: 8,
    })

    const localActions = {
        getAllCitiesData: (params) => dispatch(actions.cities.getAllCitiesData(params)),
        deleteOne: (params) => dispatch(actions.cities.deleteOne(params))
    };

    const globalState = {
        citiesData: useSelector(state => state.cities.citiesData),
    };

    useEffect(() => {
        localActions.getAllCitiesData(filters)
    }, [])

    useEffect(() => {
        localActions.getAllCitiesData(filters)
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
        history.push(`/admin/cities/${id}/details`)
    }

    const newRouteAction = () => {
        history.push(`/admin/cities/new`)
    }

    const deleteRow = (id) => {
        localActions.deleteOne({
            id,
            successCallback: () => {
                localActions.getAllCitiesData(filters)
            }
        })
    }

    return (
        <AdminBase title={"Gradovi"} selectedElement={"cities"}>
            <TableBase>
                <TableHeader headerColumns={headerColumns} updateFilters={updateOrderBy} dbColumns={dbColumns} />
                {
                    globalState.citiesData.cities.map((city) => {
                        const item = [
                            city.id,
                            city.name,
                            city.identifier,
                            moment(city.createdAt).format("DD.MM.YYYY HH:MM"),
                            moment(city.modifiedAt).format("DD.MM.YYYY HH:MM")
                        ]
                        return (
                            <TableRow 
                                item={item} 
                                key={city.id}
                                id={city.id}
                                firstAction={goToDetails}
                                firstTitle={"Detalji"}
                                secondAction={deleteRow}
                                secondTitle={"Obriši grad"} 
                            />
                        )
                    })
                }
                {
                    globalState.citiesData.allCitiesCount > 0 &&
                    <Pagination 
                        rowsPerPage={filters.limit} 
                        updatePage={updatePage} 
                        currentPage={filters.page} 
                        updateRowsPerPage={updateRowsPerPage} 
                        count={globalState.citiesData.allCitiesCount}
                        buttonAction={newRouteAction}
                        buttonName={"Novi grad"}
                    />
                }
            </TableBase>
        </AdminBase>
    )
}

export default ListCities;