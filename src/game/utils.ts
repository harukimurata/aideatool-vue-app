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
