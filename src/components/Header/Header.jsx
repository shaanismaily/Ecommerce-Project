import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";

function Header() {
    const user = useSelector((state) => state.auth.user);
    const authStatus = useSelector((state) => state.auth.status);
    const totalItems = useSelector((state) => state.cart.totalItems);

    return (
        <header>
            <nav>
                <Link to="/products">
                    <img src="/cartIcon.svg" alt="company logo" />
                </Link>

                {authStatus ? (
                    <div>
                        <Link to="/cart">
                            <img src="/cartIcon.svg" alt="cart icon" />
                            <span>{totalItems}</span>
                        </Link>

                        <p>{user}</p>

                        <LogoutBtn />
                    </div>
                ) : (
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;