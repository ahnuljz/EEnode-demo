/**
 * Initialize the Google Map and add our custom layer overlay.
 * @param  {string} mapId
 * @param  {string} token
 */
let map
let mapType
let drawingManager
let selectedShape
const colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082']
let selectedColor
let colorButtons = {}
let drawnLayers = []


const initialize = () => {

  // map = new google.maps.Map(document.getElementById('map'), {
  //   center: { lat: 31.526955, lng: -6.346527 },
  //   zoom: 6,

  // })

  // var drawingManager = new google.maps.drawing.DrawingManager({
  //   drawingMode: google.maps.drawing.OverlayType.MARKER,
  //   drawingControl: true,
  //   drawingControlOptions: {
  //     position: google.maps.ControlPosition.TOP_CENTER,
  //     drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
  //   },
  //   markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
  //   circleOptions: {
  //     fillColor: '#ffff00',
  //     fillOpacity: 1,
  //     strokeWeight: 5,
  //     clickable: false,
  //     editable: true,
  //     zIndex: 1
  //   }
  // })

  // drawingManager.setMap(map)
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: new google.maps.LatLng(31.526955, -6.346527),
  })

  var polyOptions = {
    strokeWeight: 0,
    fillOpacity: 0.45,
    editable: true,
    draggable: true
  }
  // Creates a drawing manager attached to the map that allows the user to draw
  // markers, lines, and shapes.
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
    },
    markerOptions: {
      draggable: true
    },
    polylineOptions: {
      editable: true,
      draggable: true
    },
    rectangleOptions: polyOptions,
    circleOptions: polyOptions,
    polygonOptions: polyOptions,
    map: map
  })

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
    let newShape = e.overlay

    newShape.type = e.type
    drawnLayers.push(newShape)
    console.log(drawnLayers)
    if (e.type !== google.maps.drawing.OverlayType.MARKER) {
      // Switch back to non-drawing mode after drawing a shape.
      drawingManager.setDrawingMode(null)

      // Add an event listener that selects the newly-drawn shape when the user
      // mouses down on it.
      google.maps.event.addListener(newShape, 'click', function (e) {
        if (e.vertex !== undefined) {
          if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
            var path = newShape.getPaths().getAt(e.path)
            path.removeAt(e.vertex)
            if (path.length < 3) {
              newShape.setMap(null)
            }
          }
          if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {
            var path = newShape.getPath()
            path.removeAt(e.vertex)
            if (path.length < 2) {
              newShape.setMap(null)
            }
          }
        }
        setSelection(newShape)
      })
      setSelection(newShape)
    }
    else {
      google.maps.event.addListener(newShape, 'click', function (e) {
        setSelection(newShape)
      })
      setSelection(newShape)
    }
  })

  // Clear the current selection when the drawing mode is changed, or when the
  // map is clicked.
  google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection)
  google.maps.event.addListener(map, 'click', clearSelection)
  google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape)

  buildColorPalette()
}