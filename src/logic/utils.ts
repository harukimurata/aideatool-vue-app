/**
 * 文字数を制限する
 * @param value
 * @param max
 * @returns
 */
export function isLength(value: string | null, max: number) {
  if (!value) {
    return
  }
  if (value.length > max) {
    return
  }
}

/**
 * 現在日時取得
 * @returns year年month月date日hour:min:sec
 */
export function currentTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const hour = now.getHours()
  const min = now.getMinutes()
  const sec = now.getSeconds()

  return year + '年' + month + '月' + date + '日' + hour + ':' + min + ':' + sec
}
