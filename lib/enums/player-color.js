const LIB_PATH = '../'
const Helpers =
  require(LIB_PATH + 'common/helpers')
const RuleConsts =
  require(LIB_PATH + 'consts/rule-consts')

class PlayerColor {
  constructor (str) {
    this._str = str
  }

  toString () {
    return this._str
  }
}

const black = new PlayerColor('black')
black.next = () => PlayerColor.WHITE
black.GOAL_ROW = RuleConsts.ROW_COUNT - 1
PlayerColor.BLACK = black

const white = new PlayerColor('white')
white.next = () => PlayerColor.BLACK
white.GOAL_ROW = 0
PlayerColor.WHITE = white

PlayerColor.ALL = [black, white]

const colorCharPairs = [[black, 'B'], [white, 'W']]
const colorCharTable = new Map(colorCharPairs)
const charColorPairs = colorCharPairs.map(pair => Helpers.reverse(pair))
const charColorTable = new Map(charColorPairs)
PlayerColor.prototype.toChar = function () {
  return colorCharTable.get(this)
}
PlayerColor.fromChar = (char) => {
  if (!charColorTable.has(char)) {
    throw new Error('Cannot convert the char to a player color.')
  }
  return charColorTable.get(char)
}

const allChars = colorCharPairs.map(([, char]) => char)
PlayerColor.CHAR_FORMAT = `[${allChars.join()}]`

module.exports = PlayerColor
