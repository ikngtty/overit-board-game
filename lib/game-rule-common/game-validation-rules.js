const LIB_PATH = '../'
const GameValidationRule =
  require(LIB_PATH + 'game-rule-common/game-validation-rule')

class GameValidationRules {
  constructor (targetClassName) {
    this._targetClassName = targetClassName
    this._rules = []
  }

  add (localRuleId, description, isValid) {
    if (this._rules.some(r => r.localRuleId === localRuleId)) {
      throw new Error('The rule ID is redundant.')
    }
    this._rules.push(new GameValidationRule(
      this._targetClassName,
      localRuleId,
      description,
      isValid
    ))
  }

  setEnable (localRuleId, enable) {
    const rule = this._rules.find(r => r.localRuleId === localRuleId)
    if (rule == null) { throw new Error('Not found a rule.') }
    rule.enable = enable
  }

  check (state, action = null) {
    for (const rule of this._rules.filter(r => r.enable)) {
      if (!rule.isValid(state, action)) {
        return {
          isValid: false,
          ruleId: rule.ruleId,
          description: rule.description
        }
      }
    }
    return {
      isValid: true,
      ruleId: null,
      description: null
    }
  }
}

module.exports = GameValidationRules
