export interface HumanNameUpdateRequest {
  name: string
}

export interface HumanNameResponse {
  name: string
}

export interface HumanAgeUpdateRequest {
  age: number
}

export interface HumanAgeResponse {
  age: number
}

export interface HumanStatusRequest {
  command: number
}

export interface HumanStatusResponse {
  body: number
  mental: number
}

export interface HumanFullResponse {
  name: string
  age: number
  body: number
  mental: number
}

export const COMMAND = {
  HARDHIT: 1,
  HIT: 2,
  CURE: 3,
  HEAL: 4,
  NAME_SEND: 5,
  AGE_SEND: 6
}
