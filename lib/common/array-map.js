class ArrayMap {
  constructor (map = new Map()) {
    this._map = map
  }

  [Symbol.iterator] () {
    return this._map[Symbol.iterator]()
  }

  getArray (key) {
    this._setUpArray(key)
    return this._map.get(key)
  }

  popItem (key) {
    const a = this._map.get(key)
    if (!a) { return undefined }
    const item = a.pop()
    this._tearDownArray(key)
    return item
  }

  pushItem (key, item) {
    this._setUpArray(key)
    this._map.get(key).push(item)
  }

  setItem (key, index, item) {
    this._setUpArray(key)
    this._map.get(key)[index] = item
  }

  toArray () {
    return Array.from(this._map)
  }

  clone () {
    const kvPairs =
      this.toArray().map(([key, array]) => [key, Array.from(array)])
    return new ArrayMap(new Map(kvPairs))
  }

  _setUpArray (key) {
    if (!this._map.has(key)) {
      this._map.set(key, [])
    }
  }

  _tearDownArray (key) {
    if (this._map.get(key).length === 0) {
      this._map.delete(key)
    }
  }
}

module.exports = ArrayMap
