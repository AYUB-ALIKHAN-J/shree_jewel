import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formatPriceWithTax } from "@/lib/utils";
import debounce from "lodash.debounce";


function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}


function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const prevFiltersRef = useRef({});
  const prevSortRef = useRef(null);

  useEffect(() => {
    setSort("price-lowtohigh");

    const categorySearchParam = searchParams.get("category");
    const subcategorySearchParam = searchParams.get("subcategory");
    const subcategory = subcategorySearchParam
      ? subcategorySearchParam.replace(/\+/g, " ").trim()
      : null;

    const categoryArray = categorySearchParam
      ? decodeURIComponent(categorySearchParam)
          .split(",")
          .map((cat) => cat.trim())
      : [];

    let initialFilters = {};

    if (categoryArray.length > 0) {
      initialFilters = { category: categoryArray };
    } else if (subcategory) {
      initialFilters = { subcategory: [subcategory] };
    } else {
      const storedFilters =
        JSON.parse(sessionStorage.getItem("filters")) || {};
      initialFilters = storedFilters;
    }

    setFilters(initialFilters);
    sessionStorage.setItem("filters", JSON.stringify(initialFilters));
  }, [searchParams]);

  const debouncedFetchProducts = useRef(
    debounce((filterParams, sortParams) => {
      dispatch(fetchAllFilteredProducts({ filterParams, sortParams }));
    }, 400)
  ).current;

  useEffect(() => {
    const filtersChanged =
      JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    const sortChanged = prevSortRef.current !== sort;

    if (filters && sort && (filtersChanged || sortChanged)) {
      debouncedFetchProducts(filters, sort);
      prevFiltersRef.current = filters;
      prevSortRef.current = sort;
    }
  }, [filters, sort, debouncedFetchProducts]);

  const updateURLFromFilters = useCallback(
    (newFilters) => {
      if (newFilters && Object.keys(newFilters).length > 0) {
        const createQueryString = createSearchParamsHelper(newFilters);
        setSearchParams(new URLSearchParams(createQueryString));
      } else {
        setSearchParams(new URLSearchParams());
      }
    },
    [setSearchParams]
  );

  function handleFilter(getSectionId, getCurrentOption, newFilters = null) {
    let cpyFilters = newFilters || { ...filters };

    if (newFilters) {
      setFilters(cpyFilters);
      sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
      updateURLFromFilters(cpyFilters);
      return;
    }

    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);

      if (cpyFilters[getSectionId].length === 0) {
        delete cpyFilters[getSectionId];
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    updateURLFromFilters(cpyFilters);
  }

  function handleSort(value) {
    setSort(value);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cartArray = cartItems?.items || [];
  const showMobileCartBar = isMobile && cartArray.length > 0;

  function MobileCartBar({ cartItems, onCheckout }) {
    const subtotal = cartItems.reduce(
      (sum, item) =>
        sum +
        formatPriceWithTax(
          (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity
        ).priceWithTax,
      0
    );

    const handleCheckout = () => {
      if (!user) {
        toast({
          title: "Please login to checkout",
          description: "You need to be logged in to complete your purchase",
          variant: "destructive",
        });
        navigate("/auth/login");
        return;
      }
      onCheckout();
    };

    return (
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-bold">Cart: {cartItems.length} item(s)</span>
        <span className="font-bold">₹{subtotal.toFixed(2)}</span>
        <Button size="sm" onClick={handleCheckout} className="ml-2">
          Checkout
        </Button>
      </div>
    );
  }

  return (
    <div className={`mt-16 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6 ${showMobileCartBar ? 'pb-24' : ''}`}>
      {/* The ProductFilter component now receives the isCartVisible prop */}
      <ProductFilter 
        filters={filters} 
        handleFilter={handleFilter} 
        isMobile={isMobile} 
        isCartVisible={showMobileCartBar}
      />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      {showMobileCartBar && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-lg mx-auto">
            <MobileCartBar
              cartItems={cartArray}
              onCheckout={() => navigate("/shop/checkout")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingListing;