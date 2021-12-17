// JavaScript Document

var modalbox = document.getElementById("modal-box");
var modalSave = document.getElementById("modal-save");
if (modalbox) {
	var modalTitle = modalbox.querySelector('.modal-title');
	var modalBody = modalbox.querySelector('.modal-body');	
}

modalbox && modalbox.addEventListener('show.bs.modal', function (event) {
	// Button that triggered the modal
	let button = event.relatedTarget;
	// Extract info from data-bs-* attributes
	let title = button.getAttribute('data-bs-title');
	let action = button.getAttribute('data-bs-action');
	let item_id  = button.getAttribute('data-bs-id');
	modalTitle.textContent = title;
	// Set the modal content empty.
	modalBody.textContent = 'Fetching content - Please Wait!';
	// get the description and set in modal-body
  
	if (action == 'showCampDescription') {
		// this is a simple display so the action button should not be seen
		modalSave.classList.add('hidden');
		setModalContent('Jedticket.showCampDescription', button.getAttribute('data-bs-id'), '')
	}
    if (action == 'getTemplate') {
		// this is a simple display so the action button should not be seen
		modalSave.classList.add('hidden');
        var templates = document.getElementById("jform_messagetemplates");
		setModalContent('Jedticket.getTemplate', templates.value, 'true')
	}
	/* many more action options each with an async funtion to fetch data*/
	
})

async function setModalContent(itemTask, itemId, saveTask) {
  
	const token = Joomla.getOptions('csrf.token', '');
	let url = 'index.php?option=com_jed&task=' + itemTask+'&format=raw';

	let data = new URLSearchParams();
	data.append(`itemId`, itemId);
	data.append(token, 1);
	const options = {
		method: 'POST',
		body: data
	}
    //alert(itemId);
	let response = await fetch(url, options);
	if (!response.ok) {
		throw new Error (Joomla.Text._('COM_MYCOMPONENT_JS_ERROR_STATUS') + `${response.status}`);
	} else {
		let result = await response.text();
      //  alert(result);
        
      //  alert(textbox.value);
        modalBody.textContent = result;
		let description = document.querySelector(".modal-body");
		description.innerHTML = result;
        tinyMCE.get('jform_message_text').execCommand('mceInsertContent', false, result);
		let modalSave = document.querySelector("#modal-save");
		if (saveTask) {
			modalSave.setAttribute('saveTask', saveTask);
			modalSave.classList.remove('hidden');
		} else {
			modalSave.classList.add('hidden');
		}
	}
}