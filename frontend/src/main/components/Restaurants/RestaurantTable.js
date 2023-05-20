import React from "react";
import OurTable, {ButtonColumn} from "main/components/OurTable";
import {useNavigate} from "react-router-dom";
import {cellToAxiosParamsDelete, onDeleteSuccess} from "main/utils/restaurantUtils";
import {useBackendMutation} from "../../utils/useBackend";
import {hasRole} from "../../utils/currentUser";

export default function RestaurantTable({
  restaurants,
  showButtons = true,
  testIdPrefix = "RestaurantTable",
  currentUser = null
}) {

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    {onSuccess: onDeleteSuccess},
    ["/api/restaurants/all"]
  );
  // Stryker enable all

  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/restaurants/edit/${cell.row.values.id}`);
  };

  const detailsCallback = (cell) => {
    navigate(`/restaurants/details/${cell.row.values.id}`);
  };

  const columns = [
    {
      Header: 'id',
      accessor: 'id',
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Address',
      accessor: 'address',
    }
  ];

  if (showButtons) {
    columns.push(ButtonColumn("Details", "primary", detailsCallback, testIdPrefix));
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      columns.push(
        ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
        ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
      );
    }
  }

  return <OurTable
    data={restaurants}
    columns={columns}
    testid={testIdPrefix}
  />;
};