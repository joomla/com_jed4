<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;

$user           = Factory::getUser();
$listOrder      = $this->escape($this->state->get('list.ordering'));
$userId         = $user->get('id');

foreach ($this->items as $i => $item):

	$ordering = ($listOrder == 't.id');
	$canCreate  = $user->authorise('core.create', 'com_jed.extension.' . $item->id);
	$canEdit    = $user->authorise('core.edit', 'com_jed.extension.' . $item->id);
	$canCheckin = $user->authorise('core.manage', 'com_checkin') || $item->checked_out == $userId || $item->checked_out == 0;
	$canEditOwn = $user->authorise('core.edit.own', 'com_jed.extension.' . $item->id) && $item->created_by == $userId;
	$canChange  = $user->authorise('core.edit.state', 'com_jed.extension.' . $item->id) && $canCheckin;
	?>
	<tr class="row<?php echo $i % 2; ?>">
		<td>
			<?php echo HTMLHelper::_('grid.id', $i, $item->id); ?>
		</td>
		<td class="center" width="50">
			<div class="btn-group">
				<?php echo HTMLHelper::_('jgrid.published', $item->state, $i, 'extensions.', $canChange, 'cb', $item->publish_up, $item->publish_down); ?>
				<?php
				// Create dropdown items
				$action = ($item->state == 1) ? 'unpublish' : 'publish';
				HTMLHelper::_('actionsdropdown.' . $action, 'cb' . $i, 'extensions');

				// Render dropdown list
				echo HTMLHelper::_('actionsdropdown.render', $this->escape($item->name));
				?>
			</div>
		</td>
		<td>
			<?php echo $item->name; ?>
		</td>
		<td>
			<?php echo $item->category; ?>
		</td>
		<td>
			<?php echo $item->approved; ?>
		</td>
		<td>
			<?php echo $item->developer; ?>
		</td>
		<td>
			<?php echo $item->type; ?>
		</td>
		<td>
			<?php echo $item->no_of_reviews; ?>
		</td>

		<td>
			<?php echo $item->id; ?>
		</td>
	</tr>
<?php endforeach; ?>
