let eventBus = new Vue()

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
     <p>
       <label for="name">Name:</label>
       <input id="name" v-model="name" placeholder="name">
     </p>
     <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review"></textarea>
     </p>
     <p>
       <label for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
         <option>5</option>
         <option>4</option>
         <option>3</option>
         <option>2</option>
         <option>1</option>
       </select>
     </p>
     <p>
       <input type="submit" value="Submit">
     </p>
     <p v-if="errors.length">
         <b>Please correct the following error(s):</b>
         <ul>
           <li v-for="error in errors">{{ error }}</li>
         </ul>
    </p>
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
});

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText">
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In stock</p>
            <p v-else>Out of Stock</p>
            <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
            ></div>
            <button
                @click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
            >
                Add to cart
            </button>
            
            <product-tabs :reviews="reviews" :details="details" :shipping="shipping"></product-tabs>
        </div>
    </div>
    `,
    data() {
        return {
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
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 10,
                },
            ],
            reviews: []
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
    methods: {
        addToCart() {
            eventBus.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
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
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
});

Vue.component('product-review-list', {
    props: {
      reviews: {
          type: Array,
          required: true
      },
    },
    template: `
        <div>
            <select name="filter" v-model.number="currentFilter">
                <option v-for="(option, index) in filterOptions" :key="index" :value="option">{{ option ? option : 'Не важно' }}</option>
            </select>
            <p v-if="!filteredReviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in filteredReviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
    `,
    data() {
        return {
            currentFilter: null,
            filterOptions: [null, 1, 2, 3, 4, 5]
        }
    },
    computed: {
        filteredReviews() {
            if (this.currentFilter) {
                return this.reviews.filter(r => r.rating === this.currentFilter);
            }
            return this.reviews
        }
    }

})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>   
            <ul>
                <span class="tab"
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab, index) in tabs"
                    @click="selectedTab = tab"
                >{{ tab }}</span>
            </ul>
            <div v-show="selectedTab === 'Reviews'">
                <product-review-list :reviews="reviews"></product-review-list>
            </div>
            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>
            <div v-show="selectedTab === 'Shipping'">
                <p>Shipping: {{ shipping }}</p>
            </div>
            <div v-show="selectedTab === 'Details'">
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews',
        }
    },
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    mounted() {
        eventBus.$on('add-to-cart', id => {
            this.cart.push(id)
        })
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
    }
})