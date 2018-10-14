const LIB_PATH = '../'
const GameResult =
  require(LIB_PATH + 'enums/game-result')
const GameResultRule =
  require(LIB_PATH + 'game-rule-common/game-result-rule')

class GameResultRules {
  constructor (targetClassName) {
    this._rules = []
  }

  add (localRuleId, description, getResult) {
    if (this._rules.some(r => r.localRuleId === localRuleId)) {
      throw new Error('The rule ID is redundant.')
    }
    this._rules.push(new GameResultRule(
      localRuleId,
      description,
      getResult
    ))
  }

  setEnable (localRuleId, enable) {
    const rule = this._rules.find(r => r.localRuleId === localRuleId)
    if (rule == null) { throw new Error('Not found a rule.') }
    rule.enable = enable
  }

  check (state) {
    for (const rule of this._rules.filter(r => r.enable)) {
      const result = rule.getResult(state)
      if (result) {
        result.ruleId = rule.ruleId
        result.description = rule.description
        return result
      }
    }
    return null
  }
}

module.exports = GameResultRules
