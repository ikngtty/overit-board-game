const LIB_PATH = '../'
const RuleConsts =
  require(LIB_PATH + 'consts/rule-consts')
const GameResult =
  require(LIB_PATH + 'enums/game-result')
const PlayerColor =
  require(LIB_PATH + 'enums/player-color')
const GameResultRules =
  require(LIB_PATH + 'game-rule-common/game-result-rules')
const BoardSquare =
  require(LIB_PATH + 'game-states/board-square')
const Board =
  require(LIB_PATH + 'game-states/board')

class GameState {
  constructor (
    board,
    nextPlayerColor,
    repetitionCount = 1,
    stateHistory = [],
    resignedPlayerColor = null,
    aborted = false
  ) {
    this._board = board
    this._nextPlayerColor = nextPlayerColor
    this._repetitionCount = repetitionCount
    this._stateHistory = stateHistory
    this._resignedPlayerColor = resignedPlayerColor
    this._aborted = aborted
  }
  get board () { return this._board }
  get nextPlayerColor () { return this._nextPlayerColor }
  get repetitionCount () { return this._repetitionCount }
  get stateHistory () {
    // Copy not to change the original value. (cf. defensive programming)
    return Array.from(this._stateHistory)
  }
  get resignedPlayerColor () { return this._resignedPlayerColor }
  get aborted () { return this._aborted }

  checkResult () {
    return this.constructor.RESULT_RULES.check(this)
  }

  static initial () {
    const board = Board.fromNotation(
      'B[a1, b1, c1, d1, e1], W[a6, b6, c6, d6, e6]'
    )
    const nextPlayerColor = PlayerColor.BLACK
    return new this(board, nextPlayerColor)
  }

  isSameSituation (board, nextPlayerColor) {
    return this.nextPlayerColor === nextPlayerColor &&
      this.board.equals(board)
  }
}

const thisClass = GameState

thisClass.RESULT_RULES = new GameResultRules()
thisClass.RESULT_RULES.add(
  1,
  'Abortion.',
  state => {
    if (state.aborted) {
      return {
        result: GameResult.ABORTED
      }
    }

    return null
  }
)
thisClass.RESULT_RULES.add(
  2,
  'Resignation.',
  state => {
    if (state.resignedPlayerColor) {
      return {
        result: GameResult.WIN_OR_LOSE,
        winner: state.resignedPlayerColor.next()
      }
    }

    return null
  }
)
thisClass.RESULT_RULES.add(
  3,
  'Goal.',
  state => {
    const map = state.board.asMap()
    const playerColor = state.nextPlayerColor
    for (let column = 0; column < RuleConsts.COLUMN_COUNT; column++) {
      const goalSquare = new BoardSquare(column, playerColor.GOAL_ROW)
      if (map.popItem(goalSquare.toNotation()) === playerColor) {
        return {
          result: GameResult.WIN_OR_LOSE,
          winner: playerColor
        }
      }
    }

    return null
  }
)
thisClass.RESULT_RULES.add(
  4,
  'No movable cubes.',
  state => {
    const map = state.board.asMap()
    const playerColor = state.nextPlayerColor
    if (map.toArray().every(
      ([, cubePositions]) => cubePositions.pop() !== playerColor)
    ) {
      return {
        result: GameResult.WIN_OR_LOSE,
        winner: playerColor.next()
      }
    }

    return null
  }
)
thisClass.RESULT_RULES.add(
  5,
  'Repetition.',
  state => {
    if (state.repetitionCount >= RuleConsts.DRAW_REPETITION) {
      return {
        result: GameResult.DRAW
      }
    }

    return null
  }
)

module.exports = thisClass
