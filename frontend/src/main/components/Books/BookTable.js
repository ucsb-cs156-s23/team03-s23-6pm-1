import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { hasRole } from "main/utils/currentUser";

export default function BookTable({
    books,
    showButtons = true,
    testIdPrefix = "BookTable",
    currentUser = null }) {

    const onDeleteSuccess = message => {
        console.log(message);
        toast(message);
    };

    const objectToAxiosParams = function (cell) {
        return {
            url: "/api/books",
            method: "DELETE",
            params: {
                id: cell.row.values.id
            }
        };
    };

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/books/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/books/details/${cell.row.values.id}`)
    }

    const deleteCallback = async (cell) => {
        deleteMutation.mutate(cell);
    };

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess: onDeleteSuccess },
        ["/api/books/all"]
    );


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Author',
            accessor: 'author',
        },
        {
            Header: 'Genre',
            accessor: 'genre',
        }
    ];

    if (showButtons) {
        columns.push(ButtonColumn("Details", "primary", detailsCallback, testIdPrefix));

        if (hasRole(currentUser, "ROLE_ADMIN")) {
            columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
                columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
        }
    }

    return <OurTable
        data={books}
        columns={columns}
        testid={testIdPrefix}
    />;
};