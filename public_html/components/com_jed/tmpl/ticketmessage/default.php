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
			<th><?php echo Text::_('COM_JED_TICKETMESSAGE_FIELD_SUBJECT_LABEL'); ?></th>
			<td><?php echo $this->item->subject; ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_TICKETMESSAGE_FIELD_MESSAGE_LABEL'); ?></th>
			<td><?php echo nl2br($this->item->message); ?></td>
		</tr>

		<tr>
			<th><?php echo Text::_('COM_JED_TICKETMESSAGE_FIELD_TICKET_ID_LABEL'); ?></th>
			<td><?php echo $this->item->ticket_id; ?></td>
		</tr>

	</table>

</div>

<?php $canCheckin = Factory::getUser()->authorise('core.manage', 'com_jed.' . $this->item->id) || $this->item->checked_out == Factory::getUser()->id; ?>
	<?php if($canEdit && $this->item->checked_out == 0): ?>

	<a class="btn btn-outline-primary" href="<?php echo Route::_('index.php?option=com_jed&task=ticketmessage.edit&id='.$this->item->id); ?>"><?php echo Text::_("COM_JED_EDIT_ITEM"); ?></a>
	<?php elseif($canCheckin && $this->item->checked_out > 0) : ?>
	<a class="btn btn-outline-primary" href="<?php echo Route::_('index.php?option=com_jed&task=ticketmessage.checkin&id=' . $this->item->id .'&'. Session::getFormToken() .'=1'); ?>"><?php echo Text::_("JLIB_HTML_CHECKIN"); ?></a>

<?php endif; ?>

<?php if (Factory::getUser()->authorise('core.delete','com_jed.ticketmessage.'.$this->item->id)) : ?>

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
                                        'footer' => '<button class="btn btn-outline-primary" data-bs-dismiss="modal">Close</button><a href="' . Route::_('index.php?option=com_jed&task=ticketmessage.remove&id=' . $this->item->id, false, 2) .'" class="btn btn-danger">' . Text::_('COM_JED_DELETE_ITEM') .'</a>'
                                    ),
                                    Text::sprintf('COM_JED_DELETE_CONFIRM', $this->item->id)
                                ); ?>

<?php endif; ?>