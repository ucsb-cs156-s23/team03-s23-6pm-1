import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { hotelUtils } from "main/utils/hotelUtils";
import HotelForm from "main/components/Hotels/HotelForm";
import { useNavigate } from "react-router-dom";

export default function HotelEditPage() {
  let { id } = useParams();

  let navigate = useNavigate();

  const response = hotelUtils.getById(id);

  const onSubmit = async (hotel) => {
    const updatedHotel = hotelUtils.update(hotel);
    console.log("updatedHotel: " + JSON.stringify(updatedHotel));
    navigate("/hotels");
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Hotel</h1>
        <HotelForm
          submitAction={onSubmit}
          buttonLabel={"Update"}
          initialContents={response.hotel}
        />
      </div>
    </BasicLayout>
  );
}
