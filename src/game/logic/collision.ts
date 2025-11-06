/**
 * 3Dボックス同士の衝突判定
 * @param box1
 * @param box2
 * @returns
 */
export function is3DBoxCollision(
  box1: { x: number; y: number; z: number; width: number; height: number; depth: number },
  box2: { x: number; y: number; z: number; width: number; height: number; depth: number }
): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y &&
    box1.z < box2.z + box2.depth &&
    box1.z + box1.depth > box2.z
  )
}
