// 1st konse element pai js laggenge unne fetch karo

const password_display=document.querySelector("[data-password-Display]"); // fetch custom attribute
const data_copy=document.querySelector("[data-copy]");
const data_copy_msg=document.querySelector("[data-copy-msg]");
const data_length_number=document.querySelector("[data-length-number]");
const input_slider=document.querySelector("[data-length-slider]");
const uppercase=document.querySelector("#uppercase");
const lowercase=document.querySelector("#lowercase");
const numbers=document.querySelector("#numbers");
const symbols=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generation=document.querySelector(".generate-password");
const all_check=document.querySelectorAll("input[type=checkbox]");

let password=""; //Starting password is nothing
let password_length=10; //Starting password length is 10
let check_count=1; 
uppercase.checked=true; //Starting one check is present
slider_handle();
//set stength color to grey by default
set_indicator("#CCC")

/* 
Operations:--
    1.slider_handle => change the passwordlength
    2.get_upper => give uppercase letter
    3.get_lower => give lowercase letter
    4.get_number => give numbers
    5.get_symol => give symblos
    6.generate password => after selecting checkbox then password
    7.password display
    8.strength calculate
    9.strength color change
    10.copy
*/

function slider_handle(){
    input_slider.value=password_length; // by - default
    data_length_number.innerText=password_length; // by - default
    //To count how many parts will show purple and how many parts will show black in slider !
    const min = input_slider.min;
    const max = input_slider.max;
    input_slider.style.backgroundSize =((password_length - min) * 100) / (max - min) + "% 100%";
    // width%   height%
}

function set_indicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function get_random_integer(min,max){
    return Math.floor(Math.random()*(max-min))+min;
    // Math.random() - 0 -1 may be decimol
    // Math.random()*(max-min) - 0 - 19 may be decimol
    // Math.floor(Math.random()*(max-min)) - 0 - 19 integer
    // Math.floor(Math.random()*(max-min))+min - 1 - 20 integer
}

function generate_random_number(){
    return get_random_integer(0,9);
}

function generate_lower_case(){
    return String.fromCharCode(get_random_integer(97,123));
    // get_random_integer(97,123) -> generate random integer 
    // String.fromCharCode(get_random_integer(97,123)) -> generate random lower case character!
}

function generate_upper_case(){
    return String.fromCharCode(get_random_integer(65,91));
    // get_random_integer(65,91) -> generate random integer 
    // String.fromCharCode(get_random_integer(65,91)) -> generate random upper case character!
}

function generate_symbols(){
    const symblos="~`!@#$%^&*()_-+={}[]|:;'><.,/?";
    return symblos.charAt(get_random_integer(0,symblos.length));
}

function calculate_strength(){
    let has_upper=false;
    let has_lower=false;
    let has_number=false;
    let has_symbol=false;
    if(uppercase.checked) has_upper=true;
    if(lowercase.checked) has_lower=true;
    if(numbers.checked) has_number=true;
    if(symbols.checked) has_symbol=true;

    if(has_upper && has_lower && (has_number||has_symbol) && password_length>=8){
        set_indicator("#0f0");
    }
    else if((has_lower||has_upper)&&(has_symbol||has_number)&&password_length>=6){
        set_indicator("#ff0");
    }
    else{
        set_indicator("#f00");
    }
}

/* 
navigator.clipboard.writeText method :----
    >clipboard pai koi v cheeze copy karr sakta hai.
    >This method returns a promise.
    >If this method resolves then return "copied"!
*/
async function copy_content(){
    try{
        await navigator.clipboard.writeText(password_display.value);
        data_copy_msg.innerText="copied";
    }
    catch(e){
        data_copy_msg.innerText="failed";
    }

    //to make copy wala span visible
    data_copy_msg.classList.add("active");

    //for invisible
    setTimeout(()=>{
        data_copy_msg.classList.remove("active");
    },2000);
}

/*
Event listens :--
    1.copy
    2.slider
    3.generate
    4.checkbox (count no of checks)
*/

input_slider.addEventListener('input',(e)=>{
    password_length=e.target.value;
    slider_handle();
        //input_slider.value=password_length; 
        //data_length_number.innerText=password_length;
})

data_copy.addEventListener('click',()=>{
    if(password_display.value){  // non empty then copy
        copy_content();
    }
})

//harr kissi checkbox ke liye 
all_check.forEach((checkbox)=>{
    checkbox.addEventListener('change',handle_checkbox_change);
        // change represents either check hone se kya hua or uncheck hone se kya hua
})
//count total no of check_count if you check a check_box
function handle_checkbox_change(){
    check_count=0;
    all_check.forEach((checkbox)=>{
        if(checkbox.checked){
            check_count++;
        }
    })
    
}

generation.addEventListener('click',()=>{
    //none of the checkbox are selected 
    if(check_count<=0){
        return;
    }

    //special condition
    if(password_length<check_count){
        password_length=check_count;
        slider_handle();
    }

    //let's start the journey to find new password

    //remove old password
    password="";

    //let's put the stuff mentioned by chcekbox
    let funcarr=[]; //function array
    if(uppercase.checked){
        funcarr.push(generate_upper_case);
    }
    if(lowercase.checked){
        funcarr.push(generate_lower_case);
    }
    if(numbers.checked){
        funcarr.push(generate_random_number);
    }
    if(symbols.checked){
        funcarr.push(generate_symbols);
    }

    
    //compulsory addition
    for(let i=0;i<funcarr.length;i++){
        password+=funcarr[i]();
    }

    

    //remaining addition 
    for(let i=0;i<password_length-funcarr.length;i++){
        let randomidx=get_random_integer(0,funcarr.length);  //array ka 4 element main se koi ekk index choose karo
        password+=funcarr[randomidx]();
    }


    //shuffle the password
    password=shuffle_password(Array.from(password));

    //show password
    password_display.value=password;

    //calculate strength
    calculate_strength();
})


//Apply only in array form
//fisher yates method
function shuffle_password(arr){
    for (let i = arr.length - 1; i > 0; i--)
    {
        // Pick a random index from 0 to i inclusive
        const j = Math.floor(Math.random() * (i + 1)); 
        const temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
    let str="";
    arr.forEach((el)=>{
        str+=el
    });
    return str;
}