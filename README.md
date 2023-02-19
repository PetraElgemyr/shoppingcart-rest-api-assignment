# Routes

## Shoppingcart

getAllShoppingcarts: http://localhost:4000/api/v1/shoppingcarts
getShoppingcartById: http://localhost:4000/api/v1/shoppingcarts/:cartId
createNewShoppingcart: http://localhost:4000/api/v1/shoppingcarts
emptyShoppingcart: http://localhost:4000/api/v1/shoppingcarts/:cartId
deleteShoppingcartById: http://localhost:4000/api/v1/shoppingcarts/:cartId

## Products

getAllProducts: http://localhost:4000/api/v1/products
getProductById: http://localhost:4000/api/v1/products/:productId
addProductToShoppingcart: http://localhost:4000/api/v1/products/:productId
deleteProductInShoppingcart: http://localhost:4000/api/v1/products/:productId
reduceProductAmountFromShoppingcart: http://localhost:4000/api/v1/products/:productId
