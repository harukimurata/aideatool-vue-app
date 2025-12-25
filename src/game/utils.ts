/**
 * 数字の合計が偶数か奇数かbooleanで返す
 * trueが偶数、falseが奇数
 * @param number1
 * @param number2
 * @param number3
 * @returns
 */
export function isEvenNumber(number1: number, number2: number, number3: number): boolean {
  const num = number1 + number2 + number3
  return num % 2 == 0
}

/**
 * min ~ maxの間で整数を1つランダムに返す
 * @param n int
 * @returns
 */
export function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * min ~ maxの間で小数点付きの数を1つランダムに返す
 * @param n float
 * @returns
 */
export function generateRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * n分の1の確率でtrueを返す
 * @param n
 * @returns
 */
export function oneInNChance(n: number) {
  return Math.random() < 1 / n
}
