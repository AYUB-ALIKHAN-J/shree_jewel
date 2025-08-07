import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Gift, StickyNote,Check
 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  // Stop propagation to prevent the card's onClick from firing when an action is chosen
  const onActionSelect = (e, handler) => {
    e.stopPropagation();
    handler(addressInfo);
  };

  const isSelectable = !!setCurrentSelectedAddress;
  const isSelected = selectedId?._id === addressInfo?._id;

  const handleToggleSelect = () => {
    if (isSelectable) {
      // If already selected, unselect by passing null
      // Otherwise, select this address
      setCurrentSelectedAddress(isSelected ? null : addressInfo);
    }
  };

  return (
    <Card
      onClick={handleToggleSelect}
      className={`
        relative flex flex-col justify-between p-6 bg-white rounded-lg border 
        transition-all duration-300 h-full
        ${isSelectable ? 'cursor-pointer hover:border-gray-400' : ''}
        ${isSelected
          ? 'border-gray-900 bg-stone-50 shadow-md ring-1 ring-gray-900/5' 
          : 'border-gray-200/80'
        }
      `}
    >
      {/* Selection Checkmark - Top Right Corner */}
      {isSelectable && (
        <div className={`absolute top-3 right-3 flex items-center justify-center h-6 w-6 rounded-full border-2 
          ${isSelected ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'}`}
        >
          {isSelected && <Check className="h-4 w-4" />}
        </div>
      )}

      {/* Action Menu (Edit/Delete) */}
      <div className="absolute top-4 right-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
              className={`h-8 w-8 rounded-full ${
                isSelected ? 'text-gray-700 hover:bg-stone-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onSelect={(e) => onActionSelect(e, handleEditAddress)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={(e) => onActionSelect(e, handleDeleteAddress)} 
              className="text-red-600 focus:bg-red-50"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Address Information */}
      <div className="space-y-2 pr-8">
        <div className="space-y-1">
          <p className="font-semibold text-gray-800">{addressInfo?.address}</p>
          <p className="text-gray-600">
            {addressInfo?.city && `${addressInfo.city}, `}{addressInfo?.state}
          </p>
          <p className="text-gray-600">
            {addressInfo?.country} - {addressInfo?.pincode}
          </p>
        </div>
        
        <p className="pt-2 text-sm text-gray-600">
          <span className="text-gray-500">Phone:</span> {addressInfo?.phone}
        </p>
      </div>

      {/* Notes and Gift Information Section */}
      {(addressInfo?.isGift || (addressInfo?.notes && addressInfo.notes.trim() !== "")) && (
        <div className="mt-4 pt-4 border-t border-gray-200/80 space-y-3 text-sm">
          {addressInfo?.isGift && (
            <div className="flex items-start gap-3 text-gray-700">
              <Gift className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">This is a gift delivery.</span>
                {addressInfo?.giftMessage && (
                  <p className="text-gray-500 italic">"{addressInfo.giftMessage}"</p>
                )}
              </div>
            </div>
          )}
          {addressInfo?.notes && addressInfo.notes.trim() !== "" && (
            <div className="flex items-start gap-3 text-gray-700">
              <StickyNote className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Notes for delivery:</span>
                <p className="text-gray-500">{addressInfo.notes}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default AddressCard;