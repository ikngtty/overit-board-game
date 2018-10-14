const LIB_PATH = '../'
const Helpers =
  require(LIB_PATH + 'common/helpers')
const PlayerColor =
  require(LIB_PATH + 'enums/player-color')
const GameActionFactory =
  require(LIB_PATH + 'game-actions/game-action-factory')
const BoardSquare =
  require(LIB_PATH + 'game-states/board-square')
const CubePosition =
  require(LIB_PATH + 'game-states/cube-position')
const PlayerBase =
  require(LIB_PATH + 'players/player-base')

class CliPlayer extends PlayerBase {
  constructor (color, readlineInterface) {
    super()
    this._color = color
    this._rl = readlineInterface
  }

  play (state) {
    return new Promise(resolve => this._ask(state, resolve))
  }

  get _ask () { return this.__ask.bind(this) }
  __ask (state, resolve) {
    this._displayBoard(state.board)
    const color = Helpers.capitalize(this._color.toString())
    this._rl.question(`${color} to play. > `, answer => {
      const action =
        GameActionFactory.fromNotationAndPlayer(answer, this._color)
      if (!action) {
        console.log('Invalid notation.')
        console.log()
        this._ask(state, resolve)
        return
      }
      const validation = action.checkValidation(state)
      if (!validation.isValid) {
        console.log(
          `The action is rejected by rule "${validation.ruleId}": ` +
          `${validation.description}`
        )
        console.log()
        this._ask(state, resolve)
        return
      }
      console.log()
      resolve(action)
    })
  }

  _displayBoard (board) {
    const playerCubes = new Map()
    for (const color of PlayerColor.ALL) {
      playerCubes.set(color, [])
    }
    for (const [square, colors] of board.asMap()) {
      colors.forEach((color, height) => {
        if (!color) { return }
        const position =
          new CubePosition(BoardSquare.fromNotation(square), height)
        playerCubes.get(color).push(position)
      })
    }

    const playerCubesText = new Map()
    for (const color of PlayerColor.ALL) {
      const cubes = playerCubes.get(color)
      cubes.sort((a, b) => a.valueOf() - b.valueOf())
      const text = cubes.map(pos => pos.toNotation()).join(', ')
      playerCubesText.set(color, text)
    }

    const black = PlayerColor.BLACK.toString().toUpperCase()
    const blackCubes = playerCubesText.get(PlayerColor.BLACK)
    this._rl.write(`■■■■■■ ${black}[${blackCubes}] ■■■■■■\r\n`)
    const white = PlayerColor.WHITE.toString().toUpperCase()
    const whiteCubes = playerCubesText.get(PlayerColor.WHITE)
    this._rl.write(`□□□□□□ ${white}[${whiteCubes}] □□□□□□\r\n`)
  }
}

module.exports = CliPlayer
