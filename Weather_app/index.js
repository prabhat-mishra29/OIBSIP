// We have to fetch two tabs 
//1.user tab
//2.search tab
// - - - - - - - - - - - -Tab Handling- - - - - - - - - - - -
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm ]");
const searchInput= document.querySelector("[data-searchInput]");
const loadingScreen=document.querySelector(".loading-container");
const grantAccessButton=document.querySelector("[data-grantAccess]");
const apiErrorContainer = document.querySelector(".api-error-container");
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");

//Intialized variable
let currentTab = userTab; //By default
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


//when we run an application 1st time we chcek whether session storage have value of lat and lon present or not?
getFromSessionStorage();


// Setting default tab
currentTab.classList.add("current-tab"); //which one you click or by-default one ,it shows a faded background 


//While clicking tab it changes
userTab.addEventListener("click",()=>{
    //Pass clicked tab as a input parameter
    switchtab(userTab); //It means if i click on user tab then switch to usertab
});


searchTab.addEventListener("click",()=>{
    //Pass clicked tab as a input parameter
    switchtab(searchTab); //It means if i click on search tab then switch to searchtab 
});


function switchtab(clickedTab){
    //Suppose i am in usertab and i click user tab,what will happened?
    //it will not change anything
    //But suppose i am in usertab and i click search tab,what will happened?
    //background will remove from usertab and it shifts to search tab an also currentTab=search tab
    if(clickedTab!=currentTab){
        //tab box change only
            currentTab.classList.remove("current-tab");
            currentTab=clickedTab;
            currentTab.classList.add("current-tab");

        //Change form format
        //Suppose we are in user tabbox and you are clicking search tabbox,then it will change to searchtab also it will check search form is active or not is not then active
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //Search form se user form
            //search tabbox ke sathh sathh user info joo search kiya gaya hai dono remove hoa
            //user main current location yani ki co-ordiantes jo session storage main hoga uska userinfo show karega
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            apiErrorContainer.classList.remove("active")
            getFromSessionStorage();
        }
    }
}



// Check if coordinates are already present in Session Storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    //User coordinates jo v hai woh sabb local coordinates main ajaye
    //Agar user coordinates nahi hain toh -> location access nai diya gaya hai
    //agar present hai toh API fetch karo
    if (!localCoordinates) {
      grantAccessContainer.classList.add("active");
    } else {
      const coordinates = JSON.parse(localCoordinates);  //convert json string to json object
      fetchUserWeatherInfo(coordinates);
    }
}


//Grant access button pai ek listner laga ki jabb click ho toh network access ka permission puche and session storage pai save kare
// Get Coordinates using geoLocation
grantAccessButton.addEventListener("click",getLocation);
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      grantAccessBtn.style.display = "none";
      alert("Geolocation is not supported by this browser.");
    }
}
// Store User Coordinates
function showPosition(position) {
    const userCoordinates = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    //UI pai dikhana hai
    fetchUserWeatherInfo(userCoordinates);
}


async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    //Make grant container invisible
    grantAccessContainer.classList.remove("active");
    //Make loader visible
    loadingScreen.classList.add("active");

    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        //Data agaya uske badd loading screen hata doo
        loadingScreen.classList.remove("active");

        //user info show karo
        userInfoContainer.classList.add("active");

        //UI pai render karoo
        renderWeatherInfo(data);
    }
    catch(error){
        loadingScreen.classList.remove("active"); //Remove loading screen
        apiErrorContainer.classList.add("active"); //Error classlist ko add karo
        apiErrorImg.style.display = "none";   
        apiErrorMessage.innerText = `Error: ${error?.message}`; //Error message show karo
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo); //phir se session storage se data leke render karo
    }
}


function renderWeatherInfo(weatherInfo){
    //what we need from data to show in our UI
    //city , country-code , description , weather icon , temp , wind speed , humidity , cloudness

    //1st fetch elements:-
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //Fetch  and implement in UI
    //Json object main kissi perticular object ko access karna chahte hain toh hmm optional chaining operator use karenge
    //agar property present hai toh return karega
    //agar nahi hai toh "undefined" return  karega
    //Example:-- user?.address?.zip
    // user ke andar -> address ke andar -> zip file ka value do
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

//hmm search pai hian agar userbox ko click kiya toh 2 option atte hain.
//Either coordinates hoga ya toh nahi hoga.
//Agar coordinates hai toh userinfo show karega
//agar nahi hai toh grant access show kareg. acces lega phir jake user info show karega!

//user pai hain searchbox click kiya toh search form ayega.
//input pai city denge -> api call karnge -> api data dega -> UI change karenge

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName=searchInput.value;
    if (cityName === "") return;
    else fetchSearchWeatherInfo(cityName);
});
// fetch data from API - user weather info
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active");

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        if (!data.sys) {
            throw data;
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `${error?.message}`;
        apiErrorBtn.style.display = "none";
    }
}