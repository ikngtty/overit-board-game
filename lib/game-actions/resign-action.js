const LIB_PATH = '../'
const GameActionTemplate =
  require(LIB_PATH + 'game-actions/game-action-template')
const GameState =
  require(LIB_PATH + 'game-states/game-state')

class ResignAction extends GameActionTemplate {
  static notationRegExpWithoutPlayer () {
    return /resign/
  }

  static fromNotationAndPlayer (notation, playerColor) {
    if (!this.isValidNotationWithoutPlayer(notation)) {
      throw new Error('Invalid notation.')
    }
    return new this(playerColor)
  }

  toNotationWithoutPlayer () {
    return 'resign'
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
      this.playerColor,
      state.aborted
    )
  }
}

module.exports = ResignAction
