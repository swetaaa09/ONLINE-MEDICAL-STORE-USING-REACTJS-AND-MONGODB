import "../styles/ProductScreen.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Actions
import { getProductDetails } from "../redux/actions/productActions";
import { addToCart } from "../redux/actions/cartActions";

const ProductScreen = ({ match, history }) => {
  const productId = match.params.id;
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.getProductDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    if (!product || productId !== product._id) {
      dispatch(getProductDetails(productId));
    }
  }, [dispatch, productId, product]);

  const addToCartHandler = () => {
    dispatch(addToCart(product._id, qty));
    history.push("/cart");
  };

  return (
    <div className="productscreen">
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : (
        <>
          <div className="productscreen__left">
            <div className="left__image">
              <img src={product.imgsrc} alt={product.title} />
            </div>
            <div className="left__info">
              <p className="left__name">{product.title}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>Indication:</strong> {product.indication}</p>
              <p><strong>Dosage:</strong> {product.dosage}</p>
              <p><strong>Side Effects:</strong> {product.sideEffects}</p>
            </div>
          </div>
          <div className="productscreen__right">
            <div className="right__info">
              <p>
                Price: <span>₹{product.price}</span>
              </p>
              <p>
                Status:{" "}
                <span>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</span>
              </p>
              {product.countInStock > 0 && (
                <p>
                  Qty:
                  <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </p>
              )}
              <p>
                <button type="button" onClick={addToCartHandler}>
                  Add To Cart
                </button>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
