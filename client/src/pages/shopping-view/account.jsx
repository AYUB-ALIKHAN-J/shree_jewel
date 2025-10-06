import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg"; // Using a more appropriate high-end image
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { useSelector } from "react-redux";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Section 1: Personalized Welcome Header */}
      <div className="relative h-56">
        <img
          src={accImg}
          alt="Account Banner"
          className="h-full w-full object-cover object-center brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl sm:text-5xl font-serif tracking-wider">
            My Atelier
          </h1>
          <p className="mt-2 text-lg text-stone-300">
            Welcome back, {user?.name || 'customer'}.
          </p>
        </div>
      </div>

      {/* Section 2: Dashboard Layout with Navigation and Content */}
      <div className="container mx-auto max-w-screen-xl py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        {/* FIX: Added 'items-start' to the grid to prevent the navigation column from shifting vertically */}
        <Tabs defaultValue="orders" orientation="vertical" className="grid grid-cols-1 md:grid-cols-4 gap-x-12 items-start">
          
          {/* Left Column: Vertical Navigation */}
          <TabsList className="md:col-span-1 flex md:flex-col h-auto bg-transparent p-0 items-start">
            <TabsTrigger 
              value="orders" 
              className="w-full justify-start text-lg p-4 data-[state=active]:bg-stone-200/80 data-[state=active]:shadow-none data-[state=active]:text-gray-900 text-gray-500 rounded-md"
            >
              Order History
            </TabsTrigger>
            <TabsTrigger 
              value="address" 
              className="w-full justify-start text-lg p-4 data-[state=active]:bg-stone-200/80 data-[state=active]:shadow-none data-[state=active]:text-gray-900 text-gray-500 rounded-md"
            >
              Address Book
            </TabsTrigger>
          </TabsList>
          
          {/* Right Column: Content Area */}
          <div className="md:col-span-3 mt-8 md:mt-0">
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default ShoppingAccount;