import React, { useState } from "react";
import "./App.css";

const initialProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Perfume ${i + 1}`,
  description: `This is a premium fragrance, product ${i + 1}`,
  price: (20 + i * 2).toFixed(2),
  image: `https://picsum.photos/200?random=${i + 1}`,
}));

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Cart functions
  const addToCart = (product) => {
    setCart([...cart, product]);
    setShowCartModal(true);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((_, i) => i !== id));
  };

  // Checkout
  const handleOrder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const order = {
      id: Date.now(),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      items: [...cart],
    };
    setOrders([...orders, order]);
    setCart([]);
    e.target.reset();
    alert("✅ Order placed successfully!");
    setShowCartModal(false);
  };

  // Admin login/logout
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAdmin(true);
      setShowLoginModal(false);
    } else {
      alert("❌ Wrong password!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPassword("");
  };

  // Admin product functions
  const handleSaveProduct = (product) => {
    const exists = products.find((p) => p.id === product.id);
    if (exists) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([{ ...product, id: Date.now() }, ...products]);
    }
    setEditing(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Filter products with search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <h2>Perfume Store</h2>

        {/* Hamburger toggle for mobile */}
        <button className="hamburger" onClick={() => setShowMenu(!showMenu)}>
          ☰
        </button>

        <div className={`nav-actions ${showMenu ? "active" : ""}`}>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search perfumes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={() => setShowCartModal(true)}>
            Cart ({cart.length})
          </button>

          {!isAdmin ? (
            <button onClick={() => setShowLoginModal(true)}>Login</button>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>

      {/* Products */}
      <div className="products">
        {filteredProducts.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowCartModal(false)}>
              &times;
            </span>
            <h3>Your Cart</h3>
            {cart.length === 0 ? (
              <p>Cart is empty.</p>
            ) : (
              <>
                {cart.map((item, i) => (
                  <div key={i} className="cart-item">
                    {item.name} - ${item.price}
                    <button onClick={() => removeFromCart(i)}>Remove</button>
                  </div>
                ))}
                <form onSubmit={handleOrder}>
                  <input name="name" placeholder="Full Name" required />
                  <input
                    name="email"
                    placeholder="Email"
                    type="email"
                    required
                  />
                  <input name="phone" placeholder="Phone Number" required />
                  <input name="address" placeholder="Address" required />
                  <input name="city" placeholder="City" required />
                  <button type="submit">Place Order</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowLoginModal(false)}>
              &times;
            </span>
            <h3>Admin Login</h3>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          <button
            onClick={() =>
              setEditing({
                id: Date.now(),
                name: "",
                description: "",
                price: 0,
                image: "",
              })
            }
          >
            Add Product
          </button>

          {editing && (
            <ProductForm
              product={editing}
              onSave={handleSaveProduct}
              onCancel={() => setEditing(null)}
            />
          )}

          <h3>Products</h3>
          {products.map((p) => (
            <div key={p.id} className="admin-row">
              <span>{p.name}</span>
              <button onClick={() => setEditing(p)}>Edit</button>
              <button onClick={() => handleDeleteProduct(p.id)}>Delete</button>
            </div>
          ))}

          <h3>Orders</h3>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.name}</td>
                    <td>{o.email}</td>
                    <td>{o.phone}</td>
                    <td>{o.address}</td>
                    <td>{o.city}</td>
                    <td>{o.items.map((i) => i.name).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Perfume Store | Built with React</p>
      </footer>
    </div>
  );
}

// Product Form for Admin
function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState(product);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="product-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        name="image"
        value={form.image}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default App;
