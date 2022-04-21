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
        showPop("Please fill up all the details!");
    } else {
        const obj = [{ name: name, occupation: occupation }];
        let response = await fetch("http://localhost:8080/writedata",
        { method: 'POST', body: JSON.stringify(obj)}).catch((error)=>{showPop("Yikes! Unable to update the details.")});

        if (response.status == 200) {
            let data = await response.json();
            window.location.reload();
        } else {
            showPop(`Unable to update the details - ${response.status}`);
        }
    }
}

deletedata = async (data) => {
    let response = await fetch("http://localhost:8080/deletedata",
    {method:'post', body: JSON.stringify(data)}).catch((error)=>{showPop("Yikes! Unable to delete.")});

    if (response.status == 200) {
        let data = await response.json();
        window.location.reload();
    } else {
        showPop(`Unable to delete - ${response.status}`);
    }
}

generateUI = (data, parent) => {
    var data = data;
    data.map((item, index) => {
        let d = document.createElement('div');
        let btn = document.createElement('img');
        d.classList.add('listitem');
        d.innerHTML = item.name + ' - ' + item.occupation;
        btn.src="close.png";
        d.appendChild(btn);
        parent.appendChild(d);
        btn.addEventListener('click', ()=>{data.splice(index,1); deletedata(data)});
    })
}

searchUI = () => {
    let val = document.querySelector('#givensearch').value.toUpperCase();
    document.querySelectorAll('.listitem').forEach((item)=>{
        if(item.innerText.toUpperCase().indexOf(val)>-1){
            item.style.display='grid';
        } else {
            item.style.display='none';
        }
    })
}

showPop = (message) => {
    popup.innerText=message;
    popup.style.display='grid';
    setTimeout(()=>{popup.style.display='none'},3000);
}

handleError = (errorMessage, parentElement) => {
    showPop(errorMessage);
    parentElement.innerHTML="<H2 style='color:red;'>Something went wrong. Please try after sometime.</H2>";
}