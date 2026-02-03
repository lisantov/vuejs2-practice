let app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        image: './assets/vmSocks-blue-onWhite.jpg',
        altText: 'A pair of socks',
        inStock: true,
        details: ['80% Cotton', '20% Polyester', 'Gender-neutral'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
            },
        ],
        cart: 0
    },
    methods: {
        addToCart() {
          this.cart++;
        },
        updateProduct(variantImage) {
            this.image = variantImage;
        }
    }
})
