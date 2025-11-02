const GRAVITY = 9.8 // m/s^2

/**
 * 加速度の算出 v2-v1/time
 * @param v1 初速度
 * @param v2 最終速度
 * @param time 時間
 * @returns
 */
export function acceleration(v1: number, v2: number, time: number): number {
  return (v2 - v1) / time
}

/**
 * 減速度の算出 v1-v2/time
 * @param v1 初速度
 * @param v2 最終速度
 * @param time 時間
 * @returns
 */
export function deceleration(v1: number, v2: number, time: number): number {
  return (v1 - v2) / time
}

/**
 * 弓の弾性エネルギーの算出 1/2*k*x^2
 * @param k ばね定数
 * @param x 弓を引いた距離
 * @returns
 */
export function arrowElasticity(k: number, x: number): number {
  return (1 / 2) * k * x * x
}

/**
 * 矢の初速度の算出 sqrt(eta*k*x^2/m)
 * @param k ばね定数
 * @param x 弓を引いた距離
 * @param m 矢の重さ
 * @param eta エネルギー変換効率（0 < eta ≤ 1）
 * @returns
 */
export function arrowInitialVelocity(k: number, x: number, m: number, eta: number = 1.0): number {
  return Math.sqrt((2 * eta * arrowElasticity(k, x)) / m)
}

/**
 * 矢の飛距離の算出 (v_0^2*sin2θ)/g
 * @param k ばね定数
 * @param x 弓を引いた距離
 * @param m 弓矢の重さ
 * @param thetaDeg 発射時の角度
 * @returns
 */
export function arrowFlightDistance(k: number, x: number, m: number, thetaDeg: number): number {
  const v_0 = arrowInitialVelocity(k, x, m)
  const theta = (thetaDeg * Math.PI) / 180
  return (v_0 * v_0 * theta) / GRAVITY
}
