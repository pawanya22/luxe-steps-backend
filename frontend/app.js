const API_URL = 'http://localhost:5000/api/products';

async function loadProducts() {
    const container = document.getElementById('product-container');
    try {
        const res = await fetch(API_URL);
        const result = await res.json();
        
        console.log("Data from backend:", result); // This will show in your Browser Console (F12)

        if (!result.data || result.data.length === 0) {
            container.innerHTML = "<h3>Database is empty. Add a product via Thunder Client!</h3>";
            return;
        }

        container.innerHTML = result.data.map(product => `
            <div class="card">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">$${product.price}</div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = "<h3>Error: Cannot connect to server.</h3>";
        console.error("Fetch error:", err);
    }
}

loadProducts();