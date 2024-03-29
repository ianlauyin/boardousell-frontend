import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider, Drawer } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { item } from "../../type";

type props = {
  open: boolean;
  setDrawer: Function;
  cart: item[];
  handleDeleteItem: Function;
  startAnime: boolean;
  setAnime: Function;
};

export default function ShoppingCart({
  open,
  setDrawer,
  cart,
  handleDeleteItem,
  startAnime,
  setAnime,
}: props): JSX.Element {
  const navi = useNavigate();

  const handleGoProduct = async (productId: number) => {
    setDrawer(null);
    navi(`product/${productId}`);
  };
  const handleCheckout = async () => {
    setDrawer(null);
    navi(`checkout`);
  };
  const cartDisplay = cart.map((item: item, i: number) => {
    return (
      <tr
        className={
          i % 2 === 0
            ? "bg-primary text-base-300"
            : "bg-secondary text-secondary-content"
        }
        key={item.id}
      >
        <td>
          <button
            className="m-1 btn btn-sm btn-square"
            onClick={() => handleDeleteItem(item.id, "cart")}
          >
            <DeleteIcon />
          </button>
        </td>
        <td>
          <button
            className="btn btn-ghost flex flex-col items-start"
            onClick={() => handleGoProduct(item.product.id)}
          >
            {item.product.name}
            <p className="text-xs">stock: {item.product.stock}</p>
          </button>
        </td>
        <td>
          $
          {item.product.onsale
            ? Math.round(item.product.price * item.product.onsale.discount)
            : item.product.price}
        </td>
      </tr>
    );
  });

  let totalAmount = 0;
  cart.forEach(
    (item) =>
      (totalAmount += item.product.onsale
        ? Math.round(item.product.price * item.product.onsale.discount)
        : item.product.price)
  );
  return (
    <div>
      <div
        className={`fixed bottom-5 right-5 z-10 ${
          startAnime && "add-item-animation"
        }`}
        onAnimationEnd={() => setAnime(null)}
      >
        <div className="indicator">
          <div className="tooltip" data-tip="Shopping Cart">
            {!!cart.length && (
              <span className="indicator-item badge badge-primary">
                {cart.length}
              </span>
            )}
            <button
              className="btn btn-secondary border-neutral ring-1 rounded-3xl"
              onClick={() => setDrawer("cart")}
            >
              <ShoppingCartIcon />
            </button>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={open} onClose={() => setDrawer(null)}>
        <div className="flex flex-col bg-neutral-content min-h-screen w-96 max-w-full-screen">
          <div className="h-20 flex justify-evenly items-center">
            <h1 className="text-3xl">Shopping Cart</h1>
            <button className="absolute left-5" onClick={() => setDrawer(null)}>
              <ArrowBackIcon />
            </button>
          </div>
          <Divider className="bg-primary" />
          <div className="bg-base-100 w-5/6 h-4/6 my-10 self-center overflow-y-scroll">
            <table className="w-full">
              <tbody>{cartDisplay}</tbody>
            </table>
          </div>
          <div className="flex flex-col w-4/5 self-center mb-5">
            <h2 className="self-end text-xl">Total Amount: ${totalAmount}</h2>
            <button className="btn btn-accent mt-2" onClick={handleCheckout}>
              <h2 className="text-xl">Checkout</h2>
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
