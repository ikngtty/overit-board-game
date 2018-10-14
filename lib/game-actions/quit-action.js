const LIB_PATH = '../'
const GameActionTemplate =
  require(LIB_PATH + 'game-actions/game-action-template')
const GameState =
  require(LIB_PATH + 'game-states/game-state')

class QuitAction extends GameActionTemplate {
  static notationRegExpWithoutPlayer () {
    return /quit/
  }

  static fromNotationAndPlayer (notation, playerColor) {
    if (!this.isValidNotationWithoutPlayer(notation)) {
      throw new Error('Invalid notation.')
    }
    return new this(playerColor)
  }

  toNotationWithoutPlayer () {
    return 'quit'
  }

  checkValidation () {
    return {
      isValid: true,
      ruleId: null,
      description: null
    }
  }

  applyTo (state) {
    return new GameState(
      state.board,
      state.nextPlayerColor,
      state.repetitionCount,
      state.stateHistory,
      state.resignedPlayerColor,
      true
    )
  }
}

module.exports = QuitAction
