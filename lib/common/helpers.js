class Helpers {
  /**
   * Capitalize a string.
   * @param  {string} str
   * @return {string}
   */
  static capitalize (str) {
    const initial = str[0] ? str[0].toUpperCase() : ''
    return initial + str.substr(1)
  }

  /**
   * Get a last item of an array.
   * @param  {*[]} arr
   * @return {*}
   */
  static last (arr) {
    return arr[arr.length - 1]
  }

  /**
   * Get a reversed array non-destructively.
   * @param  {*[]} arr
   * @return {*[]}
   */
  static reverse (arr) {
    return Array.from(arr).reverse()
  }

  /**
   * @callback maxmin~getComparison
   * @param  {*} item
   * @return {*}
   */
  /**
   * Get a max item in array.
   * @param  {*[]} arr
   * @param  {maxmin~getComparison} [getComparison=item => item]
   *  - A function to get a compare value.
   * @return {*}
   */
  static max (
    arr,
    getComparison = item => item
  ) {
    if (arr.length <= 0) { return null }

    const comparisonTuples = arr.map(item => [getComparison(item), item])
    const maxComparisonTuple = comparisonTuples.reduce((maxTuple, tuple) => {
      return tuple[0] > maxTuple[0] ? tuple : maxTuple
    })
    return maxComparisonTuple[1]
  }
  /**
   * Get a min item in array.
   * @param  {*[]} arr
   * @param  {maxmin~getComparison} [getComparison=item => item]
   *  - A function to get a compare value.
   * @return {*}
   */
  static min (
    arr,
    getComparison = item => item
  ) {
    if (arr.length <= 0) { return null }

    const comparisonTuples = arr.map(item => [getComparison(item), item])
    const minComparisonTuple = comparisonTuples.reduce((minTuple, tuple) => {
      return tuple[0] < minTuple[0] ? tuple : minTuple
    })
    return minComparisonTuple[1]
  }

  /**
   * @callback findLastIndexOf~condition
   * @param {*} item
   * @return {boolean}
   */
  /**
   * Get the index of the last item which fulfill a given condition
   * in a given array.
   * @param  {*[]} arr
   * @param  {findLastIndexOf~condition} condition
   * @return {number}
   */
  static findLastIndexOf (arr, condition) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (condition(arr[i])) { return i }
    }
    return -1
  }

  /**
   * Check whether a given iterable object contains some duplications or not.
   * @param  {*[]} iter
   * @return {boolean}
   */
  static containsDup (iter) {
    const set = new Set()
    for (const item of iter) {
      if (set.has(item)) {
        return true
      }
      set.add(item)
    }
    return false
  }

  /**
   * Get the numbers of items which a given iterable object contains.
   * @param  {*[]} iter
   * @return {Map} key: item, value: the number of the item
   */
  static getCountMap (iter) {
    const map = new Map()
    for (const item of iter) {
      const prevCount = map.get(item) || 0
      map.set(item, prevCount + 1)
    }
    return map
  }

  /**
   * Overwrite an array to an array. (Non-destructive)
   * @param {*[]} origin
   * @param {*[]} addition
   * @return {*[]}
   */
  static overwriteArray (origin, addition) {
    const writtenArray = Array.from(origin)
    writtenArray.length = Math.max(origin.length, addition.length)

    addition.forEach((item, index) => {
      if (item != null) writtenArray[index] = item
    })
    return writtenArray
  }

  /**
   * Generate a sequence of numbers.
   * @param {...number} args - Three arguments, which are start, stop and step.
   * [4]        -> start: 0(default), stop: 4 , step: 1(default)
   * [4, 10]    -> start: 4         , stop: 10, step: 1(default)
   * [4, 10, 2] -> start: 4         , stop: 10, step: 2
   * @return {number[]}
   */
  static range (...args) {
    // Validate.
    if (args.length < 1 || args.length > 3) {
      throw new Error('The number of arguments must be between 1 and 3.')
    }

    // Arrange arguments.
    let [start, stop, step] = [0, null, 1]
    if (args.length === 1) {
      stop = args[0]
    } else {
      [start, stop, step] = this.overwriteArray([start, stop, step], args)
    }

    // Validate.
    if (step === 0) throw new Error('The step must not be 0.')

    // Generate.
    const seq = []
    const staysInSeq = (step > 0) ? (i) => i <= stop : (i) => i >= stop
    for (let i = start; staysInSeq(i); i += step) {
      seq.push(i)
    }
    return seq
  }

  /**
   * Remove capture group names in a given regular expression.
   * e.g. /(?<foo>abc)def/gi -> /(abc)def/gi
   * @param  {RegExp} reg
   * @return {RegExp}
   */
  static removeCaptureGroupNames (reg) {
    const newSource = reg.source.replace(/\(\?<[^>]+>([^)]+)\)/g, '($1)')
    return new RegExp(newSource, reg.flags)
  }
}

module.exports = Helpers
