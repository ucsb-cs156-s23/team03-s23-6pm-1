import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/bookUtils";
import { hasRole } from "main/utils/currentUser";

export default function BookTable({ books, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/books/edit/${cell.row.values.id}`)
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

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "BookTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "BookTable"));
    } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedBooks = React.useMemo(() => books, [books]);

    return <OurTable
        data={memoizedBooks}
        columns={memoizedColumns}
        testid={"BookTable"}
    />;
};