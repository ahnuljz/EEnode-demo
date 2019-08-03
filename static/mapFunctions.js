const addLayer = (mapId, token) => {
    const eeMapOptions = {
        getTileUrl: (tile, zoom) => {
            // console.log(mapId, token)
            const baseUrl = 'https://earthengine.googleapis.com/map'
            const url = [baseUrl, mapId, zoom, tile.x, tile.y].join('/')
            return `${url}?token=${token}`
        },
        name: 'name1',
        tileSize: new google.maps.Size(256, 256)
    }

    mapType = new google.maps.ImageMapType(eeMapOptions)
    map.overlayMapTypes.removeAt(0)
    map.overlayMapTypes.push(mapType)
}
const removeLayer = function (index) {
    map.overlayMapTypes.removeAt(index)
}


const changeRegion = (center, zoom) => {
    //var center = {lat : Number(reg.split(',')[0]), lng : Number(reg.split(',')[1])}
    let centerObject = { lat: center[1], lng: center[0] }
    map.setCenter(centerObject)
    setTimeout(function () {
        map.setZoom(zoom)
    }, 1000)
    map.setZoom(zoom - 2)
}



const changeProvince = (region) => {
    const rp = region.features[y].properties.Code_Regio
    let provinveSel = []
    for (let i = 0; i < provinces.length; i++) {
        let prov = provinces[i]
        if (prov.properties.Code_Provi.substr(0, 3) === rp) {
            provinveSel.push(prov)
        }
    }
}

function clearSelection() {
    if (selectedShape) {
        if (selectedShape.type !== 'marker') {
            selectedShape.setEditable(false)
        }

        selectedShape = null
    }
}

function setSelection(shape) {
    if (shape.type !== 'marker') {
        clearSelection()
        shape.setEditable(true)
        selectColor(shape.get('fillColor') || shape.get('strokeColor'))
    }

    selectedShape = shape
}

function deleteSelectedShape() {
    if (selectedShape) {
        selectedShape.setMap(null)
        for (let i = 0; i < drawnLayers.length; i++) {
            if (drawnLayers[i] === selectedShape) {
                drawnLayers.splice(i, 1)
            }
        }
        console.log(drawnLayers)
    }
}

function selectColor(color) {
    selectedColor = color
    for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i]
        colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff'
    }

    // Retrieves the current options from the drawing manager and replaces the
    // stroke or fill color as appropriate.
    var polylineOptions = drawingManager.get('polylineOptions')
    polylineOptions.strokeColor = color
    drawingManager.set('polylineOptions', polylineOptions)

    var rectangleOptions = drawingManager.get('rectangleOptions')
    rectangleOptions.fillColor = color
    drawingManager.set('rectangleOptions', rectangleOptions)

    var circleOptions = drawingManager.get('circleOptions')
    circleOptions.fillColor = color
    drawingManager.set('circleOptions', circleOptions)

    var polygonOptions = drawingManager.get('polygonOptions')
    polygonOptions.fillColor = color
    drawingManager.set('polygonOptions', polygonOptions)
}

function setSelectedShapeColor(color) {
    if (selectedShape) {
        if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
            selectedShape.set('strokeColor', color)
        } else {
            selectedShape.set('fillColor', color)
        }
    }
}

function makeColorButton(color) {
    var button = document.createElement('span')
    button.className = 'color-button'
    button.style.backgroundColor = color
    google.maps.event.addDomListener(button, 'click', function () {
        selectColor(color)
        setSelectedShapeColor(color)
    })

    return button
}

function buildColorPalette() {
    var colorPalette = document.getElementById('color-palette')
    for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i]
        var colorButton = makeColorButton(currColor)
        colorPalette.appendChild(colorButton)
        colorButtons[currColor] = colorButton
    }
    selectColor(colors[0])
}

const toGeoJSON = (drawnLayers) => {
    const dl = drawnLayers.length
    let feature = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [],
        },
    }
    if (dl > 1)
        feature.geometry.type = "MultiPolygon"

    for (let i = 0; i < dl; i++) {
        llArray = drawnLayers[i].getPath().j
        coordinates = []
        for (let j = 0; j < llArray.length; j++) {
            coordinates.push([llArray[j].lng(), llArray[j].lat()])
        }
        feature.properties.center = getCenter(coordinates)
        if (dl > 1)
            feature.geometry.coordinates.push([coordinates])
        else
            feature.geometry.coordinates.push(coordinates)
    }
    return feature
}

const getCenter = (coordinates) => {
    let bounds = new google.maps.LatLngBounds()
    for (let i = 0; i < coordinates.length; i++) {
        bounds.extend({ lat: coordinates[i][1], lng: coordinates[i][0] })
    }
    return [bounds.getCenter().lat(), bounds.getCenter().lng()]
}