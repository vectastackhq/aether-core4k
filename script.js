let cart = [];
let total = 0;

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
}

function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    let cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = '';
    cart.forEach(item => {
        let li = document.createElement('li');
        li.innerText = `${item.name} - $${item.price.toFixed(2)}`;
        cartItemsList.appendChild(li);
    });
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    let message = "Hi! I'd like to order: \n";
    cart.forEach(item => {
        message += `- ${item.name}: $${item.price.toFixed(2)}\n`;
    });
    message += `Total: $${total.toFixed(2)}`;
    let whatsappURL = `https://wa.me/923000000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}
