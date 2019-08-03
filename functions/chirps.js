const ee = require('@google/earthengine')

const chirps = (reg, callback) => {
    const dataset = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
        .filter(ee.Filter.date('2018-05-01', '2018-05-03'))
        .filterBounds(reg)

    let precipitation = dataset.select('precipitation');
    const vis = {
        min: 1.0,
        max: 17.0,
        palette: ['001137', '0aab1e', 'e7eb05', 'ff4a2d', 'e90000'],
    };
    
    precipitation.median().clip(reg).getMap(vis, ({ mapid, token}) => {
        callback(mapid, token)
    })
}

module.exports = chirps