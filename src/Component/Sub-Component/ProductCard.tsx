import StarsIcon from "@mui/icons-material/Stars";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import noImage from "../img/no-image.jpg";
type props = {
  handleAddWishItem: Function;
  product: {
    id: number;
    price: number;
    name: string;
    stocks: number;
    productPhotos: [
      {
        url?: string;
      }
    ];
  } | null;
};

//Need to add wishlist function
//Need to add shopping Cart function
export default function ProductCard({ product, handleAddWishItem }: props) {
  return !product ? null : (
    <div className="card w-44 mt-3 bg-secondary shadow-xl">
      <img
        className="m-1 h-32 object-contain"
        src={
          product.productPhotos.length ? product.productPhotos[0].url : noImage
        }
        alt={product.name}
      />
      <div className="card-body p-1">
        <h2 className="card-title ">{product.name}</h2>
        <div className="flex">
          <p>HKD${product.price}</p>
          <p>Stocks: {product.stocks}</p>
        </div>
      </div>
      <div className="card-actions flex justify-end mb-1 mr-1">
        <button
          className="btn w-11 h-11"
          onClick={() => handleAddWishItem(product.id)}
        >
          <StarsIcon />
        </button>
        <button className="btn w-11 h-11" disabled={!product.stocks}>
          <ShoppingCartIcon />
        </button>
      </div>
    </div>
  );
}
