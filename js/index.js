$(document).ready(function(){
  
  (function(){
    
    var weekdays = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
    var currentDate = new Date();
    var formattedDate = weekdays[currentDate.getDay()] + ' ' + currentDate.getDate() + ' ' + currentDate.getFullYear();
    var coords = {};
    var weather = {currentTemp: 0, 
                   daily: {max: 0, min: 0}, 
                   summary: {current: '', daily: ''},
                   icon: {current: '', daily: ''}};
    var conditions = [{condition: 'clear-day', 
                       icon: '<i class="wi wi-day-sunny"></i>'}, 
                      {condition: 'clear-night', 
                       icon: '<i class="wi wi-night-clear"></i>'}, 
                      {condition: 'rain', 
                       icon: '<i class="wi wi-showers"></i>'}, 
                      {condition: 'snow', 
                       icon: '<i class="wi "></i>'}, 
                      {condition: 'wind', 
                       icon: '<i class="wi wi-snow"></i>'}, 
                      {condition:'fog',
                       icon:  '<i class="wi wi-fog"></i>'}, 
                      {condition:'sleet',
                       icon: '<i class="wi wi-sleet"></i>'}, 
                      {condition: 'cloudy',
                       icon: '<i class="wi "></i>'}, 
                      {condition: 'partly-cloudy-day',
                       icon: '<i class="wi wi-cloud"></i>'}, 
                      {condition: 'partly-cloudy-night',
                       icon: '<i class="wi wi-night-alt-cloudy"></i>'}];
    
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(success);
    }
    else {
      console.log('geolocation not supported');
    }

    function success(position){
      coords.lat = position.coords.latitude; 
      coords.long = position.coords.longitude;
      getWeather();
      getLocation();
    }
    
    function getWeather(){
      $.ajax({
        url: 'https://api.darksky.net/forecast/a3dd3862b9791447f3b31d280a5678aa/' 
        + coords.lat + ',' + coords.long,
        dataType: 'jsonp',
        success: function(weatherData){
          console.log(weatherData);
          if($('#loader')) { $('#loader').remove(); }
          if($('#title').hasClass('hide')) { 
            $('#title').removeClass('hide') 
            $('button').removeClass('hide');
          }
          weather.currentTemp = Math.ceil(weatherData.currently.temperature);
          weather.daily.max = Math.ceil(weatherData.daily.data[0].apparentTemperatureMax);
          weather.daily.min = Math.ceil(weatherData.daily.data[0].apparentTemperatureMin);
          weather.summary.current = weatherData.currently.summary;
          weather.summary.daily = weatherData.daily.data[0].summary;    
          weather.icon.current = '<i class="wi wi-cloudy"></i>';
          weather.icon.daily = '<i class="wi wi-cloudy"></i>';

          $.each(conditions, function(_, c){
            if(c.condition === weatherData.currently.icon){
              weather.icon.current = c.icon;
            }
            if(c.condition === weatherData.daily.icon){
              weather.icon.daily = c.icon;
            }
          });

          $('#icon').html(weather.icon.current + '<br>');
          $('#temp').html(weather.currentTemp + ' F°<br>');
          $('#summary').text(weather.summary.current);
        },
        error: function(e){
          console.log(e);
        }
      });
    }
    
    function getLocation(){
      $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coords.lat + ',' + coords.long + '&key=AIzaSyCaeSa04UTMMMDcXQMEfADLVKqzUYOxWAI',
        dataType: 'json',
        success: function(locationData){
          console.log(locationData);
          if($('#loader')) { $('#loader').remove(); }
          if($('#current .title').hasClass('hide')) { $('# current.title').removeClass('hide') }
          $('#location').html(locationData.results[2].address_components[0].long_name + ', ' + locationData.results[2].address_components[1].long_name);
        },
        error: function(e){
          console.log(e.error_message);
        }
      });
    }
    
    (function(){
      var toggle = 'f';
      $('#temp').on('click', function(){
        if(toggle === 'f'){
          toggle = 'c';
          $('#temp').text(Math.ceil((((temp - 32) * 5) / 9)) + ' C°');
        }
        else{
          toggle = 'f';
          $('#temp').html(temp + ' F°');
        }
      });
    })();
    
    $('#forecastToggle').on('click', function(){
      if($('#weather').hasClass('current')){
        $('#forecastToggle').text('VIEW CURRENT');
        $('#weather').removeClass('current').addClass('daily');
        $('#title').text(formattedDate);
        $('#icon').html(weather.icon.daily + '<br>');
        $('#temp').html('High ' + weather.daily.max + ' F°<br>' 
                               + 'Low ' + weather.daily.min + ' F°<br>');
        $('#summary').text(weather.summary.daily);
      }
      else if($('#weather').hasClass('daily')){
        $('#forecastToggle').text('VIEW DAILY');
        $('#title').text('Currently')
        $('#weather').removeClass('daily').addClass('current');
        $('#icon').html(weather.icon.current + '<br>');
        $('#temp').html(weather.currentTemp + ' F°<br>');
        $('#summary').text(weather.summary.current);        
      }
    });

  })();

});