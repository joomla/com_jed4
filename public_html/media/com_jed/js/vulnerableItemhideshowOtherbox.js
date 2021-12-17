//**
// * @package       JED
// *
// * @subpackage    Vulnerable Extensions List
// *
// * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
// * @license       GNU General Public License version 2 or later; see LICENSE.txt
// */

let velexploits = document.getElementById("jform_exploit_type"); //The Joomla SQL Field
let velexploitother = document.getElementById("jform_exploit_other_description"); //Other Field
if(velexploits.value != 9) {
velexploitother.style.display = 'none';
}
velexploits.addEventListener('change', function () {
    if (velexploits.value == 9) {
        velexploitother.style.display = 'block';
    } else {
        velexploitother.style.display = 'none';
    }

})



