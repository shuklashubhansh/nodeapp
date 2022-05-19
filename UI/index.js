var popup;
var timeout;
var isDBProfile = configuration.isDBProfile;
var pname;
var occupation;
var searchtext;
var grid;

initUI = () => {
    grid = document.querySelector("#grid");
    popup = document.querySelector('.toast');
    pname = document.querySelector('#givenname');
    occupation = document.querySelector('#givenoccupation');
    searchtext = document.querySelector('#givensearch');
    getdata(grid);
}

getdata = async (parent) => {
    let response = await fetch("http://localhost:8080/data").catch((error)=>{handleError("Unable to connect to the server!", parent)});
    if (response.status == 200) {
        let data = await response.json();
        generateUI(data, parent);
    } else {
        handleError(`Unable to fetch the data - ${response.status}`, parent);
    }
}

postdata = async () => {
    if(!pname.checkValidity() || !occupation.checkValidity() || !pname.value || !occupation.value){
        showPop("Please fill up all the details correctly!", true);
    } else {
        const obj = [{ name: pname.value, occupation: occupation.value }];
        let response = await fetch("http://localhost:8080/writedata",
        { method: 'POST', body: JSON.stringify(obj)}).catch((error)=>{showPop("Yikes! Unable to update the details.", true)});

        if (response.status == 200) {
            let data = await response.json();
            clearfields();
            initUI();
        } else {
            showPop(`Unable to update the details - ${response.status}`, true);
        }
    }
}

deletedata = async (data) => {
    let response = await fetch("http://localhost:8080/deletedata",
    {method:'post', body: JSON.stringify(data)}).catch((error)=>{showPop("Yikes! Unable to delete.", true)});

    if (response.status == 200) {
        let data = await response.json();
        clearfields();
        initUI();
    } else {
        showPop(`Unable to delete - ${response.status}`, true);
    }
}

generateUI = (data, parent) => {
    parent.innerHTML='';
    var data = data.reverse();
    data.map((item, index) => {
        let d = document.createElement('div');
        let btn = document.createElement('img');
        let para = document.createElement('p');
        d.classList.add('listitem');
        para.innerText = item.name + ' - ' + item.occupation;
        btn.src="close.png";
        btn.style.width="30px";
        d.appendChild(para);
        d.appendChild(btn);
        parent.appendChild(d);
        if(isDBProfile){
        btn.addEventListener('click', ()=>{event.stopPropagation(); data = data.reverse(); deletedata([item])});
        } else {
        btn.addEventListener('click', ()=>{event.stopPropagation(); data.splice(index,1); data = data.reverse(); deletedata(data)});
        }
        d.addEventListener('click',()=>showPop(`${item.name} is ${item.occupation} by profession.`, false));
    })
}

searchUI = () => {
    let val = searchtext.value.toUpperCase();
    document.querySelectorAll('.listitem').forEach((item)=>{
        if(item.innerText.toUpperCase().indexOf(val)>-1){
            item.style.display='flex';
        } else {
            item.style.display='none';
        }
    })
}

scrollUI = () => {
    window.scroll({top:0, behavior:"smooth"});
}

showPop = (message, autoclose) => {
    clearTimeout(timeout);
    popup.childNodes[0].innerText=message;
    popup.childNodes[1].addEventListener('click',()=>popup.style.display='none');
    popup.style.display='flex';
    if(autoclose){
        popup.classList.add('validationtoast');
        timeout = setTimeout(()=>{popup.style.display='none'},3000);
     } else{
         popup.classList.remove('validationtoast');
     }
}

handleError = (errorMessage, parentElement) => {
    showPop(errorMessage, true);
    parentElement.innerHTML="<H2 style='color:red;'>Something went wrong. Please try after sometime.</H2>";
}

clearfields = () => {
    pname.value = occupation.value = searchtext.value = '';
}