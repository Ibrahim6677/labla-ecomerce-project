import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartModel from "../pages/shop/CartModel";
import { useState } from "react";
import avatarImg from "../assets/avatar.png"
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { logout } from "../redux/features/auth/authSlice";

const Navbar = () => {
  const products = useSelector((state) => state.cart.products);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  // show user if logged in
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();
  
  // dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  // admin dropdown menu
  const adminDropDownMenu = [
    {label: "Dashboard", link: "/admin/dashboard"},
    {label: "Manage Items", link: "/admin/manage-products"},
    {label: "All Orders", link: "/admin/manage-orders"},
    {label: "Add New Post", link: "/admin/add-new-post"},
  ]

  // user dropdown menu
  const userDropDownMenu = [
    {label: "Dashboard", link: "/admin/dashboard"},
    {label: "Profile", link: "/admin/profile"},
    {label: "Payments", link: "/admin/payments"},
    {label: "Orders", link: "/admin/orders"},
  ]

  const dropdownMenus = user?.role == 'admin' ? [...adminDropDownMenu] : [...userDropDownMenu];
  
  // handle logout
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error("Failed to logout", error);
    }
  }

  return (
    <header className="fixed-nav-bar w-nav">
      <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center">
        <ul className="nav__links">
          <li className="link">
            <Link to="/">Home</Link>
          </li>
          <li className="link">
            <Link to="/shop">Shop</Link>
          </li>
          <li className="link">
            <Link to="/pages">Pages</Link>
          </li>
          <li className="link">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

        {/* Logo */}
        <div className="nav__logo">
          <Link to="/">
            Lebaba<span>.</span>
          </Link>
        </div>

        {/* nav icons */}
        <div className="nav__icons relative">
          <span>
            <Link to="/search">
              <i className="ri-search-line"></i>
              <i></i>
            </Link>
          </span>
          <span>
            <button onClick={handleCartToggle} className="hover:text-primary">
              <i className="ri-shopping-bag-line"></i>
              <sup className="text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center">
                {products.length}
              </sup>
            </button>
          </span>
          <span>
            {
              user ? (<>
                <img
                  onClick={handleDropdown}
                  src={user?.profileImage || avatarImg} alt="" className="size-6
              rounded-full cursor-pointer"/>
                {
                  isDropdownOpen && (
                    <div className="absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-lg
                    shadow-lg z-50">
                      <ul className="font-medium space-y-4 p-2">
                        {dropdownMenus.map((menu, index) => (
                      <li key={index}>
                        <Link
                          onClick={() => setIsDropdownOpen(false)}
                          className="dropdown-items" to={menu.link}>{menu.label}</Link>
                      </li>
                        ))}
                        <li><Link className="dropdown-items" onClick={handleLogout}>Logout</Link></li>
                      </ul>
                  </div>)
                }
              </>) : (
                <Link to='/login'>
                  <i className="ri-user-line"></i>
                </Link>
              )
            }
          </span>
        </div>
      </nav>

      {/* Cart */}
      {
        isCartOpen && <CartModel products={products} isOpen={isCartOpen}
          onClose={handleCartToggle} />
      }
    </header>
  );
};

export default Navbar;
