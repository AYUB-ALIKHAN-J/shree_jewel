import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
  import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
  } from "react-router-dom";
  import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetDescription, 
    SheetTrigger 
  } from "../ui/sheet";
  import { Button } from "../ui/button";
  import { useDispatch, useSelector } from "react-redux";
  import { shoppingViewHeaderMenuItems } from "@/config";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu";
  import { Avatar, AvatarFallback } from "../ui/avatar";
  import { logoutUser } from "@/store/auth-slice";
  import UserCartWrapper from "./cart-wrapper";
  import { useEffect, useState, useRef } from "react";
  import { fetchCartItems } from "@/store/shop/cart-slice";
  import { Label } from "../ui/label";
  import logo from "@/assets/logo.png";
  import PropTypes from "prop-types";


  // --- MODIFIED COMPONENT ---
  function ProductDropdown({ setOpen }) {
    const [categories, setCategories] = useState([]);
    const [open, setOpenState] = useState(false);
    const timeoutRef = useRef(null);
    const navigate = useNavigate(); // Added useNavigate hook

    useEffect(() => {
      fetch("/api/common/categories")
        .then((res) => res.json())
        .then((data) => {
          const categoryList = Array.isArray(data) ? data : data.categories;
          setCategories(categoryList || []);
        })
        .catch((err) => {
          console.error("Error loading categories:", err);
          setCategories([]);
        });
    }, []);

    // Handle mouse enter/leave with delay
    const handleMouseEnter = () => {
      clearTimeout(timeoutRef.current);
      setOpenState(true);
    };
    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => setOpenState(false), 250);
    };

    // Handle click on a category in the dropdown
    const handleCategoryClick = (category) => {
      setOpen && setOpen(false);
      setOpenState(false);
      navigate(`/shop/listing?category=${category.name}`);
    };
    
    // Handle click on the main "Products" link
    const handleProductsLinkClick = () => {
      setOpenState(false); // Close dropdown if open
      navigate('/shop/listing'); // Navigate to the main listing page
    };

    const maxRowsPerColumn = 5;

    return (
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Added onClick handler to the span */}
        <span 
          className="text-sm font-medium cursor-pointer"
          onClick={handleProductsLinkClick}
        >
          Products
        </span>
        {open && (
          <div
            className="absolute left-0 bg-white text-black shadow-lg mt-2 rounded-md z-50 p-4 grid grid-flow-col auto-rows-min gap-x-8 gap-y-2"
            style={{ gridTemplateRows: `repeat(${maxRowsPerColumn}, auto)` }}
          >
            {categories.map((category) => (
              <div
                key={category._id}
                className="rounded-md px-3 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function MenuItems({ setOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    function handleNavigate(getCurrentMenuItem) {
      sessionStorage.removeItem("filters");
      const labelName = getCurrentMenuItem.label?.trim();
      const currentFilter =
        getCurrentMenuItem.id !== "home" &&
        getCurrentMenuItem.id !== "about" &&
        getCurrentMenuItem.id !== "search" &&
        getCurrentMenuItem.id !== "products"
          ? {
              category: [labelName],
            }
          : null;

      sessionStorage.setItem("filters", JSON.stringify(currentFilter));

      if (getCurrentMenuItem.id === "about") {
        navigate("/shop/about-us");
        if (setOpen) setOpen(false);
        return;
      }
      
      if (getCurrentMenuItem.id === "products") {
        navigate('/shop/listing');
        if (setOpen) setOpen(false);
        return;
      }

      if (location.pathname.includes("listing") && currentFilter !== null) {
        setSearchParams(
          new URLSearchParams(`?category=${labelName}`)
        );
      } else {
        navigate(getCurrentMenuItem.path);
      }
      if (setOpen) setOpen(false);
    }

    return (
      <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
        {shoppingViewHeaderMenuItems.map((menuItem) => {
          if (menuItem.id === "products") {
            if (setOpen) {
              return (
                 <Label
                  onClick={() => handleNavigate(menuItem)}
                  className="text-sm font-medium cursor-pointer"
                  key={menuItem.id}
                >
                  {menuItem.label}
                </Label>
              )
            } else {
              return <ProductDropdown key={menuItem.id} setOpen={setOpen} />;
            }
          }

          if (menuItem.icon) {
            const Icon = menuItem.icon;
            return (
              <button
                key={menuItem.id}
                onClick={() => handleNavigate(menuItem)}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search"
                type="button"
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          }
          return (
            <Label
              onClick={() => handleNavigate(menuItem)}
              className="text-sm font-medium cursor-pointer"
              key={menuItem.id}
            >
              {menuItem.label}
            </Label>
          );
        })}
      </nav>
    );
  }

  function HeaderRightContent({ setOpen }) {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleLogout() {
      dispatch(logoutUser());
    }

    function handleCartClick() {
      if (!isAuthenticated) {
        navigate("/auth/login");
        return;
      }
      setOpenCartSheet(true);
    }

    useEffect(() => {
      if (isAuthenticated && user?.id) {
        dispatch(fetchCartItems(user?.id));
      }
    }, [dispatch, isAuthenticated, user?.id]);

    return (
      <div className="flex lg:items-center lg:flex-row flex-col gap-4">
        {isAuthenticated ? (
          <>
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
              <Button
                onClick={handleCartClick}
                variant="outline"
                size="icon"
                className="relative"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
                  {cartItems?.items?.length || 0}
                </span>
                <span className="sr-only">User cart</span>
              </Button>
              <UserCartWrapper
                setOpenCartSheet={setOpenCartSheet}
                cartItems={
                  cartItems && cartItems.items && cartItems.items.length > 0
                    ? cartItems.items
                    : []
                }
                onCheckout={() => {
                  if (setOpen) setOpen(false);
                }}
              />
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="bg-black">
                  <AvatarFallback className="bg-black text-white font-extrabold">
                    {user?.userName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="w-56">
                <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { navigate("/shop/account"); if (setOpen) setOpen(false); }}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { handleLogout(); if (setOpen) setOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigate("/auth/login");
                if (setOpen) setOpen(false);
              }}
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => {
                navigate("/auth/register");
                if (setOpen) setOpen(false);
              }}
            >
              Register
            </Button>
          </div>
        )}
      </div>
    );
  }

  function ShoppingHeader() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [openSheet, setOpenSheet] = useState(false);
    const location = useLocation();

    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-background shadow border-b">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            to="/shop/home"
            className="flex items-center gap-2"
            onClick={e => {
              window.dispatchEvent(new CustomEvent("shopping-home-scroll", { detail: "home-scroll-up" }));
              }}
            >
              <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
          </Link>
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation menu for the website, including product categories, account access, and cart.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <MenuItems setOpen={setOpenSheet} />
                <HeaderRightContent setOpen={setOpenSheet} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="hidden lg:block">
            <MenuItems />
          </div>
          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        </div>
      </header>
    );
  }

  export default ShoppingHeader;

  // Prop types definitions
  MenuItems.propTypes = {
    setOpen: PropTypes.func,
  };
  HeaderRightContent.propTypes = {
    setOpen: PropTypes.func,
  };
  ProductDropdown.propTypes = {
    setOpen: PropTypes.func,
  };
