import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useNavigate } from "react-router-dom";
import HotelForm from "main/components/Hotels/HotelForm";
import { hotelUtils } from "main/utils/hotelUtils";

export default function HotelCreatePage() {
  let navigate = useNavigate();

  const onSubmit = async (hotel) => {
    const createdHotel = hotelUtils.add(hotel);
    console.log("createdHotel: " + JSON.stringify(createdHotel));
    navigate("/hotels");
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Hotel</h1>
        <HotelForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
