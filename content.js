let isPassed = false;
let isFirst = true;
let interval;

let password;
chrome.storage.local.get(['password'],(result)=>{
	password =  (result.password)
});

	window.addEventListener('focus', function() {
		if(isPassed){
			alert("hi")
		} else{
			if(isFirst){
				interval = setInterval(makeDiv,100);
			}
		}
	}, false);
	window.addEventListener('blur', function() {
		clearInterval(interval)
		isPassed = false;
		makeDiv();
		isFirst = true;
	}, false);



//init()


function makeDiv(){
	if(!document.querySelector(".pass-btn-on-extension") && !isPassed){
		const title = document.head.querySelector("title").innerText;
		document.head.querySelector("title").innerText = "locked-site"
		const imgURL = chrome.runtime.getURL('./lock.png')
		const img = document.createElement('div');
		img.innerHTML='<img class="lock-icon" src="'+imgURL+'"><br>'
		const div = document.createElement("div")
		div.className = "pass-btn-on-extension";
		const form = document.createElement("form")
		form.className="input-container-on-extension"
		form.innerHTML = "<input type='password' required autofocus/><button type='submit'>submit</button>"
		form.addEventListener("submit",(e)=>{
			e.preventDefault();
			const value = document.querySelector(".input-container-on-extension input").value;
			if(CryptoJS.MD5(value).toString() === password){
				isPassed = true;
				const removeDiv = document.querySelector(".pass-btn-on-extension")
				clearInterval(interval)
				document.body.removeChild(removeDiv)
			} else{
				alert("wrong password");
			}
			document.head.querySelector("title").innerText = title;
		})
		div.appendChild(form)
		document.body.appendChild(div)
		document.querySelector(".pass-btn-on-extension").appendChild(img);
		isFirst = false;
	}
	if(document.querySelector(".pass-btn-on-extension"))
	{
		document.querySelector(".pass-btn-on-extension").querySelector("input").focus();
	}
}
