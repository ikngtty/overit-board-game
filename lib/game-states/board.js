const LIB_PATH = '../'
const ArrayMap =
  require(LIB_PATH + 'common/array-map')
const Helpers =
  require(LIB_PATH + 'common/helpers')
const RuleConsts =
  require(LIB_PATH + 'consts/rule-consts')
const PlayerColor =
  require(LIB_PATH + 'enums/player-color')
const GameValidationRules =
  require(LIB_PATH + 'game-rule-common/game-validation-rules')
const BoardSquare =
  require(LIB_PATH + 'game-states/board-square')
const CubePosition =
  require(LIB_PATH + 'game-states/cube-position')

class Board {
  constructor (cubeColorsInSquare) {
    this._map = cubeColorsInSquare
  }
  asMap () {
    // Copy not to change the original value. (cf. defensive programming)
    return this._map.clone()
  }

  static notationRegExp () {
    const cubePositionFormat =
      Helpers.removeCaptureGroupNames(CubePosition.notationRegExp()).source
    const cubeFormats = PlayerColor.ALL.map((color, iColor) => {
      return Helpers.range(RuleConsts.CUBE_PER_PLAYER - 1).map(iCube =>
        `(?<cube${iColor}_${iCube}>${cubePositionFormat})`
      )
    })

    return new RegExp(
      cubeFormats.map((playerCubeFormats, playerIndex) => {
        const colorChar = PlayerColor.ALL[playerIndex].toChar()
        const playerCubeText = playerCubeFormats.join(', ')
        return `${colorChar}\\[${playerCubeText}\\]`
      }).join(', ')
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
    const cubeColorsInSquare = new ArrayMap()
    PlayerColor.ALL.forEach((color, iColor) => {
      Helpers.range(RuleConsts.CUBE_PER_PLAYER - 1).forEach(iCube => {
        const captureName = `cube${iColor}_${iCube}`
        const position = CubePosition.fromNotation(m.groups[captureName])
        cubeColorsInSquare.setItem(
          position.square.toNotation(),
          position.height,
          color
        )
      })
    })

    return new this(cubeColorsInSquare)
  }

  toNotation () {
    const playerCubes = new Map()
    for (const color of PlayerColor.ALL) {
      playerCubes.set(color, [])
    }
    for (const [square, colors] of this._map) {
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

    return PlayerColor.ALL.map(color =>
      `${color.toChar()}[${playerCubesText.get(color)}]`
    ).join(', ')
  }

  checkValidation () {
    return this.constructor.VALIDATION_RULES.check(this)
  }

  equals (other) {
    if (other == null || other.toNotation == null) { return false }
    return this.toNotation() === other.toNotation()
  }
}

const thisClass = Board

const cubeFloats = cubeColors => {
  const vacantPosition = cubeColors.findIndexOf(player => player == null)
  if (vacantPosition < 0) { return false }
  const lastCubePosition =
    Helpers.findLastIndexOf(cubeColors, player => player != null)
  return lastCubePosition > vacantPosition
}

thisClass.VALIDATION_RULES = new GameValidationRules(thisClass.name)
thisClass.VALIDATION_RULES.add(
  1,
  "The map's key must represent a valid board square.",
  state => {
    return state.asMap().toArray()
      .every(([key]) => BoardSquare.isValidNotation(key))
  }
)
thisClass.VALIDATION_RULES.add(
  2,
  'The number of cube positions per player must be' +
  `${RuleConsts.CUBE_PER_PLAYER}.`,
  state => {
    const flatten =
      state.asMap().toArray()
        .reduce((sum, [, cubes]) => sum.concat(cubes), [])
    const counts = Helpers.getCountMap(flatten)
    return PlayerColor.All.every(
      color => counts.get(color) === RuleConsts.CUBE_PER_PLAYER
    )
  }
)
thisClass.VALIDATION_RULES.add(
  3,
  'A cube cannot be put in the air.',
  state => {
    return state.asMap().toArray()
      .every(([, cubes]) => !cubeFloats(cubes))
  }
)
thisClass.VALIDATION_RULES.add(
  4,
  `More than ${RuleConsts.HEIGHT} cubes cannot be put in the same square.`,
  state => {
    return state.asMap().toArray()
      .every(([, cubes]) => cubes.length <= RuleConsts.HEIGHT)
  }
)

module.exports = thisClass
