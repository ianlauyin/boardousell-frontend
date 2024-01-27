import Navibar from "./Component/Sub-Component/Navibar";
import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Wishlist from "./Component/Sub-Component/Wishlist";
import ShoppingCart from "./Component/Sub-Component/ShoppingCart";
const BACKENDURL: string | undefined = process.env.REACT_APP_BACKEND;

type outletProps = {
  handleAddWishItem: Function;
};

type item = {
  id: number;
  product: {
    price: number;
    name: string;
    stocks: number;
  };
};
type drawer = "nav" | "wish" | "cart" | null;

export default function App() {
  const [userId, setUserId] = useState<number>(2);
  const [wishlist, setWishlist] = useState<item[]>([]);
  const [cart, setCart] = useState<item[]>([]);
  const [drawer, setDrawer] = useState<drawer>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wishlistRes = await axios.get(`${BACKENDURL}/wishlist/${userId}`);
        setWishlist(wishlistRes.data);
        const cartRes = await axios.get(`${BACKENDURL}/cart/${userId}`);
        setCart(cartRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);

  const handleAddWishItem = async (productId: number) => {
    try {
      const { data } = await axios.post(`${BACKENDURL}/wishlist`, {
        userId: userId,
        productId: productId,
      });
      setWishlist((prev) => [...prev, data]);
      setDrawer("wish");
    } catch (error) {
      console.log(error);
    }
  };

  const outletProps: outletProps = {
    handleAddWishItem: handleAddWishItem,
  };
  return (
    <div data-theme="nord" className="min-h-screen">
      <Navibar open={drawer === "nav"} setDrawer={setDrawer} />
      <Outlet context={outletProps} />
      <Wishlist
        open={drawer === "wish"}
        setDrawer={setDrawer}
        wishlist={wishlist}
        setWishlist={setWishlist}
      />
      <ShoppingCart
        open={drawer === "cart"}
        setDrawer={setDrawer}
        cart={cart}
      />
      <footer className="footer p-5 pl-10 bg-neutral text-neutral-content h-min">
        <nav>
          <Link className="link link-hover" to="/aboutus">
            About us
          </Link>

          <Link className="link link-hover" to="/policy">
            Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
