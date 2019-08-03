var express = require('express')
var router = express.Router()
//data imports
const region = require('../static/data/region.json')
const province = require('../static/data/province.json')
const commune = require('../static/data/commune.json')
//functions imports
const ndvi = require('../functions/ndvi')
const landuse = require('../functions/landuse')
const mtci = require('../functions/mtci')
const chirps = require('../functions/chirps')

router.get('/', (request, response) => {
    response.render('index')
});

router.get('/file', (r, s) => {
    var tab = []
    var com = commune.features
    for (let i = 0; i < com.length; i++) {
        tab.push({ index: i, id: com[i].id, Code_Commu: com[i].properties.Code_Commu, Code_Provi: com[i].properties.Code_Provi, name: com[i].properties.Nom_Commun })
    }
    s.json(tab)
})

router.post('/getJson', (req, response) => {
    const regions = region.features
    const provinces = province.features
    const communes = commune.features
    const x = req.body.indicator
    let y = parseInt(req.body.selectreg)

    let z = req.body.selectprov;
    let c = req.body.selectcom;

    let drawnLayers = JSON.parse(req.body.drawnGeoJSON)

    console.log('INDICATOR = ' + x + '  REGION= ' + y + ' PROVINCE = ' + z + ' COMMUNE = ' + c)
    const satellite = 'COPERNICUS/S2'
    const date = ['2016-01-01', '2016-03-31']
    let reg
    let isDrawn
    if (drawnLayers.geometry.coordinates.length) {
        console.log(drawnLayers.geometry.coordinates)
        reg = drawnLayers.geometry
        isDrawn = 1
    }
    else if (y != -3) {
        reg = regions[y].geometry
        if (z != - 1) {
            reg = provinces[z].geometry
            if (c != -2) {
                reg = communes[c].geometry
            }
        }
        isDrawn = 0
    }
    if (x == '1') {
        ndvi(satellite, date, reg, (mapid, token) => {
            response.json({ mapid: mapid, token: token, provInd: parseInt(z), regInd: parseInt(y), comInd: parseInt(c), isDrawn: isDrawn })
        })
    }
    else if (x == '2') {
        landuse(reg, (mapid, token) => {
            response.json({ mapid: mapid, token: token, provInd: parseInt(z), regInd: parseInt(y), comInd: parseInt(c), isDrawn: isDrawn })
        })
    }
    else if (x == '3') {
        mtci(reg, (mapid, token) => {
            response.json({ mapid: mapid, token: token, provInd: parseInt(z), regInd: parseInt(y), comInd: parseInt(c), isDrawn: isDrawn })
        })
    }
    else {
        chirps(reg, (mapid, token) => {
            response.json({ mapid: mapid, token: token, provInd: parseInt(z), regInd: parseInt(y), comInd: parseInt(c), isDrawn: isDrawn })
        })
    }


});

module.exports = router;