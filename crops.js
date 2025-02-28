if (window.matchMedia('(display-mode: standalone)').matches) {
    // الموقع يُعرض كـ "تطبيق ويب"
}
 else {
    // الموقع يُعرض في المتصفح
    window.addEventListener('load', function() {
        if (!window.navigator.standalone) {
            // يمكن إضافة إشعار للمستخدم بتثبيت التطبيق
        }
    });
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((error) => console.error("Service Worker Registration Failed:", error));
  }

// جلب العناصر المضافة للسلة من localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// تحديث عداد السلة في الـ Header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cartItems.length;  // تحديث عدد العناصر في السلة
}

// إضافة المنتجات إلى السلة
function addToCart(productName, productPrice) {
    // إضافة المنتج إلى السلة
    cartItems.push({ name: productName, price: productPrice });
    
    // حفظ السلة في localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // تحديث عداد السلة
    updateCartCount();
}

// عرض المنتجات في الصفحة الرئيسية مع دعم البحث
function displayProducts(products, searchQuery = '') {
    const productContainer = document.querySelector('.product-list');
    productContainer.innerHTML = '';  // مسح المنتجات السابقة

    // تصفية المنتجات بناءً على نص البحث
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>السعر: ${product.price} جنيه</p>
            <button class="add-to-cart" data-product="${product.name}" data-price="${product.price}">أضف إلى السلة</button>
        `;
        productContainer.appendChild(productDiv);
    });

    // إضافة الحدث لكل زر "أضف إلى السلة"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = button.getAttribute('data-product');
            const productPrice = parseFloat(button.getAttribute('data-price'));

            // إضافة المنتج إلى السلة
            addToCart(productName, productPrice);
        });
    });
}

// عرض محتويات السلة في صفحة السلة
function displayCart() {
    const cartTableBody = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('cart-empty-message');
    cartTableBody.innerHTML = '';  // مسح العناصر السابقة
    let totalPrice = 0;

    if (cartItems.length === 0) {
        emptyMessage.style.display = 'block';
        totalPriceElement.style.display = 'none';
        document.getElementById('whatsapp-checkout').style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        totalPriceElement.style.display = 'block';
        document.getElementById('whatsapp-checkout').style.display = 'block';

        // عرض المنتجات في السلة
        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
            `;
            cartTableBody.appendChild(row);
            totalPrice += item.price;
        });

        // عرض الإجمالي
        totalPriceElement.textContent = `الإجمالي: ${totalPrice} جنيه`;

        // إنشاء رابط واتساب
        createWhatsAppLink(totalPrice);
    }
}

// إنشاء رابط الشراء عبر واتساب
function createWhatsAppLink(totalPrice) {
    const whatsappButton = document.getElementById('whatsapp-btn');
    const productsText = cartItems.map(item => `${item.name} - ${item.price} ريال`).join('%0A');
    const message = `مرحباً، أرغب في شراء المنتجات التالية:%0A${productsText}%0Aالإجمالي: ${totalPrice} جنيه.`;
    const whatsappUrl = `https://wa.me/249119479189?text=${encodeURIComponent(message)}`;

    // عند الضغط على الزر يتم فتح رابط واتساب
    whatsappButton.onclick = function() {
        window.open(whatsappUrl, '_blank');
    };
}

