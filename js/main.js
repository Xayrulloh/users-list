class UserSystem {
	tableBody = document.querySelector('#tableBody')
	paginationEl = document.querySelector('.pagination')
	page = 1
	limit = 5
	editId = null

	get users () {
		const users = window.localStorage.getItem('users')
		return JSON.parse(users) || mockUsers
	}

	get html () {
		return {
			usersEl
		}
	}

	save (data) {
		window.localStorage.setItem('users', JSON.stringify(data))
	}

	renderUsers ({ active, search, page }) {
		// filter
		let users = this.users.filter(user => {
			let act = typeof(active) == 'boolean' ? user.active == active : true
			let sea = search ? user.fullName.toLowerCase().includes(search.toLowerCase()) : true
			return act && sea
		})

		// pagination
		users = users.slice(page * this.limit - this.limit, this.limit * page)

		// render users
		this.tableBody.innerHTML = null
		for(let user of users) {
			let htmlEl = this.html.usersEl(user)
			this.tableBody.innerHTML += htmlEl
		}
	}

	selectUser (element) {
		const users = this.users
		if(element) {
			const userId = element.parentNode.parentNode.parentNode.dataset.userid
			const user = users.find(user => user.userId == userId)
			user.selected = element.checked
		}
		this.save(users)
		this.selectedUsersCount()
	}

	toggleUser (element) {
		const userId = element.parentNode.parentNode.dataset.userid
		const users = this.users
		const user = users.find(user => user.userId == userId)

		const elementClass = element.classList[4]
		if(elementClass == 'fa-toggle-on') {
			element.classList.remove('fa-toggle-on')
			element.classList.add('fa-toggle-off')
		}
		
		if(elementClass == 'fa-toggle-off') {
			element.classList.remove('fa-toggle-off')
			element.classList.add('fa-toggle-on')
		}
		user.active = !user.active
		this.save(users)
		this.activeUsers()
	}

	paginationButtons () {
		const numberOfPages = Math.ceil(this.users.length / this.limit)

		this.paginationEl.innerHTML = null
		for(let page = 1; page <= numberOfPages; page++) {
			let newButtonEl = buttonsEl({ page })
			this.paginationEl.innerHTML += newButtonEl
		}
	}

	findPage (html) {
		const buttons = document.querySelectorAll('.page-item')
		buttons.forEach(el => el.classList.remove('active'))

		html.classList.add('active')
		this.renderUsers({ page: html.dataset.page })
	}

	deleteUser (element) {
		const userId = element.parentNode.parentNode.parentNode.parentNode.dataset.userid
		const users = this.users
		const user = []
		for (const useR of users) if (useR.userId != userId) user.push(useR)
		this.save(user)
		this.allUsers()
		element.parentNode.parentNode.parentNode.parentNode.remove()
	}

	selectedUsersCount () {
		let count = 0
		for (let user of this.users) {
			if (user.selected) ++count
		}
		return selected.textContent = count
	}

	activeUsers () {
		let count = 0
		for (let user of this.users) if (user.active) ++count
		return actives.textContent = count
	}

	allUsers () {
		const users = this.users
		return all.textContent = `/ ${users.length}`
	}

	editUser (element) {
		const userId = element.parentNode.parentNode.parentNode.dataset.userid
		this.editId = userId
		const users = this.users
		for (const useR of users) {
			if (useR.userId == userId) {
				[fullname.value, username.value, email.value, bio.value, newPassword.value, again.value] = [useR.fullName, useR.username, useR.email, useR.bio, useR.password, useR.password]
			}
		}
	}

	createUser () {
		[fullname.value, username.value, email.value, bio.value, newPassword.value, again.value] = [null, null, null, null, null, null]
	}

	getmon(num) {
		    let obj = {0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5:'Jun', 6:'Jul', 7:'Aug', 8:'Sep', 9:'Oct', 10:'Nov', 11:'Dec'}
		    return obj[num]
	}

	status (about) {
		this.tableBody.innerHTML = null
		if (about == 'disabled') {
			for (let user of this.users) {
				if (!user.active) {
					this.tableBody.innerHTML += this.html.usersEl(user)
				}
			}
		}
		else if (about == 'active') {
			for (let user of this.users) {
				if (user.active) {
					this.tableBody.innerHTML += this.html.usersEl(user)
				}
			}
		}
		else if (about == 'any') {
			this.renderUsers()
		}
	} 

	searchSelectedUsers () {
		this.tableBody.innerHTML = null
		for (let user of this.users) {
			if (user.selected) {
				this.tableBody.innerHTML += this.html.usersEl(user)
			}
		}
	}

	saveChanges () {
		if (fullname.value.length <= 30 && fullname.value.length && username.value.length <= 30 && username.value.length && !username.value.includes(' ') && email.value.slice(-4) == '.com' && email.value.includes('@') && newPassword.value.length >= 4 && newPassword.value === again.value) {
			const users = this.users
			if (this.editId) {
				for (const user of users) {
					if (user.userId == this.editId) {
						[user.fullName, user.username, user.email, user.bio, user.password] = [fullname.value, username.value, email.value, bio.value, newPassword.value]
						break
					}
				}
				this.save(users)
				this.editId = null
			} else {
				let id = Date.now().toString().slice(-4)
				let date = `${new Date().getDate()} ${this.getmon(new Date().getMonth())} ${new Date().getFullYear()}`
				let newUser = {userId: id, username: username.value, fullName: fullname.value, email: email.value, bio: bio.value, password: newPassword.value, selected: false, active:false, date}
				users.push(newUser)
				this.save(users)
			}
		}else {
			alert('invalid input')
		}
		window.location.reload()
		[fullname.value, username.value, email.value, bio.value, newPassword.value, again.value] = [null, null, null, null, null, null]
	}

	importantCheckbox (el) {
		let users = this.users
		this.tableBody.innerHTML = null
		for (let user of users) {
			user.selected = el
			this.tableBody.innerHTML += this.html.usersEl(user)
		}
		this.save(users)
		this.selectedUsersCount()
	}

	searchUsers (name) {
		this.tableBody.innerHTML = null
		for (let user of this.users) {
			if (user.fullName.toLowerCase().includes(name.toLowerCase())) this.tableBody.innerHTML += this.html.usersEl(user)
		}
	}

}

const userSystem = new UserSystem()
userSystem.renderUsers({})
userSystem.paginationButtons()
userSystem.allUsers()
userSystem.activeUsers()
userSystem.selectedUsersCount()

// event handlers
search.onkeyup = () => {
	userSystem.searchUsers(search.value)
}

function disabledUsers() {
	userSystem.status('disabled')
}

function activesUsers() {
	userSystem.status('active')
}

function anyUsers() {
	userSystem.status('any')
}

function searchSelectedUsers () {
	userSystem.searchSelectedUsers()
}

function selectUser (html) {
	userSystem.selectUser(html)
}

function toggleUser (html) {
	userSystem.toggleUser(html)
}

function deleteUser(html) {
	userSystem.deleteUser(html)
}

function editUser(html) {
	userSystem.editUser(html)
}

function addNewUser(html) {
	userSystem.createUser(html)
}

saveChanges.onclick = el => {
	el.preventDefault()
	userSystem.saveChanges()
}

function importantCheckbox (html) {
	userSystem.importantCheckbox(html.checked)
}

function findPage(html) {
	userSystem.findPage(html)
}




