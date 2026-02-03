let app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        brand: 'Vue Mastery',
        altText: 'A pair of socks',
        details: ['80% Cotton', '20% Polyester', 'Gender-neutral'],
        selectedVariant: 0,
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 0,
                onSale: false,
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 10,
                onSale: true,
            },
        ],
        cart: 0
    },
    computed: {
        title() {
            return `${this.product} ${this.brand}`;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            return this.variants[this.selectedVariant].onSale && this.inStock
                ? `Распродажа ${this.title}! Осталось всего ${this.variants[this.selectedVariant].variantQuantity}`
                : '';
        }
    },
    methods: {
        addToCart() {
          this.cart++;
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    }
})
