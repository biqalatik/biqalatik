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
        { name: "خميره", price: 300, img: "img/ei_1731749366170-removebg-preview.jpg", description: "ظرف يمكنك الاختيار عدة مرات" }, 
        { name: "باكنج باودر", price: 800, img: "img1/ei_1731755615723-removebg-preview.jpg", description: "ظرف يمكنك الاختيار عدة مرات" }, 
        { name: "فانليا", price: 800, img: "img/ei_1731752179544-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" }, 
        { name: "نشاء", price: 1000, img: "img/ei_1731752154085-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" }, 
        { name: "كستر", price: 800, img: "img1/ei_1731755822410-removebg-preview.jpg", description: "ظرف كستر" },
        { name: "خل ابيض", price: 2500, img: "img/ei_1731751734860-removebg-preview.jpg", description: "خل ابيض" },
        { name: "ملح", price: 300, img: "img/ei_1731587452255-removebg-preview.jpg", description: "ظرف ملح" },
        { name: ".ملح", price: 500, img: "img/ei_1731587452255-removebg-preview.jpg", description: "2 ظرف ملح" },
        { name: "ثوم", price: 1000, img: "img/garlic-3419544_1280 (1).jpg", description: "يمكنك اختيار الثوم عدة مرات" },
        { name: "كسبره", price: 1000, img: "img1/ei_1731587888826-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "كسبره مسحونه", price: 1000, img: "img1/ei_1731587592367-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "زنجبيل", price: 1000, img: "img/ginger-1960613_1280 (1).jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "زنجبيل مسحون", price: 1000, img: "img/ei_1731587498607-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "قرفه", price: 1000, img: "img1/ei_1731587655490-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "قرنفل", price: 1000, img: "img1/ei_1731587348599-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات(اقل سعر)" },
        { name: "شمار", price: 1000, img: "img1/ei_1731587721125-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "كمون(الحبه السودا)", price: 1000, img: "img1/ei_1731588860551-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "شطه حمرا", price: 500, img: "img/1731143405468.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: ".شطه حمرا", price: 1000, img: "img/1731143405468.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "دكوه", price: 500, img: "img/1731143429171.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: ".دكوه", price: 1000, img: "img/1731143429171.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "ويكه", price: 1000, img: "img1/1731608221985.jpg", description: "يمكنك الاختيار عدة مرات" },
        
  
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