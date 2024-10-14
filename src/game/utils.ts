import { slotHands } from './const/SlotHand'

/**
 * slotの役を返す
 * @param number1
 * @param number2
 * @param number3
 * @returns
 */
export function calcSlotHand(number1: number, number2: number, number3: number): number {
  let addCoin = 0
  for (let i = 0; i < slotHands.length; i++) {
    if (
      slotHands[i].Number1 == number1 &&
      slotHands[i].Number2 == number2 &&
      slotHands[i].Number3 == number3
    ) {
      addCoin = slotHands[i].value
    }
  }

  return addCoin
}
