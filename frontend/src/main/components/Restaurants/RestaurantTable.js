import React from "react";
import OurTable, {ButtonColumn} from "main/components/OurTable";
import {useNavigate} from "react-router-dom";
import {useBackendMutation} from "../../utils/useBackend";
import {hasRole} from "../../utils/currentUser";
import {toast} from "react-toastify";

export default function RestaurantTable({
  restaurants,
  showButtons = true,
  testIdPrefix = "RestaurantTable",
  currentUser = null
}) {

  const onDeleteSuccess = message => {
    console.log(message);
    toast(message);
  };

  const objectToAxiosParams = function (cell) {
    return {
      url: "/api/restaurants",
      method: "DELETE",
      params: {
        id: cell.row.values.id
      }
    };
  };

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    objectToAxiosParams,
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