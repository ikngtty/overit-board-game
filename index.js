const readline = require('readline')

const Helpers = require('./lib/common/helpers')
const GameResult = require('./lib/enums/game-result')
const PlayerColor = require('./lib/enums/player-color')
const CliPlayer = require('./lib/players/cli-player')
const GameMaster = require('./lib/game-master')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const blackPlayer = new CliPlayer(PlayerColor.BLACK, rl)
const whitePlayer = new CliPlayer(PlayerColor.WHITE, rl)
const gm = new GameMaster(blackPlayer, whitePlayer)

gm.on('gameend', (result, state) => {
  switch (result.result) {
    case GameResult.WIN_OR_LOSE:
      const winner = Helpers.capitalize(result.winner.toString())
      console.log(`${winner} win !`)
      break

    case GameResult.DRAW:
      console.log('DRAW !')
      break

    case GameResult.ABORTED:
      console.log('Aborted.')
      break
  }
  console.log(`Rule "${result.ruleId}": ${result.description}`)
  rl.close()
})

gm.startGame()
