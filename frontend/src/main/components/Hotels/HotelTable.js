import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/hotelUtils";
import { hasRole } from "main/utils/currentUser";

const showCell = (cell) => JSON.stringify(cell.row.values);

export default function HotelTable({
  hotels,
  currentUser,
  showButtons = true,
  testIdPrefix = "HotelTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/hotels/edit/${cell.row.values.id}`);
  };

  const detailsCallback = (cell) => {
    navigate(`/hotels/details/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/hotels/all"]
  );
  // Stryker enable all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Address",
      accessor: "address",
    },
  ];

  const ButtonColumns = [
    ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    ButtonColumns.push(
      ButtonColumn("Edit", "primary", editCallback, "HotelTable")
    );
    ButtonColumns.push(
      ButtonColumn("Delete", "danger", deleteCallback, "HotelTable")
    );
  }

  const columnsToDisplay = showButtons
    ? [...columns, ...ButtonColumns]
    : columns;

  // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
  const memoizedColumns = React.useMemo(
    () => columnsToDisplay,
    [columnsToDisplay]
  );
  const memoizedHotels = React.useMemo(() => hotels, [hotels]);

  return (
    <OurTable
      data={memoizedHotels}
      columns={memoizedColumns}
      testid={testIdPrefix}
    />
  );
}

export { showCell };
