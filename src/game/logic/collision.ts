/**
 * 3Dボックス同士の衝突判定
 * @param box1
 * @param box2
 * @returns collision: 当たり判定
  distance: 3D距離
  distanceX: 的の中心からのX距離
  distanceY: 的の中心からのY距離
  distanceZ: 的の中心からのZ距離
 */
export function is3DBoxCollision(
  box1: { x: number; y: number; z: number; width: number; height: number; depth: number },
  box2: { x: number; y: number; z: number; width: number; height: number; depth: number }
): {
  collision: boolean
  distance: number
  distanceX: number
  distanceY: number
  distanceZ: number
} {
  // 衝突判定
  const collision =
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y &&
    box1.z < box2.z + box2.depth &&
    box1.z + box1.depth > box2.z

  // 中心座標
  const c1x = box1.x + box1.width / 2
  const c1y = box1.y + box1.height / 2
  const c1z = box1.z + box1.depth / 2

  const c2x = box2.x + box2.width / 2
  const c2y = box2.y + box2.height / 2
  const c2z = box2.z + box2.depth / 2

  // 軸ごとの距離（中心間距離）
  const distanceX = c1x - c2x
  const distanceY = c1y - c2y
  const distanceZ = c1z - c2z

  // 3D 距離
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2 + distanceZ ** 2)

  return {
    collision,
    distance,
    distanceX,
    distanceY,
    distanceZ
  }
}
