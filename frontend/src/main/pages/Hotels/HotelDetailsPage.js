import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HotelTable from "main/components/Hotels/HotelTable";
import { hotelUtils } from "main/utils/hotelUtils";
import { useBackend } from "main/utils/useBackend";

export default function HotelDetailsPage() {
  let { id } = useParams();

  const {
    data: hotel,
    error,
    status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of ReactQuery
    [`/api/hotels?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: "/api/hotels",
      params: {
        id,
      },
    }
  );

  const hotels = hotel ? [hotel] : [];

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Hotel Details</h1>
        <HotelTable hotels={hotels} showButtons={false} />
      </div>
    </BasicLayout>
  );
}
