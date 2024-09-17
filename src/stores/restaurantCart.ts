import { defineStore } from 'pinia'
import { type RestaurantCart } from '@/interface/Restaurant'

export const useRestaurantCartStore = defineStore({
  id: 'restaurantCart',
  state: () => ({
    cartList: [] as RestaurantCart[]
  }),
  getters: {
    items: (state): Array<RestaurantCart> => {
      return state.cartList
    }
  },
  actions: {
    addItem(addProduct: RestaurantCart) {
      const findIndex = this.cartList.findIndex((cart) => cart.product.id == addProduct.product.id)
      if (findIndex !== -1) {
        this.cartList[findIndex].num += addProduct.num
      } else {
        this.cartList.push(addProduct)
      }
    },

    deleteAllItem() {
      this.cartList = []
    }
  }
})
