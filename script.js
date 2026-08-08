const products = [
  {
    id: 1,
    name: 'Royal Basmati',
    category: 'Basmati Rice',
    weight: '',
    pricePerkg: 150,
    price: 0,
    rating: 4.8,
    image: 'images/basmati.svg'
  },
  {
    id: 2,
    name: 'Golden Ponni',
    category: 'Ponni Rice',
    weight: '',
    pricePerkg: 120,
    price: 0,
    rating: 4.6,
    image: 'images/ponni.svg'
  },
  {
    id: 3,
    name: 'Classic Sona Masoori',
    category: 'Sona Masoori',
    weight: '',
    pricePerkg: 80,
    price: 0,
    rating: 4.7,
    image: 'images/sona.svg'
  },
  {
    id: 4,
    name: 'Aroma Seeraga Samba',
    category: 'Seeraga Samba',
    weight: '',
    pricePerkg: 160,
    price: 0,
    rating: 4.9,
    image: 'images/brown.svg'
  },
  {
    id: 5,
    name: 'Village Brown Rice',
    category: 'Brown Rice',
    weight: '',
    pricePerkg: 140,
    price: 0,
    rating: 4.5,
    image: 'images/brown.svg'
  },
  {
    id: 6,
    name: 'Organic Heritage Rice',
    category: 'Organic Rice',
    weight: '',
    pricePerkg: 185,
    price: 0,
    rating: 4.8,
    image: 'images/basmati.svg'
  },
  {
    id: 7,
    name: 'Silk Basmati Premium',
    category: 'Basmati Rice',
    weight: '',
    pricePerkg: 120,
    price: 0,
    rating: 4.7,
    image: 'images/basmati.svg'
  },
  {
    id: 8,
    name: 'Fresh Ponni Deluxe',
    category: 'Ponni Rice',
    weight: '',
    pricePerkg: 60,
    price: 0,
    rating: 4.4,
    image: 'images/ponni.svg'
  },
  {
    id: 9,
    name: 'Nutri Sona Masoori',
    category: 'Sona Masoori',
    weight: '',
    pricePerkg: 100,
    price: 0,
    rating: 4.6,
    image: 'images/sona.svg'
  },
  {
    id: 10,
    name: 'Pure Organic Brown',
    category: 'Organic Rice',
    weight: '',
    pricePerkg: 50,
    price: 0,
    rating: 4.8,
    image: 'images/brown.svg'
  }
];

let activeCategory = 'All';
let searchText = '';
let cart = JSON.parse(localStorage.getItem('mkgCart')) || [];

const productGrid = document.getElementById('productGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const summaryItems = document.getElementById('summaryItems');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTotal = document.getElementById('summaryTotal');
const checkoutForm = document.getElementById('checkoutForm');
const formMessage = document.getElementById('formMessage');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function renderProducts() {
  let filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!filteredProducts.length) {
    productGrid.innerHTML = '<p>No products match your search.</p>';
    return;
  }

  productGrid.innerHTML = filteredProducts.map((product) => {
    return `
      <article class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="product-info">
          <div class="meta">
            <span>${product.category}</span>
            <span>⭐ ${product.rating}</span>
          </div>
          <h3>${product.name}</h3>
          <p>Weight: <input class="weight-input" data-id="${product.id}" type="number" value="${product.weight}" placeholder="(in kg)" /></p>
          <div class="price-row">
            <span class="original">Per kg: ₹${product.pricePerkg}</span>
            <span class="offer" data-id="${product.id}"> ₹${product.price}</span>
          </div>
          <div class="product-actions">
            <button class="add-btn" data-id="${product.id}">Add to Cart</button>
            <button class="buy-btn">Buy Now</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function saveCart() {
  localStorage.setItem('mkgCart', JSON.stringify(cart));
}

function updateCartUI() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = itemCount;

  const subtotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
  const delivery = cart.length ? 40 : 0;
  const total = subtotal + delivery;

  summaryItems.textContent = itemCount;
  summarySubtotal.textContent = `₹${subtotal}`;
  summaryTotal.textContent = `₹${total}`;

  if (!cart.length) {
    cartItems.innerHTML = '<p>Your cart is empty. Add a few grains to begin.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <p>${item.weight} · ₹${item.price}</p>
        <div class="qty-controls">
          <button data-action="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button data-action="increase" data-id="${item.id}">+</button>
        </div>
      </div>
      <div>
        <p>₹${item.quantity * item.price}</p>
        <button class="buy-btn" data-action="remove" data-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join('');
}

function addToCart(productId) {
  const product = products.find((item) => item.id === Number(productId));
  if (!product) return;

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  if (product.weight === '' || product.weight <= 0) {
    alert('Please enter a valid weight before adding to cart.');
    return;
  }
  saveCart();
  updateCartUI();
}

function changeQuantity(productId, action) {
  const existing = cart.find((item) => item.id === Number(productId));
  if (!existing) return;

  if (action === 'increase') {
    existing.quantity += 1;
  } else if (action === 'decrease') {
    existing.quantity -= 1;
  } else if (action === 'remove') {
    cart = cart.filter((item) => item.id !== Number(productId));
    saveCart();
    updateCartUI();
    return;
  }

  if (existing.quantity <= 0) {
    cart = cart.filter((item) => item.id !== Number(productId));
  }

  saveCart();
  updateCartUI();
}

function validateCheckout(event) {
  event.preventDefault();
  const fields = ['fullName', 'phone', 'email', 'address', 'city', 'state', 'pin'];
  let valid = true;

  fields.forEach((id) => {
    const input = document.getElementById(id);
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = '#c95555';
    } else {
      input.style.borderColor = '#e7e0d0';
    }
  });

  const emailInput = document.getElementById('email');
  const emailPattern = /.+@.+\..+/;
  if (!emailPattern.test(emailInput.value)) {
    valid = false;
    emailInput.style.borderColor = '#c95555';
  }

  if (!valid) {
    formMessage.textContent = 'Please fill in all checkout details correctly.';
    return;
  }

  formMessage.textContent = 'Thank you! Your order request has been received.';
  checkoutForm.reset();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    activeCategory = button.dataset.category;
    renderProducts();
  });
});
productGrid.addEventListener('input', (event) => {
  if (event.target.classList.contains('weight-input')) {
    const productId = Number(event.target.dataset.id);
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const weight = parseFloat(event.target.value);
    product.weight = weight;
    if (isNaN(weight) || weight <= 0) {
      product.price = 0;
    }else {
      product.price = weight * product.pricePerkg;
    }
    const priceSpan = document.querySelector(`.offer[data-id="${productId}"]`);
    if (priceSpan) {
      priceSpan.textContent = `₹${product.price}`;
    }
  }
});
searchInput.addEventListener('input', (event) => {
  searchText = event.target.value;
  renderProducts();
});

productGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (button) {
    addToCart(button.dataset.id);
  }
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  changeQuantity(button.dataset.id, button.dataset.action);
});

checkoutForm.addEventListener('submit', validateCheckout);

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
});

renderProducts();
updateCartUI();
