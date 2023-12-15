const API_key="d1845658f92b31c64bd94f06f7188c9c";

async function show_weather(){
    try{
    let city="goa";
    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

    //Fetch :-- fetching resources from server and return a promise.either resolve or reject

    //When fetch make sure that fetch is not in pending state so use await,which means resolve and return promise
    
    //When formating response file to JSON make sure that fetch is not in pending state so use await,which means resolve and return promise
    let result=await response.json();
    console.log("weather data :- ",result);
    }
    catch(err){
        //catch error here
        console.log("error found",err);
    }
}

async function get_custom_weather_details(){
    try{
    let latitude=15.3333;
    let logitude=74.0833;
    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${logitude}&appid=${API_key}&units=metric`);

    //Fetch :-- fetching resources from server and return a promise.either resolve or reject

    //When fetch make sure that fetch is not in pending state so use await,which means resolve and return promise
    
    //When formating response file to JSON make sure that fetch is not in pending state so use await,which means resolve and return promise
    let result=await response.json();
    console.log("weather data :- ",result);
    }
    catch(err){
        //catch error here
        console.log("error found",err);
    }
}
show_weather();
get_custom_weather_details();


/*
>while moving from searc_tab to your_tab we see a search icon which is revolving for some time then immediately invisible what is that mean?
>what we do:--
    -At 1st we revolve icon by implementing active state
    -then we call API
    -when we receseve our desired data then stop the icon by removing active state
    -then show our data
*/
/*
>how to access client's Geolocation position:--
    -read document on w3school
*/
//1.1st it will send you a location varification
//2.if you accept that then it will give your lat and lon
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
    let lat=position.coords.latitude;
    let lon=position.coords.longitude;
    console.log(lat,lon)
  }
getLocation();