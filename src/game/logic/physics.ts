const GRAVITY = 9.8 // m/s^2
const STEP_TIME = 0.001 // 計算刻み時間 s

// 状態を保持する構造体
export interface ArrowState {
  z: number // 飛距離 [m]
  x: number // 水平距離 [m]
  y: number // 高度 [m]
  vz: number // 飛距離速度 [m/s]
  vx: number // 水平距離速度 [m/s]
  vy: number // 鉛直方向速度 [m/s]
}

export interface MoveState {
  z: number // 前後移動距離 [m]
  x: number // 左右移動距離 [m]
  y: number // 上下移動距離 [m]
}

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
 * @param d 弓を引いた距離
 * @returns
 */
export function arrowElasticity(k: number, d: number): number {
  return (1 / 2) * k * d * d
}

/**
 * 矢の初速度の算出 sqrt(eta*k*d^2/m)
 * @param k ばね定数
 * @param d 弓を引いた距離
 * @param m 矢の重さ
 * @param eta エネルギー変換効率（0 < eta ≤ 1）
 * @returns
 */
export function arrowInitialVelocity(k: number, d: number, m: number, eta: number = 1.0): number {
  return Math.sqrt((2 * eta * arrowElasticity(k, d)) / m)
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
  return (v_0 * v_0 * Math.sin(2 * theta)) / GRAVITY
}

/**
 * 空気抵抗の算出
 * @param cd // 空気抵抗係数
 * @param csa // 断面積
 * @param ad // 空気の密度
 * @param v // 速度
 * @returns
 */
export function airResistance(cd: number, csa: number, ad: number, v: number): number {
  return 0.5 * cd * ad * csa * v * v
}

/**
 * 抗力による加速度の算出
 * @param Fd // 抗力
 * @param m // 質量
 * @param d // 速度成分(方向)
 * @param v // 速度の大きさ
 * @returns
 */
export function resistanceAcceleration(Fd: number, m: number, d: number, v: number): number {
  return -(Fd / m) * (d / v)
}

/**
 * 空気抵抗を考慮した矢の飛行状態の1ステップ進行
 * @param state // 矢の状態
 * @param m // 矢の質量
 * @param cd // 空気抵抗係数
 * @param csa // 断面積
 * @param ad // 空気の密度
 * @param dt // 刻み時間
 * @returns
 */
export function stepAirResistanceArrowFlight(
  state: ArrowState,
  m: number,
  cd: number,
  csa: number,
  ad: number,
  dt: number = STEP_TIME
): ArrowState {
  const { z, y, x, vz, vx, vy } = state

  const v = Math.sqrt(vx * vx + vy * vy + vz * vz) // 速度の大きさ

  const Fd = airResistance(cd, csa, ad, v) // 空気抵抗
  const az = resistanceAcceleration(Fd, m, vz, v) // 抗力によるz方向加速度
  const ax = resistanceAcceleration(Fd, m, vx, v) // 抗力によるx方向加速度
  const ay = resistanceAcceleration(Fd, m, vy, v) - GRAVITY // 抗力＋重力によるy方向加速度

  // 次ステップの速度と位置
  const newVz = vz + az * dt
  const newVx = vx + ax * dt
  const newVy = vy + ay * dt
  const newZ = z + newVz * dt
  const newX = x + newVx * dt
  const newY = y + newVy * dt

  const clampedY = Math.max(0, newY)
  const finalVy = clampedY === 0 ? 0 : newVy
  return {
    z: newZ,
    x: newX,
    y: clampedY,
    vz: newVz,
    vx: newVx,
    vy: finalVy
  }
}
