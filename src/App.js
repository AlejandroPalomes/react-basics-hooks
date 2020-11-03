import React, { useState, useEffect } from "react";

import "./App.scss";

import ProductCard from "./components/ProductCard";

// Render the products dinamically with a loop
import products from "./products";
import Cart from "./components/Cart";

function loadItems() {
  const items = localStorage.getItem("products");

  if (items) {
    try {
      return JSON.parse(items);
    } catch (error) {
      return [];
    }
  } else {
    return [];
  }
}

const App = props=>{

  const [cartItems, setCartItems] = useState([])

  //Mounted
  useEffect(()=>{
    setCartItems(loadItems)
  }, [])

  //Update
  useEffect(()=>{
    localStorage.setItem("products", JSON.stringify(cartItems));
  }, [cartItems])

  const handleAddToCart = (id) => {
    let index = cartItems.findIndex((item) => item.id === id);

    if (index !== -1) {
      const items = cartItems.map((item) => {
        if (item.id === id && item.quantity < 10) {
          item.quantity = Number(item.quantity) + 1;
        }

        return item;
      });

      setCartItems(loadItems);
    } else {
      setCartItems((prevState) => ([
          ...cartItems,
          {
            ...products.find((prod) => prod.id === id),
            quantity: 1,
          },
        ]
      ));
    }
  }

  const handleRemove = (id) => {
    const items = cartItems.filter((item) => item.id !== id);
    setCartItems(items);
  }

  const handleChange = (event, id) => {
    const items = cartItems.map((item) => {
      if (item.id === id) {
        item.quantity = Number(event.target.value);
      }
      return item;
    });
    setCartItems(items)
  }

  //Render
  return (
    <main className="container-fluid">
      <div className="row">
        <div className="col col-6 col-lg-8 p-4">
          <section className="row row-cols-1">
            <div className="col">
              <h1 className="mb-4">Shop</h1>
            </div>
            <div className="col">
              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    img={product.img}
                    title={product.title}
                    price={product.price}
                    handleAddToCart={() => handleAddToCart(product.id)}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
        <Cart
          cartItems={cartItems}
          handleRemove={handleRemove}
          handleChange={handleChange}
        />
      </div>
    </main>
  );
}

export default App;
