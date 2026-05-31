import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";

function Header() {
    const user = useSelector((state) => state.auth.user);
    const authStatus = useSelector((state) => state.auth.status);
    const totalItems = useSelector((state) => state.cart.totalItems);

    return (
        <header className="bg-white shadow-md">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link to="/products">
                    <img
                        src="/ecommerce-commerce-and-shopping-svgrepo-com.svg"
                        alt="company logo"
                        className="h-10 w-10"
                    />
                </Link>

                {authStatus ? (
                    <div className="flex items-center gap-6">
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative flex items-center"
                        >
                            <img
                                src="/cartIcon.svg"
                                alt="cart icon"
                                className="h-8 w-8"
                            />

                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        </Link>

                        {/* User */}
                        <p className="font-medium text-gray-700">
                            {user?.username || user}
                        </p>

                        <LogoutBtn />
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-gray-700 hover:text-black"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Signup
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;