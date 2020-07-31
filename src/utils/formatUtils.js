const formatUtils = {
  formatBoolean (bool) {
    if (bool) return 1
    else return 0
  },
  formatSwitchNum (num) {
    if (num === 1) return true
    else return false
  }
}

export default formatUtils
