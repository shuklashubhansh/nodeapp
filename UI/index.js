var popup;
initUI = () => {
    var grid = document.querySelector("#grid");
    popup = document.querySelector('.toast');
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
    let name = document.querySelector('#givenname').value;
    let occupation = document.querySelector('#givenoccupation').value;
    if(!name || !occupation){
        showPop("Please fill up all the details!", true);
    } else {
        const obj = [{ name: name, occupation: occupation }];
        let response = await fetch("http://localhost:8080/writedata",
        { method: 'POST', body: JSON.stringify(obj)}).catch((error)=>{showPop("Yikes! Unable to update the details.", true)});

        if (response.status == 200) {
            let data = await response.json();
            window.location.reload();
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
        window.location.reload();
    } else {
        showPop(`Unable to delete - ${response.status}`, true);
    }
}

generateUI = (data, parent) => {
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
        btn.addEventListener('click', ()=>{event.stopPropagation(); data.splice(index,1); data = data.reverse(); deletedata(data)});
        d.addEventListener('click',()=>showPop(`${item.name} is ${item.occupation} by profession.`, false));
    })
}

searchUI = () => {
    let val = document.querySelector('#givensearch').value.toUpperCase();
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
    clearTimeout(this.timeout);
    if(autoclose){
        this.timeout = setTimeout(()=>{popup.style.display='none'},3000);
     }
    popup.childNodes[0].innerText=message;
    popup.childNodes[1].addEventListener('click',()=>popup.style.display='none');
    popup.style.display='flex';
}

handleError = (errorMessage, parentElement) => {
    showPop(errorMessage, true);
    parentElement.innerHTML="<H2 style='color:red;'>Something went wrong. Please try after sometime.</H2>";
}