const LIB_PATH = '../'
const Helpers =
  require(LIB_PATH + 'common/helpers')
const RuleConsts =
  require(LIB_PATH + 'consts/rule-consts')
const GameValidationRules =
  require(LIB_PATH + 'game-rule-common/game-validation-rules')
const BoardSquare =
  require(LIB_PATH + 'game-states/board-square')

class CubePosition {
  constructor (square, height = 0) {
    this._square = square
    this._height = height
  }
  get square () { return this._square }
  get height () { return this._height }

  static notationRegExp () {
    const squareFormat =
      Helpers.removeCaptureGroupNames(BoardSquare.notationRegExp()).source
    const heightFormat = `\\+{0,${RuleConsts.HEIGHT - 1}}`
    return new RegExp(
      `(?<square>${squareFormat})(?<height>${heightFormat})`
    )
  }

  static isValidNotation (notation) {
    const reg = new RegExp(`^${this.notationRegExp().source}$`)
    return reg.test(notation)
  }

  static fromNotation (notation) {
    if (!this.isValidNotation(notation)) {
      throw new Error('Invalid notation.')
    }
    const m = this.notationRegExp().exec(notation)
    const square = BoardSquare.fromNotation(m.groups.square)
    const height = m.groups.height.length
    return new this(square, height)
  }

  toNotation () {
    const square = this.square.toNotation()
    const height = '+'.repeat(this.height)
    return `${square}${height}`
  }

  checkValidation () {
    const squareValid = this.square.checkValidation()
    if (!squareValid.isValid) {
      return squareValid
    }
    return this.constructor.VALIDATION_RULES.check(this)
  }

  valueOf () {
    return this.square.valueOf() * RuleConsts.HEIGHT + this.height
  }

  equals (other) {
    if (other == null || other.toNotation == null) { return false }
    return this.toNotation() === other.toNotation()
  }
}

const thisClass = CubePosition

thisClass.VALIDATION_RULES = new GameValidationRules(thisClass.name)
thisClass.VALIDATION_RULES.add(
  1,
  `A height must be between 0 and ${RuleConsts.HEIGHT - 1}.`,
  state => state.height >= 0 && state.height < RuleConsts.HEIGHT
)

module.exports = thisClass
