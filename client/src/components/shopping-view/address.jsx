import { useEffect, useState, useRef } from "react";
import CommonForm from "../common/form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
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
import { Plus } from "lucide-react";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statesData, setStatesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const addressContainerRef = useRef(null); // Ref for scrolling page up

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  // Effect to scroll the page to the top of the address book after closing the dialog
  useEffect(() => {
    if (!isFormOpen && addressContainerRef.current) {
      addressContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isFormOpen]);

  function handleManageAddress(event) {
    event.preventDefault();
    if (addressList.length >= 3 && currentEditedId === null) {
      toast({ title: "You can add a maximum of 3 addresses", variant: "destructive" });
      return;
    }
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
    const action = currentEditedId !== null
      ? editaAddress({ userId: user?.id, addressId: currentEditedId, formData: safeFormData })
      : addNewAddress({ ...safeFormData, userId: user?.id });
    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        setIsFormOpen(false);
        toast({ title: `Address ${currentEditedId ? 'updated' : 'added'} successfully` });
      }
    });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({ title: "Address deleted successfully" });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      address: getCuurentAddress?.address, country: getCuurentAddress?.country, state: getCuurentAddress?.state,
      city: getCuurentAddress?.city, phone: getCuurentAddress?.phone, pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes, isGift: Boolean(getCuurentAddress?.isGift), giftMessage: getCuurentAddress?.giftMessage || "",
    });
    setIsFormOpen(true);
  }

  function handleAddNewClick() {
    setCurrentEditedId(null);
    setFormData(initialAddressFormData);
    setIsFormOpen(true);
  }
  
  function isFormValid() {
    if (formData.isGift) {
      if (!formData.giftMessage || formData.giftMessage.trim() === "") return false;
    }
    const requiredFields = ['address', 'country', 'pincode', 'phone'];
    const basicValidation = requiredFields.every(field => formData[field] && String(formData[field]).trim() !== "");
    if (!basicValidation) return false;
    if (statesData.length > 0 && (!formData.state || formData.state.trim() === "")) return false;
    if (citiesData.length > 0 && (!formData.city || formData.city.trim() === "")) return false;
    return true;
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch, user]);

  return (
    <div ref={addressContainerRef} className="bg-white p-6 lg:p-8 rounded-lg border border-gray-200/80 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-serif text-gray-900">Address Book</h3>
        <Button onClick={handleAddNewClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">You have no saved addresses.</p>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {/* MODIFIED: The DialogContent is now a flex container with a max height */}
        <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[82vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-serif">
              {currentEditedId !== null ? "Edit Destination" : "Add New Destination"}
            </DialogTitle>
          </DialogHeader>
          {/* MODIFIED: This div wraps the form and is now the scrollable area */}
          <div className="flex-grow overflow-y-auto space-y-4 py-4 pr-4">
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
              buttonText={currentEditedId !== null ? "Save Changes" : "Add Destination"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Address;