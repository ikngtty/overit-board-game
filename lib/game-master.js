const EventEmitter = require('events')

const LIB_PATH = './'
const PlayerColor =
  require(LIB_PATH + 'enums/player-color')
const GameState =
  require(LIB_PATH + 'game-states/game-state')

class GameMaster extends EventEmitter {
  constructor (blackPlayer, whitePlayer) {
    super()
    this._players = new Map()
    this._players.set(PlayerColor.BLACK, blackPlayer)
    this._players.set(PlayerColor.WHITE, whitePlayer)
  }

  startGame (state = GameState.initial()) {
    const result = state.checkResult()
    if (result) {
      this.emit('gameend', result, state)
      return
    }

    const nextPlayer = this._players.get(state.nextPlayerColor)
    nextPlayer.play(state).then(action => {
      const nextState = action.applyTo(state)
      this.startGame(nextState)
    })
  }
}

module.exports = GameMaster
