import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";
import LocationSelector from "./location-selector";

const initialAddressFormData = {
  address: "",
  city: "",
  state: "",
  country: "",
  phone: "",
  pincode: "",
  notes: "",
  isGift: false,
  giftMessage: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [statesData, setStatesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });

      return;
    }

    // Always coerce isGift to boolean and phone/pincode to string, and ensure notes is always present
    const safeFormData = {
      ...formData,
      country: formData.country || "",
      state: formData.state || "",
      city: formData.city || "",
      phone: String(formData.phone || "").replace(/\D/g, "").slice(0, 10),
      pincode: String(formData.pincode || "").replace(/\D/g, "").slice(0, 6),
      notes: formData.notes || "",
      isGift: Boolean(formData.isGift),
    };

    console.log("Form data before sending:", formData);
    console.log("Safe form data:", safeFormData);

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData: safeFormData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Address updated successfully",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...safeFormData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast({
              title: "Address added successfully",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      country: getCuurentAddress?.country,
      state: getCuurentAddress?.state,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
      isGift: Boolean(getCuurentAddress?.isGift),
      giftMessage: getCuurentAddress?.giftMessage || "",
    });
  }

  function isFormValid() {
    // If isGift is truthy, giftMessage must not be empty
    if (formData.isGift) {
      if (!formData.giftMessage || formData.giftMessage.trim() === "") return false;
    }
    
    // Check required fields: address, country, pincode, phone
    const requiredFields = ['address', 'country', 'pincode', 'phone'];
    const basicValidation = requiredFields.every(field => formData[field] && formData[field].trim() !== "");
    
    if (!basicValidation) return false;
    
    // If states are available, state is required
    if (statesData.length > 0 && (!formData.state || formData.state.trim() === "")) {
      return false;
    }
    
    // If cities are available, city is required
    if (citiesData.length > 0 && (!formData.city || formData.city.trim() === "")) {
      return false;
    }
    
    return true;
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  //console.log(addressList, "addressList");

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <LocationSelector 
          formData={formData} 
          setFormData={setFormData} 
          setStatesData={setStatesData}
          setCitiesData={setCitiesData}
        />
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
