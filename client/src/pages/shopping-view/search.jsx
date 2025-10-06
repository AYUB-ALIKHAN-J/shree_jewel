import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).finally(() => setIsLoading(false));
      }, 800);
      return () => clearTimeout(timeout);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
      setIsLoading(false);
    }
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Please login to add items to cart",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const showEmpty = !isLoading && (!searchResults || searchResults.length === 0) && keyword.length > 3;

  return (
    <div className="mt-16 container mx-auto md:px-6 px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-full max-w-xl flex items-center relative">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-4 pl-12 pr-4 rounded-full shadow focus:ring-2 focus:ring-primary"
            placeholder="Search for products, categories, brands..."
            autoFocus
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" size={22} />
          )}
        </div>
        {keyword.length > 3 && !isLoading && (
          <div className="mt-3 text-gray-500 text-sm">
            Showing {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "<span className="font-semibold">{keyword}</span>"
          </div>
        )}
      </div>
      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-16">
          <img
            src="https://www.svgrepo.com/show/452213/search-not-found.svg"
            alt="No results"
            className="w-32 h-32 mb-4 opacity-80"
          />
          <h1 className="text-2xl font-bold mb-2">No results found</h1>
          <p className="text-gray-500">Try a different keyword or check your spelling.</p>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults && searchResults.length > 0 &&
          searchResults.map((productItem) => (
            <div
              key={productItem._id}
              className="transition-transform hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white"
            >
              <ShoppingProductTile
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            </div>
          ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
