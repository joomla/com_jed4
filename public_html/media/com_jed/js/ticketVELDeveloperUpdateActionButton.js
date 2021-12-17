//**
// * @package       JED
// *
// * @subpackage    Tickets / Vulnerable Item List
// *
// * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
// * @license       GNU General Public License version 2 or later; see LICENSE.txt
// */

let velitems = document.getElementById("jform_vel_item_id"); //The Joomla SQL Field
let veldeveloperbutton = document.getElementById("veldeveloperbutton"); //Empty Div
velitems.addEventListener('change', function () {
    if (velitems.value > -1) {
        veldeveloperbutton.innerHTML = " <button type=\"button\" class=\"btn btn-primary\" onclick=\"Joomla.submitbutton('jedticket.linkDeveloperUpdatetoVEL')\">Link Developer Report to VEL Item </button>";
    } else {
        veldeveloperbutton.innerHTML = "";
    }

})



