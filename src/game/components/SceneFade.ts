const FADE_TIME = 800

/**
 * フェードイン処理
 * @param scene
 * @param startFunc
 * @param callbackFunc
 */
export function fadeIn(scene: Phaser.Scene, startFunc?: Function, callbackFunc?: Function) {
  if (startFunc != null) {
    startFunc()
  }

  scene.cameras.main.fadeIn(FADE_TIME, 0, 0, 0)
  scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
    if (callbackFunc != null) {
      callbackFunc()
    }
  })
}

/**
 * フェードアウト処理
 * @param scene
 * @param startFunc
 * @param callbackFunc
 */
export function fadeOut(scene: Phaser.Scene, startFunc: Function | null, callbackFunc?: Function) {
  if (startFunc != null) {
    startFunc()
  }

  scene.cameras.main.fadeOut(FADE_TIME, 0, 0, 0)
  scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
    if (callbackFunc != null) {
      callbackFunc()
    }
  })
}
