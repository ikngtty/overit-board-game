const LIB_PATH = '../'
const MoveAction = require(LIB_PATH + 'game-actions/move-action')
const QuitAction = require(LIB_PATH + 'game-actions/quit-action')
const ResignAction = require(LIB_PATH + 'game-actions/resign-action')

class GameActionFactory {
  static fromNotationAndPlayer (notation, playerColor) {
    for (const actionClass of this.AVAILABLE_ACTIONS) {
      if (actionClass.isValidNotationWithoutPlayer(notation)) {
        return actionClass.fromNotationAndPlayer(notation, playerColor)
      }
    }
    return null
  }
}

const thisClass = GameActionFactory

thisClass.AVAILABLE_ACTIONS = [
  MoveAction,
  QuitAction,
  ResignAction
]

module.exports = thisClass
