function PizzaCart(){
    return{
        pizzas: [],
        username: '',
        cartId: '',
        cartPizzas: [],
        cartTotal: 0,
        cartData: {},
        showCart: false,
        paymentResponse: '',
        showPay: false,
        showCheckout: true,
        cartCount: 0,
        showContainer: false,
        showLogin: true,
        getPizzas(){
            axios.get("https://pizza-api.projectcodex.net/api/pizzas")
            .then((result) => {
                this.pizzas = result.data.pizzas;
            });
        },
        createCart(){
            if(localStorage.getItem('cartId')){
                this.cartId = localStorage.getItem('cartId');
            }
            else{
                const createCartUrl = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`;
                axios.get(createCartUrl)
                .then((result) => {
                    this.cartId = result.data.cart_code;
                    localStorage.setItem('cartId', this.cartId);
                });
            }
        },
        getCart(){
            const getCartUrl = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
            axios.get(getCartUrl)
            .then((result) => {
                this.cartPizzas = result.data.pizzas;
                this.cartTotal = result.data.total;
                if(this.cartTotal == 0){
                    this.showCart = false;
                }
            });
        },
        addPizzaToCart(id){
            axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                "cart_code" : this.cartId,
                "pizza_id" : id
            })
            .then(()=>{
                this.getCart();
                this.showCart = true;
                this.showPay = false;
            })
        },
        removePizzaFromCart(id){
            axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                "cart_code" : this.cartId,
                "pizza_id" : id
            })
            .then(()=>{
                this.getCart();
            })
        },
        pay(amount){
            axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay',            
            {
                "cart_code" : this.cartId,
                "amount" : amount
            })
            .then((result)=>{
                this.paymentResponse = result.data.message;
                if(result.data.status == "success"){
                    setTimeout(()=>{
                        this.cartPizzas = [];
                        this.cartTotal = 0;
                        this.cartId = '';
                        this.showCart =  false;
                        this.paymentResponse = '';
                        localStorage['cartId'] = '';
                        this.createCart();
                    }, 3000)
                }
                else{
                    setTimeout(()=> this.paymentResponse == '', 3000);
                }
            })
        },
        setCartCount(){
            this.cartCount = this.cartPizzas.length;
            return this.cartCount;
        },
        login(user){
            if(user.length > 3){
                localStorage.setItem('username', user);
                this.username = localStorage.getItem('username');
                this.showLogin = false;
                this.showContainer = true;
            }
            else{
                alert('Username too short!');
            }
        },
        init(){
            this.getPizzas();
            if(!this.cartId){
                this.createCart();
            }
            if(localStorage.getItem('username')){
                this.username = localStorage.getItem('username');
                this.showLogin = false;
                this.showContainer = true;
            }
            else{
                this.showLogin = true;
                this.showContainer = false;
            }
        },
    }
}

// ensure that AlpineJS is properly loaded
document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCart', PizzaCart);
});