// تهيئة الصفحة عند تحميلها
document.addEventListener('DOMContentLoaded', function() {
    // قائمة المنتجات
    const productList = [
        { name: "دقيق سيقا", price: 2200, img: "img1/ei_1731608054582-removebg-preview.jpg", description: " (كيلو دقيق (انتاج شركة سيقا" },
        { name: "دقيق سمولينا", price: 2200, img: "img1/ei_1734856532272-removebg-preview.jpg", description: "دقيق سمولينا فاخر" },
        { name: "دقيق قمح", price: 5000, img: "img/دقيق (1).jpg", description: "ملوة دقيق قمح" },
        { name: ".دقيق قمح", price: 2500, img: "img/دقيق (1).jpg", description: "نص ملوة دقيق قمح" },
        { name: "دقيق ابيض", price: 4500, img: "img/كيف_يصنع_الطحين (1).jpg", description: "ملوة دقيق ابيض" },
        { name: ".دقيق ابيض", price: 2300, img: "img/كيف_يصنع_الطحين (1).jpg", description: "نص ملوه" },
        { name: "دقيق دخن", price: 5000, img: "img/d567ca79-7448-4f46-b92e-6bafb3135e99.jpg", description: "ملوة دقيق دخن" },
        { name: ".دقيق دخن", price: 2500, img: "img/d567ca79-7448-4f46-b92e-6bafb3135e99.jpg", description: "نص ملوه دقيق دخن" },
        { name: "كبكبي", price: 7000, img: "img1/ei_1731600582219-removebg-preview.jpg", description: "ملوة كبكبي" },
        { name: ".كبكبي", price: 3500, img: "img1/ei_1731600582219-removebg-preview.jpg", description: "نص ملوه كبكبي" },
        { name: "..كبكبي", price: 1800, img: "img1/ei_1731600582219-removebg-preview.jpg", description: "ربع ملوة كبكبي" },
        { name: "عدسيه (بليله)", price: 7500, img: "img/pigean1 (1).jpg", description: "ملوة عدسيه" },
        { name: "عدسيه", price: 3800, img: "img/pigean1 (1).jpg", description: "نص ملوة" },
        { name: "عدسيه", price: 1900, img: "img/pigean1 (1).jpg", description: "ربع ملوة" },
        { name: "فاصوليا", price: 5000, img: "img1/ei_1731592911797-removebg-preview.jpg", description: "كيلو فاصوليا" },
        { name: ".فاصوليا", price: 2500, img: "img1/ei_1731592911797-removebg-preview.jpg", description: " نص كيلو فاصوليا" },
        { name: "..فاصوليا", price: 1300, img: "img1/ei_1731592911797-removebg-preview.jpg", description: "ربع كيلو فاصوليا" },
        { name: "عدس", price: 3600, img: "img1/ei_1731592849739-removebg-preview.jpg", description: "كيلو عدس" },
        { name: ".عدس", price: 1800, img: "img1/ei_1731592849739-removebg-preview.jpg", description: "نص كيلو عدس" },
        { name: "..عدس", price: 900, img: "img1/ei_1731592849739-removebg-preview.jpg", description: "ربع كيلو عدس" },
        { name: "رز", price: 3000, img: "img1/ei_1731592875777-removebg-preview.jpg", description: "كيلو رز" },
        { name: ".رز", price: 1500, img: "img1/ei_1731592875777-removebg-preview.jpg", description: "نص كيلو رز" },
        { name: "..رز", price: 800, img: "img1/ei_1731592875777-removebg-preview.jpg", description: "ربع كيلو رز" },
        { name: "رز كبسه", price: 3000, img: "img/ما-هي-أفضل-أنواع-الأرز.jpg", description: "كيلو رز كبسه" },
        { name: ".رز كبسه", price: 1500, img: "img/ما-هي-أفضل-أنواع-الأرز.jpg", description: "نص كيلو" },
        { name: "..رز كبسه", price: 800, img: "img/ما-هي-أفضل-أنواع-الأرز.jpg", description: "ربع كيلو" },
        
  
    ];

    // عرض المنتجات في الصفحة الرئيسية
    displayProducts(productList);

    // تحديث عداد السلة عند تحميل الصفحة
    updateCartCount();

    // إذا كنا في صفحة السلة، نعرض محتويات السلة
    if (window.location.pathname.includes('cart.html')) {
        displayCart();  // عرض محتويات السلة
    }

    // إضافة مستمع الحدث للبحث
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchQuery = searchInput.value.trim();
        displayProducts(productList, searchQuery);  // إعادة عرض المنتجات بناءً على نص البحث
    });
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  deferredPrompt = event;
  const installButton = document.getElementById('install-btn');
  installButton.style.display = 'block'; // عرض الزر

  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});