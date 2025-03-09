const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:admin12345@cluster0.yaa50.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> console.log("connected DB"))
.catch((err) => console.log("not connected DB", err))

const CartItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
}, { timestamps: true });

const CartItem = mongoose.model('CartItem', CartItemSchema);

// Get all cart items
app.get('/cart', async (req, res) => {
    const cartItems = await CartItem.find();
    res.json(cartItems);
});

// Add item to cart
app.post('/cart', async (req, res) => {
    const { name, price, quantity } = req.body;
    const cartItem = new CartItem({ name, price, quantity });
    
    await cartItem.save();
    res.status(201).json(cartItem);
});

// Update cart item quantity
app.put('/cart/:id', async (req, res) => {
    const { quantity } = req.body;
    const cartItem = await CartItem.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    if (!cartItem) return res.status(404).send('Item not found');
    res.json(cartItem);
});

// Delete item from cart
app.delete('/cart/:id', async (req, res) => {
    await CartItem.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
