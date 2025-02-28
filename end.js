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
        { name: "بصل", price: 2000, img: "img/onions-1397037_1920 (1).jpg", description: "ملوة بصل" },
        { name: ".بصل", price: 4000, img: "img/onions-1397037_1920 (1).jpg", description: "نص ربع بصل" },
        { name: "..بصل", price: 8000, img: "img/onions-1397037_1920 (1).jpg", description: "ربع بصل" },
        { name: " صلصه مجانا", price: 500, img: "img1/ei_1731593282850-removebg-preview.jpg", description: "ظرف صلصله مجانا يمكنك اختيار عدة ظروف" },
        { name: "صلصه", price: 3600, img: "img1/ei_1731600621391-removebg-preview.jpg", description: "علبة صلصة الفراشه" },
        { name: ".صلصه", price: 3600, img: "img1/ei_1731600652049-removebg-preview.jpg", description: "علبة صلصة سعيد" },
        { name: "شعريه نوبو", price: 1300, img: "img1/ei_1731607995331-removebg-preview.jpg", description: "شعريه نوبو" },
        { name: "مكرونه نوبو", price: 1300, img: "img1/ei_1731607972769-removebg-preview.jpg", description: "مكرونه كوع" },
        { name: "مكرونه اسباجتي", price: 1300, img: "img1/ei_1731608036079-removebg-preview (1).jpg", description: "اسباجتي" },
        { name: "اندومي ", price: 500, img: "img1/ei_1731780282744-removebg-preview.jpg", description: "اندومي خضار يمكنك الاختيار عدة مرات" },
        { name: "سكر", price: 2500, img: "img1/ei_1731587279355-removebg-preview.jpg", description: "كيلو سكر" },
        { name: ".سكر", price: 1300, img: "img1/ei_1731587279355-removebg-preview.jpg", description: "نص كيلو سكر" },
        { name: "شوال سكر", price: 12000, img: "img/سكر-كنانه-780x470 (1).jpg", description: "شوال سكر 5كيلو" },
        { name: ".شوال سكر", price: 24000, img: "img/سكر-كنانه-780x470 (1).jpg", description: "شوال سكر 10كيلو" },
        { name: "طحنيه تعبيه", price: 8500, img: "img/sweet-3-28-1-2021 (1).jpg", description: "كيلو طحنيه يمكنك الاختيار عدة مرات" },
        { name: ".طحنيه تعبيه", price: 4300, img: "img/sweet-3-28-1-2021 (1).jpg", description: "نص كيلو طحنيه" },
        { name: "..طحنيه تعبيه", price: 2200, img: "img/sweet-3-28-1-2021 (1).jpg", description: "ربع كيلو" },
        { name: "طحنية الوافي", price: 11500, img: "img1/ei_1731607886849-removebg-preview.jpg", description: "حجم كبير" },
        { name: ".طحنية الوافي", price:6000, img: "img/ei_1731750044887-removebg-preview.jpg", description: "حجم وسط" },
        { name: "طحنية الوطنيه", price: 11500, img: "img1/ei_1731607898994-removebg-preview.jpg", description: "حجم كبير" },
        { name: ".طحنية الوطنيه", price: 6000, img: "img1/ei_1731607874744-removebg-preview.jpg", description: "حجم وسط" },
        { name: "مربى", price: 9000, img: "img/ei_1731751511283-removebg-preview.jpg", description: "مربى كبير" },
        { name: ".مربى", price: 4000, img: "img/ei_1731751511283-removebg-preview.jpg", description: "مربى وسط" },
        { name: "..مربى", price: 2000, img: "img/ei_1731751511283-removebg-preview.jpg", description: "مربى صغير" },
        { name: "بسكويت", price: 500, img: "img/ei_1731749618851-removebg-preview.jpg", description: "بسكويت جلكوز" },
        { name: "بسكويت.", price: 500, img: "img/ei_1731749667653-removebg-preview.jpg", description: "بسكويت بيك" },
        { name: "بسكويت..", price: 1000, img: "img/ei_1731749498236-removebg-preview.jpg", description: "بسكويت اوريو" },
        { name: "كيكه", price: 500, img: "img/ei_1731749256110-removebg-preview.jpg", description: "كيك السيسي" },
        { name: "ماكس تيلا", price: 10000, img: "img/ei_1731751763920-removebg-preview.jpg", description: "ماكس تيلا حجم كبير" },
        { name: "ماكس تيلا.", price: 4000, img: "img/ei_1731751788838-removebg-preview.jpg", description: "حجم وسط" },
        { name: "ماكس تيلا..", price: 1000, img: "img/ei_1731749310685-removebg-preview.jpg", description: "حجم صغير" },
        { name: " بن حب", price: 6500, img: "img1/ei_1731587859083-removebg-preview.jpg", description: "بن رطل" },
        { name: " .بن حب", price: 3300, img: "img1/ei_1731587859083-removebg-preview.jpg", description: "بن نص رطل" },
        { name: "..بن حب", price: 1700, img: "img1/ei_1731587859083-removebg-preview.jpg", description: "بن ربع رطل" },
        { name: "بن مسحون", price: 9000, img: "img1/ei_1731587685380-removebg-preview.jpg", description: "رطل بن مسحون" },
        { name: ".بن مسحون", price: 4500, img: "img1/ei_1731587685380-removebg-preview.jpg", description: "نص رطل بن مسحون" },
        { name: "..بن مسحون", price: 2300, img: "img1/ei_1731587685380-removebg-preview.jpg", description: "ربع رطل بن مسحون" },
        { name: "شاي تعبيه", price: 1000, img: "img/ei_1731587544800-removebg-preview (1).jpg", description: "نص ربع" },
        { name: "شاي الغزالتين", price: 2000, img: "img1/ei_1731601395773-removebg-preview (1).jpg", description: "ربع شاي الغزالتين" },
        { name: ".شاي الغزالتين", price: 3800, img: "img1/ei_1731601395773-removebg-preview (1).jpg", description: "نص رطل" },
        { name: "..شاي الغزالتين", price: 7500, img: "img1/ei_1731601395773-removebg-preview (1).jpg", description: "رطل شاي الغزالتين" },
        { name: "فنكوش", price: 7000, img: "img/ei_1731751812625-removebg-preview.jpg", description: "كيلو فنكوش" },
        { name: "فنكوش.", price: 3500, img: "img/ei_1731751812625-removebg-preview.jpg", description: "نص كيلو" },
        { name: "فنكوش..", price: 1800, img: "img/ei_1731751812625-removebg-preview.jpg", description: "ربع كيلو" },
        { name: "فشار", price: 4000, img: "img/ei_1731751866938-removebg-preview.jpg", description: "كيلو فشار" },
        { name: "فشار", price: 2000, img: "img/ei_1731751866938-removebg-preview.jpg", description: "نص كيلو" },
        { name: "فشار", price: 1000, img: "img/ei_1731751866938-removebg-preview.jpg", description: "ربع كيلو" },
        
  
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