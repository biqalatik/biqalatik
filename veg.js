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
        { name: "بطاطس", price: 3500, img: "img/potato-3440360_1920 (1).jpg", description: "كيلو بطاطس" },
        { name: ".بطاطس", price: 1300, img: "img/potato-3440360_1920 (1).jpg", description: "نص كيلو بطاطس" },
        { name: "بامبي", price: 2500, img: "img/1730965247587.jpg", description: "كيلو بامبي" },
        { name: ".بامبي", price: 1300, img: "img/1730965247587.jpg", description: "نص كيلو بامبي" },
        { name: "باميه", price: 7500, img: "img/image_fx_ 1(4).jpg", description: "كيلو باميه" },
        { name: ".باميه", price: 3800, img: "img/image_fx_ 1(4).jpg", description: "نص كيلو باميه" },
        { name: ".باميه", price: 1900, img: "img/image_fx_ 1(4).jpg", description: "ربع كيلو باميه" },
        { name: "اسود(بازنجان)", price: 2500, img: "img/image_fx_.jpg", description: "كيلو اسود" },
        { name: "اسود", price: 1300, img: "img/image_fx_.jpg", description: "نص كيلو اسود" },
        { name: "قرع", price: 2500, img: "img/image_fx_ (1) (1).jpg", description: "كيلوه قرع" },
        { name: ".قرع", price: 1300, img: "img/image_fx_ (1) (1).jpg", description: "نص كيلو قرع" },
        { name: "كوزه", price: 2500, img: "img/image_fx_ (2) (1).jpg", description: "كيلو كوسه" },
        { name: ".كوزه", price: 1300, img: "img/image_fx_ (2) (1).jpg", description: "نص كيلو كوسه" },
        { name: "رجله خضره", price: 2000, img: "img1/ei_1731608358596-removebg-preview.jpg", description: " رجله خضره يمكنك الاختيار عدة مرات" },
        { name: "طماطم", price: 3500, img: "img/a-tomato-877019_1920 (1).jpg", description: "كيلو طماطم" },
        { name: ".طماطم", price: 1800, img: "img/a-tomato-877019_1920 (1).jpg", description: "نص كيلو طماطم" },
        { name: "..طماطم", price: 1000, img: "img/a-tomato-877019_1920 (1).jpg", description: "ريع كيلو طماطم" },
        { name: "سلطه", price: 5000, img: "img/vegetables-7662621_1920 (1).jpg", description: "سلطة خضار طازجه" },
        { name: ".سلطه", price: 3000, img: "img/vegetables-7662621_1920 (1).jpg", description: "سلطة خضار طازجه" },
        { name: "شطه", price: 2000, img: "img/1730965302722.jpg", description: "اخضار احسب سعرك" },
        { name: ".شطه", price: 1000, img: "img/1730965302722.jpg", description: "اخضار احسب سعرك" },
        { name: "..شطه", price: 500, img: "img/1730965302722.jpg", description: "اخضار احسب سعرك" },
        { name: ".ليمون", price: 500, img: "img/ei_1731755591215-removebg-preview.jpg", description: "2جبة ليمون ب" },
        { name: "..ليمون", price: 1000, img: "img/ei_1731755591215-removebg-preview.jpg", description: "4 حبات ليكون ب" },
        { name: "بصل أخضر", price: 3000, img: "img/image_fx_ (5).jpg", description: "كيلوا بصل ابيض" },
        { name: ".بصل أخضر", price: 1500, img: "img/image_fx_ (5).jpg", description: "نص كيلوا بصل ابيض" },
        { name: "فلفليه", price: 1000, img: "img/image_fx_ (3) (1).jpg", description: "اخضار احسب سعرك" },
        { name: ".فلفليه", price: 2000, img: "img/image_fx_ (3) (1).jpg", description: "اخضار احسب سعرك" },
        { name: "..فلفليه", price: 3000, img: "img/image_fx_ (3) (1).jpg", description: "اخضار احسب سعرك" },
        { name: "جرجير", price: 1000, img: "img/watercress-4257303_1920 (1).jpg", description: "جرجير طازج" },
        { name: "جزر", price: 2000, img: "img/carrots-673184_1920 (1).jpg", description: "جزر" },
        { name: "خيار", price: 3000, img: "img/cucumber-7259270_1920 (1).jpg", description: "كيلو خيار" },
        { name: ".خيار", price: 1500, img: "img/cucumber-7259270_1920 (1).jpg", description: "نص كيلو خيار" },
        { name: "..خيار", price: 800, img: "img/cucumber-7259270_1920 (1).jpg", description: "ربع كيلو خيار" },
        
  
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