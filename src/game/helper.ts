/**
 * ディレイ処理
 * @param scene
 * @param duration
 * @returns
 */
export const delayPromise = (scene: Phaser.Scene, duration: number): Promise<void> => {
  return new Promise((resolve) => scene.time.delayedCall(duration, resolve))
}

/**
 * 配列をランダムに並び替え
 * @param array
 * @returns
 */
export function shuffleArray(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    // 0からiの間のランダムなインデックスを生成
    const j = Math.floor(Math.random() * (i + 1))
    // 要素を交換
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
