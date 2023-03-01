export const addItem = (item, redirectToCart) => {
  let cart = [];

  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'))
    }
    cart.push({ ...item, count: 1 })

    const uniqueIds = new Set(cart.map(p => p._id))
    const uniqueIdArray = Array.from(uniqueIds)

    // return all unique products to cart
    cart = uniqueIdArray.map(id => {
      return cart.find(p => p._id === id)
    })

    localStorage.setItem("cart", JSON.stringify(cart))
    redirectToCart();
  }
}
export const totalNumberOfCartItems = () => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem("cart")) {
      console.log("cart item is ", localStorage.getItem("cart").length)
      return JSON.parse(localStorage.getItem("cart")).length;
    } else {
      console.log("cart item is 0")
      return 0;
    }
  }
}
export const getCartItems = () => {
  // console.log("getCartItems")
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
  return [];
}
export const updateItems = (productId, count) => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
      cart.map((p, i) => {
        if (p._id === productId) {
          cart[i].count = count;
        }
      })
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }
}
export const removeItem = (productId) => {
  console.log("removeItem triggered")
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.map((p, i) => {
      if (p._id === productId) {
        cart.splice(i, 1);
      }
    })
    localStorage.setItem("cart", JSON.stringify(cart))
  }
  console.log("removeItem is finished")
  return cart;
}
export const totalCartPrice = () => {
  let total = 0;
  let products = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      products = JSON.parse(localStorage.getItem("cart"))
      total = products.reduce((currentVal, nextVal) => {
        return currentVal + nextVal.count * nextVal.price
      }, 0)
    }
  }
  return total;
}
export const emptyCart = () => {
  console.log("emptyCart triggered")
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart")
  }
}