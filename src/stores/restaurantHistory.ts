import { defineStore } from 'pinia'
import { type RestaurantCart } from '@/interface/Restaurant'

export const useRestaurantHistoryStore = defineStore({
  id: 'restaurantHistory',
  state: () => ({
    historyArray: [] as RestaurantCart[],
    cashArray: [] as RestaurantCart[]
  }),
  getters: {
    historyList: (state): Array<RestaurantCart> => {
      return state.historyArray
    },
    cashList: (state): Array<RestaurantCart> => {
      return state.cashArray
    }
  },
  actions: {
    addHistoryItem(cartList: RestaurantCart[]) {
      cartList.forEach((cart) => {
        this.historyArray.push(cart)
      })
    },

    addCashItem(cartList: RestaurantCart[]) {
      cartList.forEach((cart) => {
        const findIndex = this.cashArray.findIndex((cash) => cash.product.id == cart.product.id)
        if (findIndex !== -1) {
          this.cashArray[findIndex].num += cart.num
        } else {
          this.cashArray.push(cart)
        }
      })
    },

    deleteAllItem() {
      this.historyArray = []
      this.cashArray = []
    }
  }
})
