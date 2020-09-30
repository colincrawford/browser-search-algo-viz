export function* bruteForce(values) {
  let minInx = 0
  let minValue = values[0]
  for (let i = 0; i < values.length; i++) {
    let value = values[i]
    if (value < minValue) {
      minInx = i
      minValue = value
    }
    yield { minInx, currentInx: i }
  }
}
