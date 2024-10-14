export const delayPromise = (scene: Phaser.Scene, duration: number): Promise<void> => {
  return new Promise((resolve) => scene.time.delayedCall(duration, resolve))
}
