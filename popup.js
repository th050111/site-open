const mainContainer = document.querySelector("#container")
const mainContentContainer = document.querySelector("#content-container")
const mainAddContainer = document.querySelector("#add-list-container")
const openBtn = document.querySelector(".open-btn")



let siteList = []
init()
function init() {
	loadSiteList();
	//add form
	mainAddContainer.querySelector("form.add-form").addEventListener("submit", (e) => {
		e.preventDefault()
		const value = mainAddContainer.querySelector("form.add-form input").value;
		document.querySelector("form.add-form input").value = "";
		const form = mainAddContainer.querySelector(".toggle-add-form");
		form.classList.toggle("open")
		onAddListTitleSumbit(value)
	})
	//add form toggle
	mainAddContainer.querySelector(".add-btn").addEventListener("click", () => {
		const form = mainAddContainer.querySelector(".toggle-add-form");
		form.classList.toggle("open")
	})
}

function onAddListTitleSumbit(value) {
	const newObj = {
		title: value,
		siteList: []
	}
	const list = [...siteList];
	list.unshift(newObj)
	const i = 0;
	siteList = list;
	setSiteList()
	loadSiteList()
}

function setSiteList() {
	localStorage.setItem("site-list", JSON.stringify(siteList))
}

function loadSiteList() {
	const loadedList = localStorage.getItem("site-list")
	console.log(loadedList)
	if (loadedList !== null) {
		const parsedList = JSON.parse(loadedList.toString())
		siteList = parsedList;
	}
	mainContentContainer.innerHTML = ""
	console.log(siteList)
	siteList.forEach((el, index) => {
		drawSiteList(el, index)
	});
}

function onAddSumbit(value, index) {
	let list = [...siteList];
	list[index].siteList.unshift(value)
	setSiteList();
	loadSiteList()
}

function deleteList(index) {
	let list = [...siteList];
	list.splice(index, 1);
	siteList = list;
	setSiteList();
	loadSiteList()
}

function drawSiteList(el, index) {
	const contentContainer = document.createElement("div")
	contentContainer.style = "display:block"
	contentContainer.innerHTML = `
	<div class="content-header">
		<span class="list-title">${el.title}</span>
		<div class="btns">
			<button class="open-btn">open</button>
			<button class="add-btn">add</button>
			<button class="delete-list-btn">x</button>
		</div>
	</div>
	<div class="toggle-add-form">
		<form class="add-form">
			<input type="text" minlengt="4">
		</form>
		<button title="add current site"class="add-current-site">+</button>
	</div>
	<div class="site-list">
	</div>
	`

	//add current site
	contentContainer.querySelector(".toggle-add-form .add-current-site").addEventListener("click", () => {
		let currentSite;
		chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
			currentSite = tab[0].url
			const currentValue = contentContainer.querySelector(".toggle-add-form form input").value;
			console.log(currentSite)
			if (currentSite !== currentValue) {
				contentContainer.querySelector(".toggle-add-form form input").value = currentSite;
			} else {
				const value = contentContainer.querySelector("form.add-form input").value;
				document.querySelector("form.add-form input").value = "";
				const form = contentContainer.querySelector(".toggle-add-form");
				form.classList.toggle("open")
				onAddSumbit(value, index)
			}
		});
	})
	//delete list
	contentContainer.querySelector(".delete-list-btn").addEventListener("click", () => {
		deleteList(index);
	})
	//add form
	contentContainer.querySelector("form.add-form").addEventListener("submit", (e) => {
		e.preventDefault()
		const value = contentContainer.querySelector("form.add-form input").value;
		document.querySelector("form.add-form input").value = "";
		const form = contentContainer.querySelector(".toggle-add-form");
		form.classList.toggle("open")
		onAddSumbit(value, index)
	})
	//add form toggle
	contentContainer.querySelector(".add-btn").addEventListener("click", () => {
		const form = contentContainer.querySelector(".toggle-add-form");
		form.classList.toggle("open")
	})
	//open-btn
	contentContainer.querySelector(".open-btn").addEventListener('click', () => openSite(el))

	//site-list DOM
	const siteListDiv = contentContainer.querySelector(".site-list")
	for (let i = 0; i < el.siteList.length; i++) {
		const container = document.createElement('div');
		container.style.display = "flex"
		container.className = "site-list-container"
		const div = document.createElement('div');
		div.className = "site-title";

		//delet btn
		const deleteBtn = document.createElement('button');
		deleteBtn.innerHTML = "x"
		deleteBtn.addEventListener('click', () => {
			let list = siteList;
			const deletIndex = list[index].siteList.indexOf(el.siteList[i])
			list[index].siteList.splice(deletIndex, 1)
			setSiteList();
			loadSiteList()
		})

		//edit btn
		const editBtn = document.createElement('button');
		editBtn.innerHTML = "edit"
		editBtn.addEventListener('click', () => {
			const changeDiv = siteListDiv.childNodes.item(i + 1).querySelector(".site-title")
			const changeInput = siteListDiv.childNodes.item(i + 1).querySelector(".site-input")
			const a = document.createElement("form")
			a.className = "site-input"
			const input = document.createElement("input")
			input.value = el.siteList[i];
			a.appendChild(input)
			a.addEventListener('submit', (e) => {
				e.preventDefault();
				const value = input.value;
				let list = siteList;
				const deletIndex = list[index].siteList.indexOf(el.siteList[i])
				list[index].siteList.splice(deletIndex, 1)
				onAddSumbit(value, index)
			})
			if (!changeDiv) {
				const value = changeInput.querySelector("input").value;
				let list = siteList;
				const deletIndex = list[index].siteList.indexOf(el.siteList[i])
				list[index].siteList.splice(deletIndex, 1)
				onAddSumbit(value, index)
			} else {
				siteListDiv.childNodes.item(i + 1).replaceChild(a, changeDiv)
			}
		})

		div.innerHTML = el.siteList[i];
		container.appendChild(div)
		container.appendChild(editBtn)
		container.appendChild(deleteBtn)
		siteListDiv.appendChild(container)
	}
	contentContainer.appendChild(siteListDiv)
	console.log(contentContainer)
	mainContentContainer.appendChild(contentContainer)
}

function openSite(el) {
	for (let i = 0; i < el.siteList.length; i++)
		chrome.tabs.create({ active: false, url: el.siteList[i] });
}