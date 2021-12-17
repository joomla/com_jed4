<?php
/**
 * @package       JED
 *
 * @subpackage    Tickets
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */
// No direct access to file
defined('_JEXEC') or die('Restricted access');


use Joomla\CMS\Language\Text;

$headerlabeloptions = array('hiddenLabel' => true);
$fieldhiddenoptions = array('hidden' => true);
//var_dump($displayData);exit();
$rawData = $displayData->getData();

/* Set up Data fieldsets */

$fieldsets['aboutyou']['title'] = JTEXT::_('COM_JED_VEL_REPORT_ABOUT_YOU_TITLE');

$fieldsets['aboutyou']['fields'] = array(
	'reporter_fullname',
	'reporter_email',
	'reporter_organisation');

$fieldsets['extensiondetails']['title']  = JTEXT::_('COM_JED_VEL_ABANDONEDREPORT_EXTENSION_TITLE');
$fieldsets['extensiondetails']['fields'] = array(
	'extension_name',
	'developer_name',
	'extension_version',
	'extension_url',
	'abandoned_reason',
	'consent_to_process');

?>
<div class="row">
    <div class="col">
        <div class="widget">
            <h1><?php echo $fieldsets['extensiondetails']['title']; ?></h1>
            <div class="container">
                <div class="row">
					<?php foreach ($fieldsets['extensiondetails']['fields'] as $field)
					{

						$displayData->setFieldAttribute($field, 'readonly', 'true');
						echo $displayData->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


					} ?>
                </div>
            </div>
        </div>
    </div>

    <div class="col">
        <div class="widget">
            <h1><?php echo $fieldsets['aboutyou']['title']; ?></h1>
            <div class="container">
                <div class="row">
					<?php foreach ($fieldsets['aboutyou']['fields'] as $field)
					{

						$displayData->setFieldAttribute($field, 'readonly', 'true');
						echo $displayData->renderField($field, null, null, array('class' => 'control-wrapper-' . $field));


					} ?>
                </div>
            </div>
        </div>

        <div class="widget">
            <h1>Actions</h1>
			<?php // print_r($this->linked_item_data[0]);
			?>
            <div class="container">
                <div class="row">
               <?php
				if($rawData->get('vel_item_id') > 0) 
				{
					echo Text::_('No Actions available');
				}
				else
				{
                    ?>
                     <button type="button" class="btn btn-primary"
                                        onclick="Joomla.submitbutton('jedticket.copyAbandonedReporttoVEL')">
									<?php echo Text::_('Create VEL Abandoned Item'); ?>
                    </button>
                    <?php
				} ?>
                </div>
            </div>
        </div>
    </div>
</div>