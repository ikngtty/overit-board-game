class GameResultRule {
  constructor (
    localRuleId,
    description,
    getResult,
    enable = true
  ) {
    this._localRuleId = localRuleId
    this._description = description
    this._getResult = getResult
    this.enable = enable
  }

  get localRuleId () { return this._localRuleId }
  get description () { return this._description }
  getResult (state) {
    return this._getResult(state)
  }

  get ruleId () {
    const localRuleIdStr = this._localRuleId.toString().padStart(2, '0')
    return `R-${localRuleIdStr}`
  }
}

module.exports = GameResultRule
