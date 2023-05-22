import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/bookUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function BookTable({ books, currentUser, showButtons=true, testIdPrefix="BookTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/books/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/books/details/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/books/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


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

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedDates = React.useMemo(() => books, [books]);

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={testIdPrefix}
    />;
};