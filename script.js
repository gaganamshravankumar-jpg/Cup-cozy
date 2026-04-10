// Get table number from URL
const urlParams = new URLSearchParams(window.location.search);
const tableNumber = (urlParams.get('table') || 'Unknown').replace(/[^a-zA-Z0-9]/g, '');

// Scroll to menu
function scrollToMenu() {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// ---------------- CATEGORY SYSTEM ----------------

// Show items of selected category
function showItems(category) {
  document.querySelector('.menu-categories').style.display = 'none';

  const itemsContainer = document.querySelector('.menu-items');
  itemsContainer.style.display = 'grid';

  const items = itemsContainer.querySelectorAll('.card');

  items.forEach(item => {
    item.style.display = item.classList.contains(category) ? 'block' : 'none';
  });

  itemsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Back to categories
function backToCategories() {
  document.querySelector('.menu-categories').style.display = 'grid';

  const itemsContainer = document.querySelector('.menu-items');
  itemsContainer.style.display = 'none';

  itemsContainer.querySelectorAll('.card').forEach(item => {
    item.style.display = 'none';
  });

  document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
}

// ---------------- CART ----------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartUI();
  showToast();
}

function increaseQty(index) {
  cart[index].qty += 1;
  updateCartUI();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const cartItemsDiv = document.getElementById('cartItems');
  cartItemsDiv.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement('div');
    div.classList.add('cart-item');

    div.innerHTML = `
      <span>${item.name}</span>
      <div>
        <button onclick="decreaseQty(${index})">➖</button>
        <span>${item.qty}</span>
        <button onclick="increaseQty(${index})">➕</button>
      </div>
      <span>₹${item.price * item.qty}</span>
      <button onclick="removeFromCart(${index})">❌</button>
    `;

    cartItemsDiv.appendChild(div);
  });

  document.getElementById('total').innerText = total;

  saveCart();
}

// ---------------- WHATSAPP ORDER ----------------
function sendWhatsAppOrder() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  let message = "Table: " + tableNumber + "\n\n";

  cart.forEach(item => {
    message += `${item.name} x${item.qty} - ₹${item.price * item.qty}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  message += `\nTotal: ₹${total}`;

  const whatsappNumber = "917036862981";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

  // Clear cart after order
  cart = [];
  updateCartUI();
}

// ---------------- TOAST ----------------
function showToast() {
  const toast = document.getElementById("toast");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// ---------------- INIT ----------------
window.onload = function () {
  updateCartUI();
};