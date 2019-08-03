const ee = require('@google/earthengine')

const mtci = (reg, callback) => {
    const Sentinel = ee.ImageCollection('COPERNICUS/S2_SR')
        .filterDate('2016-01-01', '2018-03-31')
        .filterBounds(reg);

    let image = Sentinel.median()

    //MTCI = (B6 - B5)/(B5 - B4)
    var mtci = image.expression(
        '(B6 - B5)/(B5 - B4)', {
            'B6': image.select('B6'),
            'B5': image.select('B5'),
            'B4': image.select('B4')
        });

    var vis = {
        min: 0,
        max: 1,
        palette: [
            'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
            '74A901', '66A000', '529400', '3E8601', '207401', '056201',
            '004C00', '023B01', '012E01', '011D01', '011301'
        ]
    };

    mtci.clip(reg).getMap(vis, ({ mapid, token }) => {
        callback(mapid, token)
    });
}

module.exports = mtci