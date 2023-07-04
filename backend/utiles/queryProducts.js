
class queryProducts {
    products = []
    query = {}

    constructor(products, query) {
        this.products = products
        this.query = query
    }
    categoryQuery = () => {
        this.products = this.query.category ? this.products.filter(c => c.category === this.query.category) : this.products
        return this
    }
    ratingQuery = () => {
        this.products = this.query.rating ? this.products.filter(c => parseInt(this.query.rating) <= c.rating && c.rating < parseInt(this.query.rating) + 1) : this.products
        return this
    }
    priceQuery = () => {
        this.products = this.products.filter(c => c.price >= this.query.lowPrice && c.price <= this.query.highPrice)
        return this
    }
    searchQuery = () => {
        this.products = this.query.searchValue ? this.products.filter(p => p.name.toUpperCase().indexOf(this.query.searchValue.toUpperCase()) > -1) : this.products
        return this
    }
    sortByPrice = () => {
        if (this.query.sortPrice) {
            if (this.query.sortPrice === 'low-to-high') {
                this.products = this.products.sort(function (a, b) {
                    return a.price - b.price
                })
            } else {
                this.products = this.products.sort(function (a, b) {
                    return b.price - a.price
                })
            }
        }
        return this
    }
}


module.exports = queryProducts