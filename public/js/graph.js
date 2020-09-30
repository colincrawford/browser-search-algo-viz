export function create(values, circles) {
  let id = "graph"
  document.querySelector(`#${id}`)?.remove()

  let canvas = document.createElement('canvas')
  canvas.id = id
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  let graph = { values, circles, canvas, padding: 40 }
  draw(graph)
  return graph
}

export function getPointAtInx(values, inx) {
  return Point(inx, values[inx])
}

export function moveCircle(circleId, graph, newPos) {
  let circle = graph.circles.find(c => c.id === circleId)
  let numberOfFrames = 120
  let transitionDurationMs = 1000
  let deltaX = (newPos.x - circle.position.x) / numberOfFrames
  let deltaY = (newPos.y - circle.position.y) / numberOfFrames
  let frameDuration = transitionDurationMs / numberOfFrames

  return new Promise((resolve, reject) => {
    let steps = 1

    let step = () => {
      let newX = circle.position.x + (steps * deltaX)
      let newY = circle.position.y + (steps * deltaY)
      let pos = Point(newX, newY)
      graph.circles = graph.circles.map(circle => {
        if (circle.id === circleId) {
          return Circle(circleId, pos, circle.color)
        }
        return circle
      })

      draw(graph)

      if (++steps <= numberOfFrames) {
        setTimeout(step, frameDuration)
      } else {
        resolve()
      }
    }
    
    step()
  })
}

export function Point(x, y) {
  return Object.freeze({ x, y })
}

export function Circle(id, position, color) {
  return Object.freeze({ id, position, color })
}

function Dimensions(width, height, xScaleFactor, yScaleFactor) {
  return Object.freeze({ width, height, xScaleFactor, yScaleFactor })
}

function draw(graph) {
  let { values, canvas, padding } = graph
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)

  let width = canvas.width - (padding * 2)
  let height = canvas.height - (padding * 2)
  let xScaleFactor = width / (values.length - 1)
  let yScaleFactor = height / Math.max(...values)
  let dimensions = Dimensions(width, height, xScaleFactor, yScaleFactor)

  drawLineChart(graph, dimensions)
  graph.circles.forEach(circle => drawCircle(circle, graph, dimensions))
}

function drawCircle(circle, graph, dimensions) {
  let ctx = graph.canvas.getContext("2d")
  let { x, y } = translate(graph, dimensions, circle.position)
  ctx.beginPath()
  ctx.arc(x, y, 10, 0, (Math.PI * 2), false)
  ctx.fillStyle = circle.color
  ctx.fill()
  ctx.closePath()
}

function drawLineChart(graph, dimensions) {
  let ctx = graph.canvas.getContext("2d")
  ctx.beginPath()
  graph.values.forEach((value, i) => {
    let { x, y } = translate(graph, dimensions, Point(i, value))
    if (i === 0) ctx.moveTo(x, y)
    ctx.lineTo(x, y)
  })
  ctx.stroke()
  ctx.closePath()
}

function translate(graph, dimensions, point) {
  let x = (point.x * dimensions.xScaleFactor) + graph.padding
  let y = dimensions.height - (point.y * dimensions.yScaleFactor) + graph.padding
  return { x, y }
}
