(function () {
  'use strict'

  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')

  var wrapper = document.querySelector('.wrapper')
  if (!wrapper) return

  var BODY_PATH = 'M46.772 28.063V18.709H37.418V0H28.063V18.709H18.709V28.063H0V56.126V65.48H9.355V74.834H18.708V93.544H28.063V74.835H37.418V93.545H46.772V74.836H56.126V65.482H65.48V56.129V46.775V37.421V28.067H46.772V28.063ZM18.709 37.418V46.772V56.126H9.355V37.418H18.709Z'
  var X_PATH = 'M60.638 52.155L56.322 56.471L51.129 51.279L45.936 56.471L41.62 52.155L46.812 46.962L41.62 41.769L45.936 37.453L51.129 42.645L56.322 37.453L60.638 41.769L55.446 46.962L60.638 52.155Z'

  var LOGO_W = 65
  var LOGO_H = 94
  var X_CX = 51.129
  var X_CY = 46.962

  var bodyPath = new Path2D(BODY_PATH)
  var xPath = new Path2D(X_PATH)

  var mouseX = -1000
  var mouseY = -1000
  var cols = 0
  var rows = 0
  var spacingX = 0
  var spacingY = 0
  var scale = 0
  var grid = []
  var bodyCanvas = null
  var drawPending = false

  function layout() {
    var vw = window.innerWidth
    var vh = window.innerHeight

    spacingX = 110
    spacingY = 140
    scale = Math.min((spacingX - 10) / LOGO_W, (spacingY - 10) / LOGO_H)

    cols = Math.ceil(vw / spacingX) + 1
    rows = Math.ceil(vh / spacingY) + 1

    grid = []
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var ox = (r % 2) * spacingX * 0.5
        grid.push({
          x: c * spacingX + ox - spacingX * 0.5,
          y: r * spacingY,
        })
      }
    }
  }

  function renderBodies() {
    bodyCanvas = document.createElement('canvas')
    bodyCanvas.width = canvas.width
    bodyCanvas.height = canvas.height
    var bCtx = bodyCanvas.getContext('2d')

    var s = scale
    for (var i = 0; i < grid.length; i++) {
      var g = grid[i]
      bCtx.save()
      bCtx.translate(g.x, g.y)
      bCtx.scale(s, s)
      bCtx.fillStyle = '#14120f'
      bCtx.fill(bodyPath)
      bCtx.restore()
    }
  }

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    layout()
    renderBodies()
    draw()
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (bodyCanvas) {
      ctx.drawImage(bodyCanvas, 0, 0)
    }

    var s = scale
    for (var i = 0; i < grid.length; i++) {
      var g = grid[i]
      var dx = mouseX - (g.x + X_CX * s)
      var dy = mouseY - (g.y + X_CY * s)
      var angle = Math.atan2(dy, dx) + Math.PI / 4

      ctx.save()
      ctx.translate(g.x, g.y)
      ctx.scale(s, s)
      ctx.save()
      ctx.translate(X_CX, X_CY)
      ctx.rotate(angle)
      ctx.translate(-X_CX, -X_CY)
      ctx.fillStyle = '#0a0a0a'
      ctx.fill(xPath)
      ctx.restore()
      ctx.restore()
    }

    drawPending = false
  }

  function requestDraw() {
    if (!drawPending) {
      drawPending = true
      requestAnimationFrame(draw)
    }
  }

  function onMouseMove(e) {
    mouseX = e.clientX
    mouseY = e.clientY
    requestDraw()
  }

  function init() {
    if (window.innerWidth <= 640) return

    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '0'
    canvas.style.display = 'block'

    resize()
    document.body.prepend(canvas)
    window.addEventListener('resize', function () {
      resize()
    })
    document.addEventListener('mousemove', onMouseMove)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
