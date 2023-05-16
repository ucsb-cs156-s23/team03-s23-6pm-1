import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { hotelUtils } from "main/utils/hotelUtils";

const showCell = (cell) => JSON.stringify(cell.row.values);

const defaultDeleteCallback = async (cell) => {
  console.log(`deleteCallback: ${showCell(cell)})`);
  hotelUtils.del(cell.row.values.id);
};

export default function HotelTable({
  hotels,
  deleteCallback = defaultDeleteCallback,
  showButtons = true,
  testIdPrefix = "HotelTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    console.log(`editCallback: ${showCell(cell)})`);
    navigate(`/hotels/edit/${cell.row.values.id}`);
  };

  const detailsCallback = (cell) => {
    console.log(`detailsCallback: ${showCell(cell)})`);
    navigate(`/hotels/details/${cell.row.values.id}`);
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
      Header: "Address",
      accessor: "address",
    },
    {
      Header: "Description",
      accessor: "description",
    },
  ];

  const buttonColumns = [
    ...columns,
    ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
    ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
    ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
  ];

  const columnsToDisplay = showButtons ? buttonColumns : columns;

  return (
    <OurTable data={hotels} columns={columnsToDisplay} testid={testIdPrefix} />
  );
}

export { showCell };
