* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
}

:root {
    --primary-honey: #d49b04;
    --dark-honey: #a87600;
    --light-honey: #ffe596;
    --brown-text: #503100;
    --bg-color: #fffaf0;
    --white: #ffffff;
}

body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--bg-color);
    color: var(--brown-text);
    overflow-x: hidden;
}

.animation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--white);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeOut 1s ease-in-out 2.5s forwards;
}

.honey-drip {
    width: 100px;
    height: 150px;
    background: var(--primary-honey);
    border-radius: 0 0 50px 50px;
    animation: drop 1.5s ease-in-out infinite;
}

.welcome-text {
    margin-top: 2rem;
    text-align: center;
    font-size: 2rem;
    color: var(--dark-honey);
    opacity: 0;
    animation: fadeInText 1s ease-in-out 1s forwards;
}

@keyframes drop {
    0% { transform: scaleY(1); }
    50% { transform: scaleY(1.2); }
    100% { transform: scaleY(1); }
}

@keyframes fadeInText {
    to { opacity: 1; }
}

@keyframes fadeOut {
    to { visibility: hidden; opacity: 0; }
}

.navbar {
    background: var(--white);
    padding: 1.5rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 15px rgba(212, 155, 4, 0.15);
    position: sticky;
    top: 0;
    z-index: 100;
}

.logo {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--dark-honey);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: var(--brown-text);
    font-weight: 600;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: var(--dark-honey);
}

.cart-icon {
    position: relative;
    cursor: pointer;
    font-size: 1.5rem;
    color: var(--dark-honey);
}

#cart-count {
    position: absolute;
    top: -10px;
    right: -10px;
    background: var(--primary-honey);
    color: var(--white);
    border-radius: 50%;
    font-size: 0.8rem;
    padding: 2px 6px;
    font-weight: 700;
}

.store-container {
    display: flex;
    flex-direction: column;
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 3rem;
    width: 100%;
}

.product-card {
    background: var(--white);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(212, 155, 4, 0.1);
    transition: transform 0.3s ease;
    cursor: pointer;
}

.product-card:hover {
    transform: translateY(-10px);
}

.product-card img {
    width: 100%;
    height: 350px;
    object-fit: contain;
    background: var(--light-honey);
    padding: 1rem;
}

.product-info {
    padding: 2rem;
    text-align: center;
}

.product-info h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-honey);
}

.price {
    font-weight: 700;
    color: var(--primary-honey);
    margin-bottom: 1.5rem;
    display: block;
    font-size: 1.3rem;
}

.add-btn {
    background: var(--dark-honey);
    color: var(--white);
    border: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    width: 100%;
    transition: background 0.3s ease;
}

.add-btn:hover {
    background: var(--primary-honey);
}

.bundles-section {
    margin-top: 5rem;
    text-align: center;
}

.bundles-section h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: var(--dark-honey);
}

.bundle-card {
    background: var(--light-honey);
    border-radius: 20px;
    padding: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 25px rgba(212, 155, 4, 0.15);
    max-width: 800px;
    margin: 0 auto;
}

.bundle-info h3 {
    font-size: 1.8rem;
    color: var(--dark-honey);
    margin-bottom: 0.5rem;
}

.bundle-info p {
    font-size: 1.1rem;
    color: var(--brown-text);
    opacity: 0.9;
}

.bundle-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-honey);
    margin-top: 1rem !important;
}

.bundle-price span {
    color: var(--primary-honey);
}

.bundle-add-btn {
    background: var(--dark-honey);
    color: var(--white);
    border: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    transition: background 0.3s ease;
}

.bundle-add-btn:hover {
    background: var(--primary-honey);
}

.cart-drawer {
    width: 0;
    background: var(--white);
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    overflow-y: auto;
    box-shadow: -5px 0 25px rgba(0,0,0,0.1);
    transition: width 0.3s ease;
    padding: 0;
    z-index: 200;
    display: flex;
    flex-direction: column;
}

.cart-drawer.active {
    width: 400px;
    padding: 2.5rem;
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.cart-header h2 {
    color: var(--dark-honey);
}

.cart-header i {
    cursor: pointer;
    font-size: 1.5rem;
}

#cart-items {
    list-style: none;
    flex-grow: 1;
}

#cart-items li {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--light-honey);
    padding-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
}

.cart-total {
    border-top: 2px solid var(--primary-honey);
    padding-top: 1.5rem;
    text-align: center;
}

.cart-total p {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--dark-honey);
    margin-bottom: 1.5rem;
}

.checkout-btn {
    background: var(--dark-honey);
    color: var(--white);
    border: none;
    padding: 1.2rem 2rem;
    border-radius: 50px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    width: 100%;
    transition: background 0.3s ease;
}

.checkout-btn:hover {
    background: var(--primary-honey);
}

@media (max-width: 768px) {
    .navbar { padding: 1.5rem; }
    .store-container { padding: 1.5rem; }
    .bundle-card { flex-direction: column; text-align: center; gap: 2rem; }
}
