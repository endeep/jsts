import Comparator from '../../../../../java/util/Comparator'
import Serializable from '../../../../../java/io/Serializable'
export default class BoundablePairDistanceComparator {
  constructor () {
    BoundablePairDistanceComparator.constructor_.apply(this, arguments)
  }

  compare (p1, p2) {
    const distance1 = p1.getDistance()
    const distance2 = p2.getDistance()
    if (this.normalOrder) {
      if (distance1 > distance2) {
        return 1
      } else if (distance1 === distance2) {
        return 0
      }
      return -1
    } else {
      if (distance1 > distance2) {
        return -1
      } else if (distance1 === distance2) {
        return 0
      }
      return 1
    }
  }

  getClass () {
    return BoundablePairDistanceComparator
  }

  get interfaces_ () {
    return [Comparator, Serializable]
  }
}
BoundablePairDistanceComparator.constructor_ = function () {
  this.normalOrder = null
  const normalOrder = arguments[0]
  this.normalOrder = normalOrder
}
