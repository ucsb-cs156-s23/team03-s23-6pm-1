import React from "react";
import Button from "react-bootstrap/Button";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useNavigate, Link } from "react-router-dom";
import { hotelUtils } from "main/utils/hotelUtils";
import HotelTable from "main/components/Hotels/HotelTable";

export default function HotelIndexPage() {
  const navigate = useNavigate();

  const hotelCollection = hotelUtils.get();
  const hotels = hotelCollection.hotels;

  const showCell = (cell) => JSON.stringify(cell.row.values);

  const deleteCallback = async (cell) => {
    console.log(`HotelIndexPage deleteCallback: ${showCell(cell)})`);
    hotelUtils.del(cell.row.values.id);
    navigate("/hotels");
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <Button style={{ float: "right" }} as={Link} to="/hotels/create">
          Create Hotel
        </Button>
        <h1>Hotels</h1>
        <HotelTable hotels={hotels} deleteCallback={deleteCallback} />
      </div>
    </BasicLayout>
  );
}
