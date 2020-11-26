/**
 * User: CHT
 * Date: 2020/11/26
 * Time: 17:36
 */

const top = [0, 1]
const right = [1, 0]
const bottom = [0, -1]
const left = [-1, 0]

function dotProduct(vectorA, vectorB) {
  return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1]
}


console.log(dotProduct(top, bottom))  // 平行
console.log(dotProduct(right, bottom)) // 相交
console.log(dotProduct(left, bottom))  // 相交
console.log(dotProduct(top, right))
console.log(dotProduct(left, right))  // 平行
