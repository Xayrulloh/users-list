let users = JSON.parse(window.localStorage.getItem('users')) || []
let allItems = document.querySelector('#all-items')
// let pageItem = document.querySelectorAll('.page-item')
usersList.innerHTML = null
let knowEdit = null

readData()

saveButton.onclick = (e) => {
    e.preventDefault()
    if (fullname.value.length <= 30 && fullname.value.length && username.value.length <= 30 && username.value.length && !username.value.includes(' ') && email.value.slice(-4) == '.com' && email.value.includes('@') && bio.value.length && password.value.length >= 8 && password.value === confirmP.value) {
      if (knowEdit) {
        for (let user of users) {
          if (user.id == knowEdit) {
            [user.fullname, user.username, user.email, user.bio, user.password] = [fullname.value, username.value, email.value, bio.value, password.value]
            break
          }
        }
        writeToLocalStorage()
      } else {
        users.push({fullname: fullname.value, username: username.value, email: email.value, bio: bio.value, password: password.value, id:Date.now().toString().slice(-4)})
        writeToLocalStorage()
        users = JSON.parse(window.localStorage.getItem('users')) || []
        usersList.innerHTML = null
        readData()
        window.location.href = './index.html'
      }
    

    } else {
        alert('invalid input')
    }
    [fullname.value, username.value, email.value, bio.value, password.value, confirmP.value] = [null, null, null, null, null, null]
}

allItems.onclick = () => {
  const checkboxs = document.querySelectorAll('.custom-control-inputt')

  for (const i of checkboxs) {
    if(i.checked){
      i.checked = false
    } else {
      i.checked = true
    }
  }
}

if (edit.length >= 2 && edit) {
  for (let ed of edit) {
    ed.onclick = () => {
      knowEdit = ed.getAttribute('name')
    }
  }
} else {
  edit.onclick = () => {
    knowEdit = edit.getAttribute('name')
  }
}

if (trash.length >= 2 && trash) {
  for (let tr of trash) {
    tr.onclick = () => {
      let simple = []
    for (let user of users) {
      if (user.id != tr.getAttribute('name')) {
        simple.push(user)
      }
    }
    users = [...simple]
    writeToLocalStorage()
  }
}
} else {
  trash.onclick = () => {
    let simple = []
    for (let user of users) {
      if (user.id != trash.getAttribute('name')) {
        simple.push(user)
      }
    }
    users = [...simple]
    writeToLocalStorage()
  }
}

if (select.length >= 2 && select) {
  for (let selec of select) {
    selec.onclick = () => {
      selec.classList.toggle('fa-toggle-on')
    }
  }
} else {
  select.onclick = () => {
    select.classList.toggle('fa-toggle-on')
  }
}


// for (page of pageItem) {  tuzatwm kere
//   page.onclick = (e) => {
//     for (const i of pageItem) {
//       i.classList.remove('active')
//       // console.log(e.target.add('active'));
//     }
//     console.log(e.target.add('active')); 
//     // e.target.classList.add('active')
//   }
// }







function readData () {
  for (let user of users) {
      usersList.innerHTML += `<tr>
    <td class="align-middle">
      <div class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top">
        <input type="checkbox" class="custom-control-inputt custom-control-input" id="${user.id}">
        <label class="custom-control-label" for="${user.id}"></label>
      </div>
    </td>
    <td class="text-nowrap align-middle">${user.fullname}</td>
    <td class="text-nowrap align-middle"><span>${new Date().getDate()} ${getmon(new Date().getMonth())} ${new Date().getFullYear()}</span></td>
    <td class="text-center align-middle"><i id="select" class="fa fa-fw text-secondary cursor-pointer fa-toggle-off"></i></td>
    <td class="text-center align-middle">
      <div class="btn-group align-top"> 
          <button id="edit" name="${user.id}" class="btn btn-sm btn-outline-secondary badge" type="button" data-toggle="modal" data-target="#user-form-modal">Edit</button>
          <button id="trash" name="${user.id}" class="btn btn-sm btn-outline-secondary badge" type="button"><i class="fa fa-trash"></i></button>
      </div>
    </td>
  </tr>
  <tr>`
  }

  

  // page.innerHTML = null
  // let [length, a] = [users.length, 1]
  // while (length >= 10) {
  //   if (a == 1) {
  //     page.innerHTML += `<li class="active page-item"><a href="#" class="page-link">${a}</a></li>`
  //     a++
  //     length -= 10
  //   }else {
  //     page.innerHTML += `<li class="page-item"><a href="#" class="page-link">${a}</a></li>`
  //     length -= 10
  //     a++
  //   }
  // }
  // if (length) {
  //   page.innerHTML += `<li class="page-item"><a href="#" class="page-link">${a}</a></li>`
  // }
  // pageItem = document.querySelectorAll('.page-item')
}


function getmon(num) {
    let obj = {0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5:'Jun', 6:'Jul', 7:'Aug', 8:'Sep', 9:'Oct', 10:'Nov', 11:'Dec'}
    return obj[num]
}


function writeToLocalStorage() {
  window.localStorage.setItem('users', JSON.stringify(users))
  window.location.href = './index.html'
}






