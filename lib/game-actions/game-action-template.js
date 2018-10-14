const LIB_PATH = '../'
const PlayerColor =
  require(LIB_PATH + 'enums/player-color')
const GameState =
  require(LIB_PATH + 'game-states/game-state')

class GameActionTemplate {
  constructor (playerColor) {
    this._playerColor = playerColor
  }
  get playerColor () { return this._playerColor }

  static notationRegExp () {
    const colorFormat = PlayerColor.CHAR_FORMAT
    const mainFormat = this.notationRegExpWithoutPlayer().source

    return new RegExp(`(?<color>${colorFormat}):(?<main>${mainFormat})`)
  }
  static notationRegExpWithoutPlayer () { throw new Error('Not implemented.') }

  static isValidNotation (notation) {
    const reg = new RegExp(`^${this.notationRegExp().source}$`)
    return reg.test(notation)
  }
  static isValidNotationWithoutPlayer (notation) {
    const reg = new RegExp(`^${this.notationRegExpWithoutPlayer().source}$`)
    return reg.test(notation)
  }

  static fromNotation (notation) {
    if (!this.isValidNotation(notation)) {
      throw new Error('Invalid notation.')
    }
    const m = this.notationRegExp().exec(notation)
    const playerColor = PlayerColor.fromChar(m.groups.color)
    return this.fromNotationAndPlayer(m.groups.main, playerColor)
  }
  static fromNotationAndPlayer (notation, playerColor) {
    throw new Error('Not implemented.')
  }

  toNotation () {
    const color = this.playerColor.toChar()
    const main = this.toNotationWithoutPlayer()
    return `${color}:${main}`
  }
  toNotationWithoutPlayer () { throw new Error('Not implemented.') }

  checkValidation (state) { throw new Error('Not implemented.') }
  applyTo (state) { throw new Error('Not implemented.') }
  equals (other) {
    if (other == null || other.toNotation == null) { return false }
    return this.toNotation() === other.toNotation()
  }

  _applyNormalActionTo (state, newBoard) {
    const nextPlayerColor = state.nextPlayerColor.next()

    const repetitionCount =
      state.stateHistory.filter(
        state => state.isSameSituation(newBoard, nextPlayerColor)
      ).length + 1

    const stateHistory = state.stateHistory
    stateHistory.push(state)

    return new GameState(
      newBoard,
      nextPlayerColor,
      repetitionCount,
      stateHistory
    )
  }
}

module.exports = GameActionTemplate
