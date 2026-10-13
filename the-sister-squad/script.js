// The Sister Squad — navigation, photo gallery, cart and demo checkout.
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });
  document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));
}

// Gallery lightbox
const cards = [...document.querySelectorAll('.photo-card')];
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const counter = document.getElementById('lightboxCounter');
let activeIndex = 0;
function showPhoto(index) {
  if (!cards.length || !lightboxImage) return;
  activeIndex = (index + cards.length) % cards.length;
  lightboxImage.src = cards[activeIndex].dataset.full || cards[activeIndex].querySelector('img').src;
  lightboxImage.alt = cards[activeIndex].querySelector('img')?.alt || `The Sister Squad project photo ${activeIndex + 1}`;
  if (counter) counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
}
function openLightbox(index) {
  showPhoto(index);
  lightbox?.classList.add('open');
  lightbox?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
cards.forEach((card, index) => card.addEventListener('click', () => openLightbox(index)));
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev')?.addEventListener('click', () => showPhoto(activeIndex - 1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => showPhoto(activeIndex + 1));
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });

// Cart and checkout are front-end demonstration features. No real payment is taken.
const products = {
  floral: { id:'floral', name:'Floral Print Fabric', price:399, image:'images/photo-05.jpeg' },
  bluegreen: { id:'bluegreen', name:'Blue-Green Print', price:349, image:'images/photo-06.jpeg' },
  redtee: { id:'redtee', name:'Red Bloom Tee Design', price:599, image:'images/photo-07.jpeg' },
  checks: { id:'checks', name:'Crossline Check Print', price:299, image:'images/photo-08.jpeg' },
  checktee: { id:'checktee', name:'Crossline T-Shirt', price:699, image:'images/photo-09.jpeg' },
  swatches: { id:'swatches', name:'Colour Story Set', price:249, image:'images/photo-10.jpeg' }
};
const cart = {};
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartItemLabel = document.getElementById('cartItemLabel');
const cartSubtotal = document.getElementById('cartSubtotal');
const deliveryFee = document.getElementById('deliveryFee');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutForm = document.getElementById('checkoutForm');
const orderSuccess = document.getElementById('orderSuccess');
const money = amount => `₹${amount.toLocaleString('en-IN')}`;
const cartQuantity = () => Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
const subtotalAmount = () => Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
const deliveryAmount = () => subtotalAmount() > 0 ? (subtotalAmount() >= 999 ? 0 : 40) : 0;
const totalAmount = () => subtotalAmount() + deliveryAmount();

function addToCart(id) {
  const product = products[id];
  if (!product) return;
  if (cart[id]) cart[id].quantity += 1;
  else cart[id] = { ...product, quantity: 1 };
  renderCart();
  openCart();
}
function changeQuantity(id, change) {
  if (!cart[id]) return;
  cart[id].quantity += change;
  if (cart[id].quantity <= 0) delete cart[id];
  renderCart();
}
function removeItem(id) {
  delete cart[id];
  renderCart();
}
function renderCart() {
  const count = cartQuantity();
  if (cartCount) cartCount.textContent = count;
  if (cartItemLabel) cartItemLabel.textContent = `(${count})`;
  if (cartSubtotal) cartSubtotal.textContent = money(subtotalAmount());
  if (deliveryFee) deliveryFee.textContent = subtotalAmount() >= 999 ? 'FREE' : money(deliveryAmount());
  if (cartTotal) cartTotal.textContent = money(totalAmount());
  if (checkoutTotal) checkoutTotal.textContent = money(totalAmount());
  if (checkoutButton) checkoutButton.disabled = count === 0;

  if (!count) {
    cartItems.innerHTML = `<div class="empty-cart"><span>♡</span><h3>Your bag is waiting</h3><p>Add a design you love and it will appear here.</p><button class="button button-dark" id="continueShopping" type="button">Explore designs ↗</button></div>`;
    document.getElementById('continueShopping')?.addEventListener('click', closeCart);
    return;
  }
  cartItems.innerHTML = Object.values(cart).map(item => `
    <article class="cart-line">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3 class="cart-line-name">${item.name}</h3>
        <div class="cart-line-price">${money(item.price)}</div>
        <div class="quantity-control" aria-label="Quantity for ${item.name}">
          <button type="button" data-quantity="-1" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-quantity="1" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-item" type="button" data-remove="${item.id}">Remove</button>
      </div>
      <div class="cart-line-total">${money(item.price * item.quantity)}</div>
    </article>`).join('');
  cartItems.querySelectorAll('[data-quantity]').forEach(button => button.addEventListener('click', () => changeQuantity(button.dataset.id, Number(button.dataset.quantity))));
  cartItems.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => removeItem(button.dataset.remove)));
}
function openCart() {
  cartDrawer?.classList.add('open');
  cartBackdrop?.classList.add('open');
  cartDrawer?.setAttribute('aria-hidden', 'false');
  cartBackdrop?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartDrawer?.classList.remove('open');
  cartBackdrop?.classList.remove('open');
  cartDrawer?.setAttribute('aria-hidden', 'true');
  cartBackdrop?.setAttribute('aria-hidden', 'true');
  if (!checkoutModal?.classList.contains('open') && !lightbox?.classList.contains('open')) document.body.style.overflow = '';
}
document.querySelectorAll('.add-to-cart').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.id)));
document.getElementById('openCart')?.addEventListener('click', openCart);
document.getElementById('shopViewCart')?.addEventListener('click', openCart);
document.getElementById('closeCart')?.addEventListener('click', closeCart);
cartBackdrop?.addEventListener('click', closeCart);
document.getElementById('continueShopping')?.addEventListener('click', closeCart);

function openCheckout() {
  if (!cartQuantity()) return;
  closeCart();
  checkoutForm.hidden = false;
  orderSuccess.hidden = true;
  checkoutModal?.classList.add('open');
  checkoutModal?.setAttribute('aria-hidden', 'false');
  checkoutTotal.textContent = money(totalAmount());
  document.body.style.overflow = 'hidden';
}
function closeCheckout() {
  checkoutModal?.classList.remove('open');
  checkoutModal?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
checkoutButton?.addEventListener('click', openCheckout);
document.getElementById('closeCheckout')?.addEventListener('click', closeCheckout);
checkoutModal?.addEventListener('click', event => { if (event.target === checkoutModal) closeCheckout(); });
checkoutForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!checkoutForm.reportValidity()) return;
  const formData = new FormData(checkoutForm);
  const customer = String(formData.get('customerName') || '').trim();
  const method = String(formData.get('paymentMethod') || 'UPI');
  const reference = `TSS-${Date.now().toString().slice(-7)}`;
  checkoutForm.hidden = true;
  orderSuccess.hidden = false;
  document.getElementById('successMessage').textContent = `Thanks, ${customer}! Your demo order total is ${money(totalAmount())}. Payment method selected: ${method}. No real payment was processed.`;
  document.getElementById('orderReference').textContent = `DEMO ORDER · ${reference}`;
  Object.keys(cart).forEach(id => delete cart[id]);
  renderCart();
});
document.getElementById('finishOrder')?.addEventListener('click', () => {
  closeCheckout();
  closeCart();
  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeLightbox();
    closeCart();
    closeCheckout();
  }
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'ArrowLeft') showPhoto(activeIndex - 1);
  if (event.key === 'ArrowRight') showPhoto(activeIndex + 1);
});
renderCart();
