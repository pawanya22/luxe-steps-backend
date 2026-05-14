document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- 2. GSAP Advanced Animations ---
    gsap.from("#title", { duration: 1.5, y: 150, opacity: 0, ease: "power4.out" });
    gsap.from("#shoe", { duration: 2, scale: 0.8, opacity: 0, ease: "back.out(1.2)" });
    gsap.to("#shoe", { y: "+=40", duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // Interactive Glow & Parallax
    document.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 50;
        const y = (window.innerHeight - e.pageY * 2) / 50;
        gsap.to("#shoe", { x: x, y: y, duration: 0.5 });
        gsap.to(".glow", { x: x * -1.5, y: y * -1.5, duration: 1 });
    });

    // --- 3. Dynamic Products & Cart Logic ---
    async function loadProducts() {
        const container = document.getElementById('product-list');
        const res = await api.fetch('/products');
        
        if (res.data) {
            container.innerHTML = res.data.map((p, index) => `
                <div class="card scroll-reveal">
                    <img src="${p.image || 'shoe.png'}" alt="${p.name}" loading="lazy">
                    <h3>${p.name}</h3>
                    <p>$${p.price.toFixed(2)}</p>
                    <button class="btn-luxury-small add-to-cart" 
                            data-id="${p._id}" 
                            data-name="${p.name}" 
                            data-price="${p.price}">
                            Add to Cart
                    </button>
                </div>
            `).join('');

            // Add Event Listeners to Buttons
            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const product = e.target.dataset;
                    addToCart(product);
                });
            });
        }
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
        // Optional: Update cart counter in navbar
    }

    // --- 4. Magnetic Buttons ---
    document.querySelectorAll('.btn-luxury').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            gsap.to(btn, { x: (e.clientX - rect.left - rect.width/2) * 0.3, y: (e.clientY - rect.top - rect.height/2) * 0.5, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.3 }));
    });

    loadProducts();
});