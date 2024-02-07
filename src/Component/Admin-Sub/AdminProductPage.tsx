import { useEffect, useState } from "react";

import { CircularProgress, Pagination } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { BACKENDURL } from "../../constant";
import axios from "axios";
import ProductEditForm from "./ProductEditForm";

type key = "all" | "name" | "stocks" | "category";
type product = {
  id: number;
  price: number;
  name: string;
  description: string;
  stocks: number;
  productPhotos?: [{ id: number; url: string }];
  categories?: [{ id: number; name: string }];
  newproduct?: [{ id: number }];
  onsale?: [{ id: number; discount: number }];
};

type search = {
  type: key;
  input: string;
} | null;

export default function AdminProductPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<product[]>([]);
  const [type, setType] = useState<key>("name");
  const [searchInput, setSearchInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentSearch, setCurrentSearch] = useState<search>(null);
  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${BACKENDURL}/category/all`);
        setCategories(data);
        setSelectedCategory(data[0]);
        setIsLoading(false);
      } catch (error) {
        setErrMsg("Cannot Load all categories");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log(products);
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      switch (type) {
        case "all":
          const { data } = await axios.get(`${BACKENDURL}/product/admin/all/1`);
          setTotalPage(Math.ceil(data.count / 5));
          setProducts(data.data);
          break;
        default:
          throw new Error("No Search Found.");
      }
      setCurrentPage(1);
      setCurrentSearch({ type: type, input: searchInput });
      setIsLoading(false);
    } catch (error: any) {
      setErrMsg(error.message);
      setIsLoading(false);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    try {
      setIsLoading(true);
      switch (currentSearch?.type) {
        case "all":
          const { data } = await axios.get(
            `${BACKENDURL}/product/admin/all/${newPage}`
          );
          setProducts(data.data);
          break;
        default:
          throw new Error("Somethings wrong with the search page.");
      }
      setCurrentPage(newPage);
      setIsLoading(false);
    } catch (error: any) {
      setErrMsg(error.message);
      setIsLoading(false);
    }
  };

  const option = categories.map((category) => {
    return (
      <option value={category} key={category}>
        {category}
      </option>
    );
  });

  const productDisplay = products.map((product) => (
    <ProductEditForm
      product={product}
      categories={categories}
      key={product.id}
    />
  ));

  return (
    <div className="flex flex-col items-center">
      {!!errMsg.length && (
        <span className="text-error m-1 w-min-">{errMsg}</span>
      )}
      <div className="flex items-center justify-between w-full space-x-3">
        <span className="text-md">Products:</span>
        <select
          value={type}
          className="select select-sm select-bordered"
          onChange={(e) => setType(e.target.value as key)}
        >
          <option value="all">All</option>
          <option value="name">Name</option>
          <option value="stocks">Stocks</option>
          <option value="category">Category</option>
        </select>
        {(type === "stocks" || type === "name") && (
          <input
            className="input input-bordered input-sm w-full"
            value={searchInput}
            placeholder={type === "stocks" ? "Range:[Lower]-[Upper]" : ""}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        )}
        {type === "category" && (
          <select
            value={selectedCategory}
            className="select select-sm select-bordered"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {option}
          </select>
        )}

        <button className="btn btn-md btn-square" onClick={handleSearch}>
          <SearchRoundedIcon />
        </button>
      </div>
      <div className="w-5/6 flex flex-col items-center">
        {isLoading ? <CircularProgress /> : productDisplay}
        {!!totalPage && (
          <Pagination
            count={totalPage}
            page={currentPage}
            variant="outlined"
            shape="rounded"
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
}
