export default class GameStep {
  private static instance: GameStep

  private steps: string[]
  private lastStep: number
  private currentStep: number

  constructor(steps: string[]) {
    this.steps = steps
    this.currentStep = 0
    this.lastStep = steps.length - 1

    GameStep.instance = this
  }

  // シングルトンの取得
  // ほかのクラスでも同じインスタンスを使いたい場合はこれを使う
  public static getInstance(): GameStep {
    if (!this.instance) {
      this.instance = new GameStep(['INIT', 'MAIN', 'END'])
    }
    return this.instance
  }

  // 次のステップへ進む
  public nextStep(): void {
    if (this.currentStep < this.lastStep) {
      this.currentStep++
    }
  }

  // 指定したステップ名にジャンプする
  public jumpStep(stepName: string): void {
    if (this.steps.includes(stepName)) {
      this.currentStep = this.steps.indexOf(stepName)
    }
  }

  // ステップを初期化（最初のステップに戻る）
  public initStep(): void {
    this.currentStep = 0
  }

  // 現在のステップを取得
  public getCurrentStep(): number {
    return this.currentStep
  }

  // ステップ名からステップ番号を取得
  public getNameStep(stepName: string): number {
    return this.steps.indexOf(stepName)
  }
}
