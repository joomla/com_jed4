

Joomla.submitbutton = function (task) {
window.alert(task);
    if (task == '') {
        return false;
    } else {
        let action = task.split('.');
             
        if (action[1] == 'buildTitle') {


            let com_title = document.getElementById('jform_vulnerable_item_name').value;
            let com_version = document.getElementById('jform_vulnerable_item_version').value;
            let com_exploit = document.getElementById('mf_exploit_type').value;
            
            document.getElementById('jform_title').value = com_title.concat(', ', com_version, ', ', com_exploit);
            return false;
        }
        if (action[1] == 'buildInternalDescription') {
            document.getElementById('jform_internal_description').value('Sorry not implmented yet');

            return false;
        }
        if (action[1] == 'buildPublicDescription') {

            let com_text = '<p>';
            let com_ntitle = document.getElementById('jform_vulnerable_item_name').value;
            let com_oldversion = document.getElementById('jform_start_version').value;
            let com_newversion = document.getElementById('jform_patch_version').value;
            let com_updateurl = document.getElementById('jform_update_notice').value;
            let com_descript = com_text.concat('Name: ', com_ntitle, ' Old: ', com_oldversion, ' / New: ', com_newversion, '</p> \r\n <p>Update details: </p> \r\n <p>Update URL: ', com_updateurl, '</p>');
            alert(com_descript);
            //Joomla.editors.instances['jform_description'].setValue(com_descript);
            tinyMCE.get('jform_public_description').execCommand('SelectAll');
            tinyMCE.get('jform_public_description').execCommand('Delete');
            tinyMCE.get('jform_public_description').execCommand('mceInsertContent', false, 'hello');
            return false;

        }
        if (action[1] == 'contactDeveloper') {
            document.getElementById('emailModal').showModal();
            return false;
        }

        if (action[1] == 'cancel' || action[1] == 'close' || document.formvalidator.isValid(document.getElementById("adminForm"))) {
            Joomla.submitform(task, document.getElementById("adminForm"));
            return true;
        } else {
            alert(Joomla.JText._('vulnerable_item, some values are not acceptable.', 'Some values are unacceptable'));
            return false;
        }
    }
}