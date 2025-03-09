import "./App.css"
import { useEffect, useState } from "react";



const Cart = () => {
    const [cart, setCart] = useState([]);
    const [item, setItem] = useState({  name: "", price: 0, quantity: 1 });

    useEffect(() => {
        fetch("http://localhost:3000/cart")
            .then(res => res.json())
            .then(data => setCart(data));
    }, []);

    const addToCart = () => {
        fetch("http://localhost:3000/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        })
        .then(res => res.json())
        .then(data => setCart([...cart, data]));
    };

    const updateQuantity = (id, quantity) => {
        fetch(`http://localhost:3000/cart/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity })
        })
        .then(res => res.json())
        .then(updatedItem => {
            setCart(cart.map(item => item._id === id ? updatedItem : item));
        });
    };

    const removeFromCart = (id) => {
        fetch(`http://localhost:3000/cart/${id}`, { method: "DELETE" })
        .then(() => setCart(cart.filter(item => item._id !== id)));
    };

    return (
       <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "10 auto"
        }}>
         <div >
            <h2>Shopping Cart</h2>
            <input type="text" placeholder="Food Name" onChange={e => setItem({...item, name: e.target.value})} />
            <input type="number" placeholder="Price" onChange={e => setItem({...item, price: e.target.value})} />
            <button onClick={addToCart}>Add to Cart</button>
            <ul>
                {cart.map(item => (
                    <li key={item._id}  style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px", 
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                      }}>
                        {item.name} - ${item.price} 
                        
                          <div className="quantity-controls">
      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
      <span>{item.quantity}</span>
      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>

    </div>
    <button onClick={() => removeFromCart(item._id)}>Remove</button>

                    </li>
                ))}
            </ul>
        </div>
       </div>
    );
};

export default Cart;
