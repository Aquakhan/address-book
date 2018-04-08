window.onload = function() {
    let addBtn = document.getElementById('new');
    let clearBtn = document.getElementById('delete-all');
    let deleteBtn = document.getElementsByClassName('delete-btn');
    let submitBtn = document.getElementById('submit');
    let addContactForm = document.getElementById('add-contact');
    let contacts = document.getElementsByClassName('contact');
    let imgInput = document.getElementById('image');
    let popupContainer = document.getElementsByClassName('edit-contact-container')[0];
    let popup = document.getElementsByClassName('edit-contact')[0];
    let nameField, emailField, officeNumField, homeNumField;
    let popupVisible = false;
    let contactsArr = [];
    let contactToEdit;

    // Hide contact form on page load
    let formHidden = true;
    addContactForm.style = 'top: -100px;';

    clearBtn.addEventListener('click', function() {
        let container = document.getElementById('contacts-container');
        let newContainer = document.createElement('div');
        container.parentNode.removeChild(container);

        newContainer.setAttribute('id', 'contacts-container');
        document.getElementById('contacts-list').appendChild(newContainer);

        contactsArr = {}
    });

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        let newContact = {};
        let name, email, homeNum, officeNum;

        name = document.getElementById('name');
        email = document.getElementById('email');
        homeNum = document.getElementById('home-number');
        officeNum = document.getElementById('office-number');

        newContact.name = name.value;
        newContact.email = email.value;
        newContact.officeNum = officeNum.value;
        newContact.homeNum = homeNum.value;
        newContact.imgSrc = 'default.png';

        contactsArr.unshift(newContact);
        renderNewContact(newContact.name, newContact.email, newContact.homeNum, newContact.officeNum);
        editDeleteEvents(contactsArr.length);

        name.value = '';
        email.value = '';
        officeNum.value = '';
        homeNum.value = '';
        imgInput.value = '';

        addContactForm.style = 'top: -100px';
    });


    addBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        formHidden ? [addContactForm.style, formHidden] = ['top: 0px;', false] : [addContactForm.style, formHidden] = ['top: -100px;', true];
    });

    document.getElementById('submit-new').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        let newEmail = emailField.value;
        let newName = nameField.value;
        let newOfficeNum = officeNumField.value;
        let newHomeNum = homeNumField.value;

        if (contactToEdit === undefined) { return; }
        contactsArr[contactToEdit - 1].name = newName;
        contactsArr[contactToEdit - 1].email = newEmail;
        contactsArr[contactToEdit - 1].officeNum = newOfficeNum;
        contactsArr[contactToEdit - 1].homeNum = newHomeNum;

        let newContactInfo = `
                <div class="contact-banner">
                    <span class="contact-name">${newName}</span>
                    <div class="actions">
                        <button class="edit-button ${contactToEdit}">Edit</button>
                        <button class="delete-btn ${contactToEdit}">X</button>
                    </div>
                </div>
                <div class="contact-body">
                    <img src="${contactsArr[contactToEdit - 1].imgSrc}" alt="contact photo" class="contact-photo">
                    <div>
                        <span class="label">Name:</span>
                        <span class="name">${newName}</span>
                    </div>
                    <div>
                        <span class="label">Email:</span>
                        <span class="email">${newEmail}</span>
                    </div>
                    <div class="contact-numbers">
                        <span class="title">Contact numbers</span>
                        <div>
                            <span class="label">Home:</span>
                            <span class="number home">${newHomeNum}</span>
                        </div>
                        <div>
                            <span class="label">Office:</span>
                            <span class="number office">${newOfficeNum}</span>
                        </div>
                    </div>
                </div>
        `;

        document.getElementById(contactToEdit).innerHTML = newContactInfo;

        popupContainer.style.visibility = 'hidden';

        editDeleteEvents(contactToEdit);
    });

    // The following code handles edit popup related functions/behaviours
    popupContainer.addEventListener('click', function(e) {
        if (e.target.classList[0] === 'edit-contact-container') {
            popupContainer.style.visibility = 'hidden';
            popupVisible = false;
        }
    });

    document.getElementById('new-image').addEventListener('change', function(e) {

        if (this.files && this.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                contactsArr[contactToEdit - 1].imgSrc = e.target.result;
            }

            reader.readAsDataURL(this.files[0]);
        }

    });



    function renderNewContact(name, email, homeNum, officeNum) {
        let fragment = document.createElement('li');
        fragment.setAttribute('id', contactsArr.length);
        fragment.classList += 'contact';
        fragment.addEventListener('click', function(e) {

            let hiddenState = this.getElementsByClassName('contact-body')[0].style.display;
            let contactBody = this.getElementsByClassName('contact-body')[0];

            if (hiddenState === 'none') {
                contactBody.style.display = 'flex';
            } else {
                contactBody.style.display = 'none';
            }
        });

        let contactTemplate = `
                <div class="contact-banner">
                    <span class="contact-name">${name}</span>
                    <div class="actions">
                        <button class="edit-button ${contactsArr.length}">Edit</button>
                        <button class="delete-btn ${contactsArr.length}">X</button>
                    </div>
                </div>
                <div class="contact-body">
                    <img src="default.png" alt="contact photo" class="contact-photo">
                    <div>
                        <span class="label">Name:</span>
                        <span class="name">${name}</span>
                    </div>
                    <div>
                        <span class="label">Email:</span>
                        <span class="email">${email}</span>
                    </div>
                    <div class="contact-numbers">
                        <span class="title">Contact numbers</span>
                        <div>
                            <span class="label">Home:</span>
                            <span class="number home">${homeNum}</span>
                        </div>
                        <div>
                            <span class="label">Office:</span>
                            <span class="number office">${officeNum}</span>
                        </div>
                    </div>
                </div>
        `;

        fragment.innerHTML = contactTemplate;
        let imgTarget = fragment.getElementsByClassName('contact-photo')[0];


        loadImage(imgInput, imgTarget, contactsArr.length - 1);
        document.getElementById('contacts-container').appendChild(fragment);

    }

    function editContact(name, email, homeNum, officeNum, imgSrc) {
        emailField = document.getElementById('new-email');
        nameField = document.getElementById('new-name');
        officeNumField = document.getElementById('new-office-number');
        homeNumField = document.getElementById('new-home-number');
        emailField.value = email;
        nameField.value = name;
        officeNumField.value = officeNum;
        homeNumField.value = homeNum;

        popupContainer.style.visibility = 'visible';
        popupVisible = true;

        document.getElementById('new-image').value = '';
    }

    function renderContacts(contacts) {

    }

    function loadImage(input, imgTarget, position) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                imgTarget.attributes.src.value = e.target.result;
                contactsArr[position].imgSrc = e.target.result;
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function editDeleteEvents(position) {
        document.getElementsByClassName(position)[1].addEventListener('click', function(e) {
            let index = e.target.classList[1];
            document.getElementById(index).parentNode.removeChild(document.getElementById(index));
            contactsArr.splice(index - 1, 1);
        });

        document.getElementsByClassName(position)[0].addEventListener('click', function(e) {
            e.stopPropagation();
            contactToEdit = e.target.classList[1];
            editContact(
                contactsArr[position - 1].name,
                contactsArr[position - 1].email,
                contactsArr[position - 1].homeNum,
                contactsArr[position - 1].officeNum,
                contactsArr[position - 1].imgSrc
            );
        });
    }
};