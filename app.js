import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [cartCount, setCartCount] = useState(0);

  const products = [
    {
      id: 1,
      name: "Premium Handbag",
      price: 4999,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    },
    {
      id: 2,
      name: "Elegant Watch",
      price: 6999,
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
    },
    {
      id: 3,
      name: "Classic Shoes",
      price: 5999,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    },
    {
      id: 4,
      name: "Luxury Sunglasses",
      price: 3499,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    },
  ];

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div>
      {/* TOP BAR */}
      <div className="bg-dark text-white text-center py-2 small">
        Free Shipping on Orders Over Rs. 5,000
      </div>

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold fs-3" href="#">
            VELORA<span className="text-danger">.</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Home
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#products">
                  Shop
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#categories">
                  Categories
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-outline-dark rounded-circle">
                ♡
              </button>

              <button className="btn btn-dark position-relative">
                🛒
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section>
        <div
          id="heroCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="0"
              className="active"
            ></button>

            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="1"
            ></button>

            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="2"
            ></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600"
                className="d-block w-100"
                style={{ height: "650px", objectFit: "cover" }}
                alt="Fashion"
              />

              <div className="carousel-caption text-start">
                <h1 className="display-2 fw-bold">New Collection</h1>
                <p className="fs-5">
                  Discover premium fashion made for your lifestyle.
                </p>
                <a href="#products" className="btn btn-light btn-lg px-4">
                  Shop Now
                </a>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600"
                className="d-block w-100"
                style={{ height: "650px", objectFit: "cover" }}
                alt="Collection"
              />

              <div className="carousel-caption">
                <h1 className="display-2 fw-bold">Luxury Style</h1>
                <p className="fs-5">
                  Elegant pieces designed for unforgettable moments.
                </p>
                <a href="#products" className="btn btn-dark btn-lg px-4">
                  Explore Collection
                </a>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600"
                className="d-block w-100"
                style={{ height: "650px", objectFit: "cover" }}
                alt="Shopping"
              />

              <div className="carousel-caption text-end">
                <h1 className="display-2 fw-bold">Special Sale</h1>
                <p className="fs-5">Up to 40% off selected products.</p>
                <a href="#products" className="btn btn-danger btn-lg px-4">
                  Shop Sale
                </a>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Shop Categories</h2>
            <p className="text-muted">
              Explore our most popular collections
            </p>
          </div>

          <div className="row g-4">
            {[
              [
                "Women",
                "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700",
              ],
              [
                "Men",
                "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=700",
              ],
              [
                "Accessories",
                "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=700",
              ],
            ].map(([name, image]) => (
              <div className="col-md-4" key={name}>
                <div className="card border-0 shadow-sm overflow-hidden">
                  <img
                    src={image}
                    className="card-img"
                    style={{ height: "350px", objectFit: "cover" }}
                    alt={name}
                  />

                  <div className="card-img-overlay d-flex align-items-end">
                    <div className="bg-white p-3 w-100">
                      <h4 className="mb-1">{name}</h4>
                      <a href="#products" className="text-dark">
                        Shop Collection →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Featured Products</h2>
            <p className="text-muted">
              Carefully selected products for you
            </p>
          </div>

          <div className="row g-4">
            {products.map((product) => (
              <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <img
                    src={product.image}
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover" }}
                    alt={product.name}
                  />

                  <div className="card-body">
                    <h5 className="fw-bold">{product.name}</h5>

                    <p className="text-muted mb-3">
                      Rs. {product.price.toLocaleString()}
                    </p>

                    <button
                      className="btn btn-dark w-100"
                      onClick={addToCart}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section className="py-5">
        <div className="container">
          <div className="bg-dark text-white rounded-4 p-5 text-center">
            <h2 className="display-5 fw-bold">Special Summer Sale</h2>
            <p className="lead">
              Get up to <strong>40% OFF</strong> selected products.
            </p>

            <button
              className="btn btn-light btn-lg px-5"
              onClick={() => alert("Sale products are coming soon!")}
            >
              Shop Sale
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-3">Why VELORA?</h2>

          <p className="lead text-muted mx-auto" style={{ maxWidth: "750px" }}>
            We bring together modern fashion, premium quality and timeless
            design to create an effortless shopping experience.
          </p>

          <div className="row g-4 mt-4">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm">
                <h3>🚚</h3>
                <h5>Fast Delivery</h5>
                <p className="text-muted mb-0">
                  Quick and reliable delivery to your doorstep.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm">
                <h3>💎</h3>
                <h5>Premium Quality</h5>
                <p className="text-muted mb-0">
                  High-quality products selected for you.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm">
                <h3>🔒</h3>
                <h5>Secure Shopping</h5>
                <p className="text-muted mb-0">
                  Safe and secure shopping experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="fw-bold">Join Our Newsletter</h2>

            <p className="text-muted">
              Get updates about new products and exclusive offers.
            </p>

            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                  />

                  <button
                    className="btn btn-dark px-4"
                    onClick={() =>
                      alert("Thank you for subscribing!")
                    }
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h3 className="fw-bold">
                VELORA<span className="text-danger">.</span>
              </h3>

              <p className="text-secondary">
                Modern fashion. Timeless style. Premium quality.
              </p>
            </div>

            <div className="col-md-4">
              <h5>Quick Links</h5>

              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-secondary text-decoration-none">
                    Home
                  </a>
                </li>

                <li className="mb-2">
                  <a
                    href="#products"
                    className="text-secondary text-decoration-none"
                  >
                    Shop
                  </a>
                </li>

                <li className="mb-2">
                  <a
                    href="#about"
                    className="text-secondary text-decoration-none"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-4">
              <h5>Contact</h5>

              <p className="text-secondary mb-1">
                Email: hello@velora.com
              </p>

              <p className="text-secondary">Phone: +92 300 1234567</p>
            </div>
          </div>

          <hr />

          <div className="text-center text-secondary">
            © 2026 VELORA. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;