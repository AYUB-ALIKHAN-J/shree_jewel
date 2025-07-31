import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        {addressInfo?.city && addressInfo.city.trim() !== "" && (
          <Label>City: {addressInfo?.city}</Label>
        )}
        {addressInfo?.state && addressInfo.state.trim() !== "" && (
          <Label>State: {addressInfo?.state}</Label>
        )}
        <Label>Country: {addressInfo?.country}</Label>
        <Label>pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>
          {addressInfo?.isGift ? (
            <span className="text-green-700 font-bold">To a friend</span>
          ) : (
            <span>Myself</span>
          )}
        </Label>
        {addressInfo?.isGift && addressInfo?.giftMessage ? (
          <Label>Gift Message: {addressInfo.giftMessage}</Label>
        ) : null}
        {addressInfo?.notes && addressInfo.notes.trim() !== "" ? (
          <Label>Notes: {addressInfo.notes}</Label>
        ) : null}
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
