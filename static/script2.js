$("#apply").click(function () {
  $('#loadingmessage').show();
  $.post("/getJson",
    {
      indicator: $("#ind").val(),
      selectreg: $("#selectBox").val(),
      selectprov: $("#province").val(),
      selectcom: $("#commune").val(),
      startdate: $("#startdate").val(),
      enddate: $("#enddate").val(),
      drawnGeoJSON: JSON.stringify(toGeoJSON(drawnLayers)),
    },
    function (data, status) {
      addLayer(data.mapid, data.token)
      $('#loadingmessage').hide();
      let centerIndex
      if (!data.isDrawn) {
        if (data.comInd == -2) {
          if (data.provInd == -1) {
            centerIndex = data.regInd
            changeRegion(regions[centerIndex].center, 8)
          } else {
            centerIndex = data.provInd
            changeRegion(provinces[centerIndex].center, 10)
          }
        } else {
          centerIndex = data.comInd
          console.log(centerIndex)
          changeRegion(communes[centerIndex].center, 12)
        }
      }
    });
});

/*
        $("#ind").change(function () {
            $.post("/getJson",
                {
                    selectpicker: $("#ind").val(),
                    selectreg: $("#selectBox").val(),
                },
                function (data, status) {
                    addLayer(data.mapid, data.token)
                });
        });
*/

$.each(regions, function (key, value) {
  $('#selectBox')
    .append($("<option></option>")
      .attr("value", key)
      .text(value.name));
});


$(document).ready(function () {
  $("#selectBox").change(function () {
    var val = $(this).val();
    var cr = regions[val].code
    //  var id = parseInt(val, 16);
    $('#province').empty();
    $('#commune').empty();
    $("#province").html('<option data-tokens="ketchup mustard" value="-1">Selectionnez votre province</option>')
    $("#commune").html('<option data-tokens="ketchup mustard" value="-2">Selectionnez votre commune</option>')
    for (let i = 0; i < provinces.length; i++) {
      if (cr == provinces[i].code.substr(0, 3)) {
        //console.log("cr ="+cr+ " code pr :"+ provinces[i].code)
        var o = new Option(provinces[i].name, parseInt(provinces[i].id, 16));
        $("#province").append(o);
      }
    }
    $('.selectpicker').selectpicker('refresh');
  });
});

$(document).ready(function () {
  $("#province").change(function () {
    var val = $(this).val();
    console.log(val)
    if (val != -1) {
      var cr = provinces[val].code
      $('#commune').empty();
      $("#commune").html('<option value="-2" data-tokens="ketchup mustard" >Selectionnez votre commune</option>')
      console.log(communes.length)
      for (let i = 0; i < communes.length; i++) {
        if (cr == communes[i].Code_Commu.substr(0, 7)) {
          var o = new Option(communes[i].name, parseInt(communes[i].index));
          $("#commune").append(o);
          console.log('add commune option')
        }
      }
    }
    $('.selectpicker').selectpicker('refresh');
  });
});