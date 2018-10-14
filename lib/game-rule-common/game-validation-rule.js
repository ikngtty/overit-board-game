class GameValidationRule {
  constructor (
    targetClassName,
    localRuleId,
    description,
    isValid,
    enable = true
  ) {
    this._targetClassName = targetClassName
    this._localRuleId = localRuleId
    this._description = description
    this._isValid = isValid
    this.enable = enable
  }

  get targetClassName () { return this._targetClassName }
  get localRuleId () { return this._localRuleId }
  get description () { return this._description }
  isValid (state, action = null) {
    return this._isValid(state, action)
  }

  get ruleId () {
    const className = this._targetClassName
    const localRuleIdStr = this._localRuleId.toString().padStart(2, '0')
    return `V-${className}-${localRuleIdStr}`
  }
}

module.exports = GameValidationRule
