const LIB_PATH = '../'
const Helpers =
  require(LIB_PATH + 'common/helpers')
const RuleConsts =
  require(LIB_PATH + 'consts/rule-consts')
const GameValidationRules =
  require(LIB_PATH + 'game-rule-common/game-validation-rules')

class BoardSquare {
  constructor (column, row) {
    this._column = column
    this._row = row
  }
  get column () { return this._column }
  get row () { return this._row }

  static columnCharToNum (char) {
    return this.COLUMN_CHAR_NUM_TABLE.get(char)
  }

  static columnNumToChar (num) {
    return this.COLUMN_NUM_CHAR_TABLE.get(num)
  }

  static rowCharToNum (char) {
    return Number(char) - 1
  }

  static rowNumToChar (num) {
    return (num + 1).toString()
  }

  static notationRegExp () {
    const columnCharFormat =
      `[${this.FIRST_COLUMN_CHAR}-${this.LAST_COLUMN_CHAR}]`
    const rowCharFormat = `[1-${RuleConsts.ROW_COUNT}]`
    return new RegExp(
      `(?<column>${columnCharFormat})(?<row>${rowCharFormat})`
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
    const column = this.columnCharToNum(m.groups.column)
    const row = this.rowCharToNum(m.groups.row)
    return new this(column, row)
  }

  toNotation () {
    const columnChar = this.constructor.columnNumToChar(this.column)
    const rowChar = this.constructor.rowNumToChar(this.row)
    return `${columnChar}${rowChar}`
  }

  checkValidation () {
    return this.constructor.VALIDATION_RULES.check(this)
  }

  valueOf () {
    return this.column * RuleConsts.ROW_COUNT + this.row
  }

  equals (other) {
    if (other == null || other.toNotation == null) { return false }
    return this.toNotation() === other.toNotation()
  }

  move (rightDelta, topDelta) {
    return new this.constructor(this.column + rightDelta, this.row + topDelta)
  }

  surround () {
    const deltas = [
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0]
    ]
    return deltas
      .map(delta => this.move(delta[0], delta[1]))
      .filter(point => point.checkValidation().isValid)
  }
}

const thisClass = BoardSquare

thisClass.FIRST_COLUMN_CHAR = 'a'
const firstCharCode = thisClass.FIRST_COLUMN_CHAR.charCodeAt()
const columnNumCharPairs = Helpers.range(RuleConsts.COLUMN_COUNT - 1).map(
  num => [num, String.fromCodePoint(firstCharCode + num)]
)
thisClass.COLUMN_NUM_CHAR_TABLE = new Map(columnNumCharPairs)
const columnCharNumPairs =
  columnNumCharPairs.map(pair => Helpers.reverse(pair))
thisClass.COLUMN_CHAR_NUM_TABLE = new Map(columnCharNumPairs)
thisClass.LAST_COLUMN_CHAR = Helpers.last(columnNumCharPairs)[1]

thisClass.VALIDATION_RULES = new GameValidationRules(thisClass.name)
thisClass.VALIDATION_RULES.add(
  1,
  `A square position must be within ${RuleConsts.COLUMN_COUNT}×` +
  `${RuleConsts.ROW_COUNT} board.`,
  state => {
    return state.column >= 0 && state.column < RuleConsts.COLUMN_COUNT &&
           state.row >= 0 && state.row < RuleConsts.ROW_COUNT
  }
)

module.exports = thisClass
