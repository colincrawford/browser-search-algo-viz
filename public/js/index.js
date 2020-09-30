import * as Graph from './graph.js'
import * as SA from './simulated-annealing.js'
import * as BF from './brute-force.js'

window.addEventListener("DOMContentLoaded", main)

const Circles = {
  Best: "Best",
  Search: "Search"
}

async function main() {
  let data = [3,2,5,2,4,1, 5, 8, 4, 2, 5, 2, 4, 1, 0, 10, 5]
  let startingPoint = Graph.getPointAtInx(data, 0)
  let searchCircle = Graph.Circle(Circles.Search, startingPoint, "blue")
  let bestCircle = Graph.Circle(Circles.Best, startingPoint, "green")
  let graph = Graph.create(data, [searchCircle, bestCircle])

  function reset() {
    graph = Graph.create(data, [searchCircle, bestCircle])
  }


  await runAlgorithm(graph, BF.bruteForce)
  setTimeout(reset, 3000)
  await runAlgorithm(graph, SA.simulatedAnnealing)
}

async function runAlgorithm(graph, algo) {
  let { values } = graph
  let prevMinInx = 0
  for (let step of algo(values)) {
    let { minInx, currentInx } = step
    await Graph.moveCircle(Circles.Search, graph, Graph.getPointAtInx(values, currentInx))
    if (prevMinInx !== minInx) {
      prevMinInx = minInx
      await Graph.moveCircle(Circles.Best, graph, Graph.getPointAtInx(values, minInx))
    }
  }
}

