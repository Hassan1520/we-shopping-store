/**
 * Shared frontend utilities for We Shopping.
 * Each module runs only when its target elements exist on the page.
 *
 * Recommended to rename this file to `main.js` or `app.js` for clarity.
 */
(function () {
	'use strict';

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, '&amp;') // Must be first
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function showToast(message, type) {
		const popupMessage = document.getElementById('popup-message');
		const messageText = document.getElementById('message-text');
		if (!popupMessage || !messageText) return;

		messageText.textContent = message;
		popupMessage.className = 'popup-message'; // Reset classes
		if (type) popupMessage.classList.add(`popup-message--${type}`);
		
		popupMessage.classList.add('is-visible');

		// Clear previous timer
		if (showToast.timer) clearTimeout(showToast.timer);

		showToast.timer = setTimeout(() => {
			popupMessage.classList.remove('is-visible');
		}, 3000);
	}

	function initNavigation() {
		const menu = document.getElementById('menu1');
		const ul = document.getElementById('ul');
		if (!menu || !ul) return;

		menu.setAttribute('role', 'button');
		menu.setAttribute('aria-label', 'Toggle navigation menu');
		menu.setAttribute('aria-expanded', 'false');
		menu.setAttribute('tabindex', '0');

		function toggleMenu() {
			const isOpen = ul.classList.toggle('is-open');
			menu.setAttribute('aria-expanded', String(isOpen));
		}

		menu.addEventListener('click', toggleMenu);
		menu.addEventListener('keydown', function (event) {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				toggleMenu();
			}
		});

		document.addEventListener('click', function (event) {
			if (!ul.classList.contains('is-open')) return;
			if (!ul.contains(event.target) && !menu.contains(event.target)) {
				ul.classList.remove('is-open');
				menu.setAttribute('aria-expanded', 'false');
			}
		});
	}

	function initFooterYear() {
		const text = document.getElementById('text1');
		if (!text) return;
		// Use textContent for security unless HTML is intended.
		text.textContent = `Eng Hassan copyright © ${new Date().getFullYear()}`;
	}

	function initScrollTop() {
		const myButton = document.getElementById('myBtn');
		if (!myButton) return;

		myButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

		window.addEventListener('scroll', () => {
			myButton.classList.toggle('is-visible', window.scrollY >= 100);
		}, { passive: true });
	}


	function initProducts() {
		const root = document.getElementById('root');
		if (!root) return;

		root.innerHTML = '<div class="loading-state" role="status">Loading products…</div>';

		fetch('https://fakestoreapi.com/products')
			.then(response => {
				if (!response.ok) throw new Error('Failed to load products');
				return response.json();
			})
			.then(products => {
				const mensCategory = products.filter(function (item) {
					return item.category === 'men\'s clothing';
				});

				if (!mensCategory.length) {
					root.innerHTML = '<div class="error-state">No products found.</div>';
					return;
				}

				root.innerHTML = mensCategory.map(values => {
					const originalPrice = (values.price * 1.5).toFixed(2);
					const safeTitle = escapeHtml(values.title);
					const safeImage = escapeHtml(values.image);
					const safeDescription = escapeHtml(values.description);
					const safeRate = escapeHtml(values.rating.rate);

					return (
						`<div class="Arrivals-item">
							<div class="product-preview" role="button" tabindex="0" 
								data-image="${safeImage}" 
								data-description="${safeDescription}" 
								data-title="${safeTitle}" 
								data-rate="${safeRate}">
								<div class="product-img">
									<img src="${safeImage}" alt="${safeTitle}" loading="lazy">
								</div>
								<div class="title-product"><p>${safeTitle}</p></div>
								<div class="price"><span>$${values.price.toFixed(2)} <del>$${originalPrice}</del></span></div>
							</div>
							<div class="btn-contorl">
								<a href="./signup.php" class="btn-50">Buy Now</a>
								<button type="button" class="btn-50 add-to-cart-btn" 
									data-title="${safeTitle}" 
									data-image="${safeImage}" 
									data-price="${values.price}">Add To Cart</button>
							</div>
						</div>`
					);
				}).join('');

				root.addEventListener('click', event => {
					const preview = event.target.closest('.product-preview');
					if (preview) {
						openProductPopup(preview.dataset);
						return;
					}

					const addButton = event.target.closest('.add-to-cart-btn');
					if (addButton) {
						addToCart(addButton.dataset);
					}
				});

				root.addEventListener('keydown', event => {
					if (event.key !== 'Enter' && event.key !== ' ') return;
					const preview = event.target.closest('.product-preview');
					if (!preview) return;
					event.preventDefault();
					openProductPopup(preview.dataset);
				});
			})
			.catch(error => {
				console.error('Error fetching products:', error);
				root.innerHTML = '<div class="error-state" role="alert">Unable to load products. Please try again later.</div>';
			});
	}

	function addToCart(productData) {
		const { title, image, price } = productData;
		const cart = JSON.parse(localStorage.getItem('cart') || '[]');
		
		// Prevent adding duplicates, or increment quantity
		const existingItem = cart.find(item => item.title === title);
		if (existingItem) {
			existingItem.quantity = (existingItem.quantity || 1) + 1;
		} else {
			cart.push({ title, image, price, quantity: 1 });
		}

		localStorage.setItem('cart', JSON.stringify(cart));
		showToast(`${title} has been added to the cart!`, 'success');
		// Optionally, update a cart count indicator without reloading
		updateCartCount(cart.length);
	}

	function openProductPopup(dataset) {
		const { image, description, title, rate } = dataset;
		
		const overlay = document.createElement('div');
		overlay.classList.add('pop-overlay');

		const popBox = document.createElement('div');
		popBox.className = 'popBox';
		popBox.setAttribute('role', 'dialog');
		popBox.setAttribute('aria-modal', 'true');
		popBox.setAttribute('aria-labelledby', 'popup-title');

		const closeButton = document.createElement('button');
		closeButton.type = 'button';
		closeButton.classList.add('closeButton');
		closeButton.setAttribute('aria-label', 'Close product details');
		closeButton.textContent = 'X';
		
		const img = document.createElement('img');
		img.className = 'popimg';
		img.src = image;
		img.alt = title;

		const heading = document.createElement('h2');
		heading.className = 'h2pop';
		heading.id = 'popup-title';
		heading.textContent = title;

		const paragraph = document.createElement('p');
		paragraph.className = 'ppop';
		paragraph.textContent = description;

		const rating = document.createElement('p');
		rating.className = 'prate';
		rating.textContent = `Rating: ${rate} ★`;

		let lastFocusedElement = document.activeElement;

		function handleKeyDown(event) {
			if (event.key === 'Escape') {
				closePopup();
			}
		}
		
		function closePopup() {
			overlay.remove();
			popBox.remove();
			document.removeEventListener('keydown', handleKeyDown);
			if (lastFocusedElement) lastFocusedElement.focus();
		}

		closeButton.addEventListener('click', closePopup);
		overlay.addEventListener('click', closePopup);
		document.addEventListener('keydown', handleKeyDown);

		popBox.appendChild(closeButton);
		popBox.appendChild(img);
		popBox.appendChild(heading);
		popBox.appendChild(paragraph);
		popBox.appendChild(rating);

		document.body.appendChild(overlay);
		document.body.appendChild(popBox);
		closeButton.focus();
	}
	
	function updateCartCount(count) {
		const countElements = document.querySelectorAll('.cart-count-indicator'); // Use a class for all indicators
		if (!countElements.length) return;
		countElements.forEach(el => {
			el.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
		});
	}

	function initCart() {
		const cartBox = document.getElementById('cart');
		const checkout = document.querySelector('.ckeckout');
		if (!cartBox) return;

		const cart = JSON.parse(localStorage.getItem('cart') || '[]');
		const countIt = document.getElementById('countItem');

		if (countIt) {
			countIt.textContent = `${cart.length} ${cart.length === 1 ? 'Item' : 'Items'}`;
		}

		if (!cart.length) {
			cartBox.innerHTML =
				'<div class="header-cart"><h2>Shopping Cart</h2></div>' +
				'<div class="empty-cart">' +
					'<div class="empty-img">' +
						'<i class="fa-solid fa-cart-shopping" style="font-size:50px; color:var(--main-color);" aria-hidden="true"></i>' +
					'</div>' +
					'<h4>Your cart is empty!</h4>' +
					'<p>Browse our categories and discover our best deals!</p>' +
					'<a href="./shop.html"><button type="button">START SHOPPING</button></a>' +
				'</div>';

			if (checkout) checkout.style.visibility = 'hidden';
			return;
		}

		// Build all cart rows as a single string to avoid O(n²) innerHTML += in a loop
		const itemsHtml = cart.map(function (item, index) {
			const safeTitle = escapeHtml(item.title);
			const safeImage = escapeHtml(item.image);
			const price = parseFloat(item.price).toFixed(2);
			return (
				`<div class="content" data-item-id="${index}">
					<div class="cart-img"><img src="${safeImage}" alt="${safeTitle}" loading="lazy"></div>
					<div class="cart-text"><h3>${safeTitle}</h3><p>$${price}</p></div>
					<div class="quantity">
						<button type="button" class="quantity-increase" aria-label="Increase quantity of ${safeTitle}">+</button>
						<div class="quantity-text">1</div>
						<button type="button" class="quantity-decrease" aria-label="Decrease quantity of ${safeTitle}">-</button>
					</div>
					<div class="total"><p class="update-price">Total $${price}</p></div>
					<button type="button" class="remove-btn" data-index="${index}">Remove</button>
					<button type="button" class="remove-btn1" data-index="${index}" aria-label="Remove ${safeTitle}">&#x2715;</button>
				</div>`
			);
		}).join('');

		cartBox.innerHTML =
			`<div class="header-cart">
				<h2>Shopping Cart</h2>
				<h3 id="countItem">${cart.length} ${cart.length === 1 ? 'Item' : 'Items'}</h3>
			</div>` + itemsHtml;

		cartBox.addEventListener('click', function (event) {
			const button = event.target;
			const removeButton = button.closest('[data-index]');
			if (removeButton && (button.classList.contains('remove-btn') || button.classList.contains('remove-btn1'))) {
				deleteProduct(Number(removeButton.dataset.index));
			}
		});

		const plusButtons = document.querySelectorAll('.quantity-increase');
		const minusButtons = document.querySelectorAll('.quantity-decrease');
		const updatePrices = document.getElementsByClassName('update-price');

		plusButtons.forEach(function (button, index) {
			button.addEventListener('click', function () {
				const quantityElement = button.nextElementSibling;
				let quantity = parseInt(quantityElement.textContent, 10) + 1;
				quantityElement.textContent = quantity;
				const unitPrice = parseFloat(cart[index].price);
				updatePrices[index].textContent = 'Total $' + (unitPrice * quantity).toFixed(2);
				calculateTotal(cart, updatePrices);
			});
		});

		minusButtons.forEach(function (button, index) {
			button.addEventListener('click', function () {
				const quantityElement = button.previousElementSibling;
				let quantity = parseInt(quantityElement.textContent, 10);
				if (quantity <= 1) return;
				quantity -= 1;
				quantityElement.textContent = quantity;
				const unitPrice = parseFloat(cart[index].price);
				updatePrices[index].textContent = 'Total $' + (unitPrice * quantity).toFixed(2);
				calculateTotal(cart, updatePrices);
			});
		});

		calculateTotal(cart, updatePrices);
	}

	function deleteProduct(index) {
		const cart = JSON.parse(localStorage.getItem('cart') || '[]');
		cart.splice(index, 1);
		localStorage.setItem('cart', JSON.stringify(cart));
		initCart(); // Re-render the cart without reloading the page
	}

	function calculateTotal(cart, updatePrices) {
		const totalPrice = document.querySelector('.cart-sum');
		if (!totalPrice) return;

		const quantityElements = document.querySelectorAll('.quantity-text');
		let price = 0;

		cart.forEach(function (item, index) {
			const quantity = parseInt(quantityElements[index].textContent, 10);
			price += parseFloat(item.price) * quantity;
		});

		totalPrice.textContent = `Total $${price.toFixed(2)}`;
	}

	/**
	 * Listens for "Add To Cart" clicks on static product pages
	 * (woman.html, accessories.html) where buttons are hard-coded in HTML,
	 * not injected by initProducts().
	 * Uses event delegation on document so it works for any page.
	 */
	function initStaticAddToCart() {
		// men.html handles its own clicks inside #root — skip to avoid double-adding
		if (document.getElementById('root')) return;

		document.addEventListener('click', function (event) {
			const btn = event.target.closest('.add-to-cart-btn');
			if (!btn) return;
			addToCart(btn.dataset);
		});
	}

	// Initialize modules on DOMContentLoaded
	document.addEventListener('DOMContentLoaded', () => {
		initNavigation();
		initFooterYear();
		initScrollTop();
		initProducts();      // men.html only (guards itself with #root check)
		initStaticAddToCart(); // woman.html, accessories.html static buttons
		initCart();          // cart.html only (guards itself with #cart check)
	});
})();
