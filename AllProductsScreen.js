import React, { useEffect, useState } from 'react';
import Card from "../components/Card";

function AllProductsScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="homescreen">
      <div className="container text-center">
        <h1 className="mt-3">Products</h1>
        <hr className="w-25 mx-auto" />
      </div>

      <div className="homescreen__products">
        {products.map((val) => (
          <Card
            key={val._id}
            imgsrc={val.imgsrc}
            title={val.title}
            info={val.indication}
            link={`/product/${val._id}`}
            id={val._id}
          />
        ))}
      </div>
    </div>
  );
}

export default AllProductsScreen;
