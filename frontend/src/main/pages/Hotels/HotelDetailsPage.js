import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HotelTable from "main/components/Hotels/HotelTable";
import { hotelUtils } from "main/utils/hotelUtils";

export default function HotelDetailsPage() {
  let { id } = useParams();

  const response = hotelUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Hotel Details</h1>
        <HotelTable hotels={[response.hotel]} showButtons={false} />
      </div>
    </BasicLayout>
  );
}
