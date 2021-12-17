<?php
/**
 * @package       JED
 *
 * @subpackage    TICKETS
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access
defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Session\Session;

$canEdit = Factory::getUser()->authorise('core.edit', 'com_jed');

if (!$canEdit && Factory::getUser()->authorise('core.edit.own', 'com_jed'))
{
	$canEdit = Factory::getUser()->id == $this->item->created_by;
}
?>

<div class="item_fields">

	<table class="table">
		

		<tr>
			<th><?php echo Text::_('COM_JED_FORM_LBL_JEDTICKET_ID'); ?></th>
			<td><?php echo $this->item->id; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_TICKET_ORIGIN_LABEL'); ?></th>
			<td><?php echo $this->item->ticket_origin; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_TICKET_CATEGORY_TYPE_LABEL'); ?></th>
			<td><?php echo $this->item->ticket_category_type; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_TICKET_SUBJECT_LABEL'); ?></th>
			<td><?php echo $this->item->ticket_subject; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_TICKET_TEXT_LABEL'); ?></th>
			<td><?php echo nl2br($this->item->ticket_text); ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_INTERNAL_NOTES_LABEL'); ?></th>
			<td><?php echo nl2br($this->item->internal_notes); ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_UPLOADED_FILES_PREVIEW_LABEL'); ?></th>
			<td><?php echo $this->item->uploaded_files_preview; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_UPLOADED_FILES_LOCATION_LABEL'); ?></th>
			<td><?php echo $this->item->uploaded_files_location; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_ALLOCATED_GROUP_LABEL'); ?></th>
			<td><?php echo $this->item->allocated_group; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_ALLOCATED_TO_LABEL'); ?></th>
			<td><?php echo $this->item->allocated_to_name; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_LINKED_ITEM_TYPE_LABEL'); ?></th>
			<td><?php echo $this->item->linked_item_type; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_LINKED_ITEM_ID_LABEL'); ?></th>
			<td><?php echo $this->item->linked_item_id; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('JSTATUS'); ?></th>
			<td><?php echo $this->item->ticket_status; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_PARENT_ID_LABEL'); ?></th>
			<td><?php echo $this->item->parent_id; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_FORM_LBL_JEDTICKET_STATE'); ?></th>
			<td>
			<i class="icon-<?php echo ($this->item->state == 1) ? 'publish' : 'unpublish'; ?>"></i></td>
		</tr>

		<tr>
			<th><?php echo Text::_('JGLOBAL_FIELD_CREATED_BY_LABEL'); ?></th>
			<td><?php echo $this->item->created_by_name; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_CREATED_ON_LABEL'); ?></th>
			<td><?php echo $this->item->created_on; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('JGLOBAL_FIELD_MODIFIED_BY_LABEL'); ?></th>
			<td><?php echo $this->item->modified_by_name; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_JEDTICKETS_FIELD_MODIFIED_ON_LABEL'); ?></th>
			<td><?php echo $this->item->modified_on; ?></td>
		</tr>

	</table>

</div>

<?php $canCheckin = Factory::getUser()->authorise('core.manage', 'com_jed.' . $this->item->id) || $this->item->checked_out == Factory::getUser()->id; ?>
	<?php if($canEdit && $this->item->checked_out == 0): ?>

	<a class="btn btn-outline-primary" href="<?php echo Route::_('index.php?option=com_jed&task=jedticket.edit&id='.$this->item->id); ?>"><?php echo Text::_("COM_JED_EDIT_ITEM"); ?></a>
	<?php elseif($canCheckin && $this->item->checked_out > 0) : ?>
	<a class="btn btn-outline-primary" href="<?php echo Route::_('index.php?option=com_jed&task=jedticket.checkin&id=' . $this->item->id .'&'. Session::getFormToken() .'=1'); ?>"><?php echo Text::_("JLIB_HTML_CHECKIN"); ?></a>

<?php endif; ?>

<?php if (Factory::getUser()->authorise('core.delete','com_jed.jedticket.'.$this->item->id)) : ?>

	<a class="btn btn-danger" rel="noopener noreferrer" href="#deleteModal" role="button" data-bs-toggle="modal">
		<?php echo Text::_("COM_JED_DELETE_ITEM"); ?>
	</a>

	<?php echo HTMLHelper::_(
                                    'bootstrap.renderModal',
                                    'deleteModal',
                                    array(
                                        'title'  => Text::_('COM_JED_DELETE_ITEM'),
                                        'height' => '50%',
                                        'width'  => '20%',
                                        
                                        'modalWidth'  => '50',
                                        'bodyHeight'  => '100',
                                        'footer' => '<button class="btn btn-outline-primary" data-bs-dismiss="modal">Close</button><a href="' . Route::_('index.php?option=com_jed&task=jedticket.remove&id=' . $this->item->id, false, 2) .'" class="btn btn-danger">' . Text::_('COM_JED_DELETE_ITEM') .'</a>'
                                    ),
                                    Text::sprintf('COM_JED_DELETE_CONFIRM', $this->item->id)
                                ); ?>

<?php endif; ?>