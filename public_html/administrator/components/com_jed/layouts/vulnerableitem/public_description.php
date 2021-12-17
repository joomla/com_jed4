<?php
/**
 * @package       JED
 *
 * @subpackage    VEL
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */
// No direct access to $displayData file
defined('_JEXEC') or die('Restricted access');

$headerlabeloptions = array('hiddenLabel' => true);
$fieldhiddenoptions = array('hidden' => true);
?>

	<div class="row ticket-header-row">
		<div class="col-md-12 ticket-header">
			<h1>Public Description <button type="button" class="" id="buildPublicDescription">
									<span class="icon-wand"></span>
                    </button></h1>
			<?php echo $displayData->renderField('public_description', null, null, $headerlabeloptions); ?>
		</div>
	</div>
	<div class="row ticket-header-row">
		<div class="col-md-12 ticket-header">
			<h1>Alias <button type="button" class="" id="buildAlias">
									<span class="icon-wand"></span>
                    </button></h1>
			<?php echo $displayData->renderField('alias', null, null, $headerlabeloptions); ?>
		</div>
	</div>
   

