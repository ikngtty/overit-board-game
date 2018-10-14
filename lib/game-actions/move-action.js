const LIB_PATH = '../'
const Helpers =
  require(LIB_PATH + 'common/helpers')
const RuleConsts =
  require(LIB_PATH + 'consts/rule-consts')
const GameActionTemplate =
  require(LIB_PATH + 'game-actions/game-action-template')
const GameValidationRules =
  require(LIB_PATH + 'game-rule-common/game-validation-rules')
const Board =
  require(LIB_PATH + 'game-states/board')
const BoardSquare =
  require(LIB_PATH + 'game-states/board-square')

class MoveAction extends GameActionTemplate {
  constructor (playerColor, squareFrom, squareTo) {
    super(playerColor)
    this._squareFrom = squareFrom
    this._squareTo = squareTo
  }
  get squareFrom () { return this._squareFrom }
  get squareTo () { return this._squareTo }

  static notationRegExpWithoutPlayer () {
    const squareFormat =
      Helpers.removeCaptureGroupNames(BoardSquare.notationRegExp()).source
    return new RegExp(`(?<from_sq>${squareFormat})(?<to_sq>${squareFormat})`)
  }

  static fromNotationAndPlayer (notation, playerColor) {
    if (!this.isValidNotationWithoutPlayer(notation)) {
      throw new Error('Invalid notation.')
    }
    const m = this.notationRegExpWithoutPlayer().exec(notation)
    const squareFrom = BoardSquare.fromNotation(m.groups.from_sq)
    const squareTo = BoardSquare.fromNotation(m.groups.to_sq)
    return new this(playerColor, squareFrom, squareTo)
  }

  toNotationWithoutPlayer () {
    const from = this.squareFrom.toNotation()
    const to = this.squareTo.toNotation()
    return `${from}${to}`
  }

  checkValidation (state) {
    const squareFromValid = this.squareFrom.checkValidation()
    if (!squareFromValid.isValid) { return squareFromValid }
    const squareToValid = this.squareTo.checkValidation()
    if (!squareToValid.isValid) { return squareToValid }
    return this.constructor.VALIDATION_RULES.check(state, this)
  }

  applyTo (state) {
    const boardMap = state.board.asMap()
    const tookCubeColor = boardMap.popItem(this.squareFrom.toNotation())
    boardMap.pushItem(this.squareTo.toNotation(), tookCubeColor)
    const board = new Board(boardMap)

    return this._applyNormalActionTo(state, board)
  }
}

const thisClass = MoveAction

thisClass.VALIDATION_RULES = new GameValidationRules(thisClass.name)
thisClass.VALIDATION_RULES.add(
  1,
  'Only next player can action.',
  (state, action) => {
    return state.nextPlayerColor === action.playerColor
  }
)
thisClass.VALIDATION_RULES.add(
  2,
  'Cannot pick a cube from an empty square.',
  (state, action) => {
    const boardMap = state.board.asMap()
    const tookCubeColor = boardMap.popItem(action.squareFrom.toNotation())
    return tookCubeColor != null
  }
)
thisClass.VALIDATION_RULES.add(
  3,
  'You can move your cube only.',
  (state, action) => {
    const boardMap = state.board.asMap()
    const tookCubeColor = boardMap.popItem(action.squareFrom.toNotation())
    return tookCubeColor === action.playerColor
  }
)
thisClass.VALIDATION_RULES.add(
  4,
  'A cube can move around a square only.',
  (state, action) => {
    return action.squareFrom.surround().some(s => s.equals(action.squareTo))
  }
)
thisClass.VALIDATION_RULES.add(
  5,
  `More than ${RuleConsts.HEIGHT} cubes cannot be put in the same square.`,
  (state, action) => {
    const boardMap = state.board.asMap()
    const cubesInSquareTo = boardMap.getArray(action.squareTo.toNotation())
    return cubesInSquareTo.length + 1 <= RuleConsts.HEIGHT
  }
)

module.exports = thisClass
