import * as actionTypes from "../constants/cartConstants";
import axios from "axios";

export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: actionTypes.ADD_TO_CART,
      payload: {
        product: data._id,
        title: data.title,
        imgsrc: data.imgsrc,
        price: data.price,
        countInStock: data.countInStock,
        qty,
      },
    });

    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
  } catch (error) {
    console.error("Failed to add to cart:", error.message);
    // You can also dispatch an error action here if needed
  }
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.REMOVE_FROM_CART,
    payload: id,
  });

  localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
};
