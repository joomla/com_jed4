<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;

/** @var @this JedViewSuspiciousips $this */

$user       = Factory::getUser();
$userId     = $user->get('id');
$listOrder  = $this->escape($this->state->get('list.ordering'));
$listDirn   = $this->escape($this->state->get('list.direction'));
$canOrder   = $user->authorise('core.edit.state', 'com_jed.suspiciousips');

HTMLHelper::_('formbehavior.chosen');
?>
<form action="<?php echo 'index.php?option=com_jed&view=suspiciousips'; ?>" method="post" name="adminForm"
      id="adminForm">
	<?php if (!empty($this->sidebar)) : ?>
	<div id="j-sidebar-container" class="span2">
		<?php echo $this->sidebar; ?>
	</div>
	<div id="j-main-container" class="span10">
		<?php else : ?>
		<div id="j-main-container">
			<?php endif; ?>
			<?php echo LayoutHelper::render('joomla.searchtools.default', ['view' => $this]); ?>
			<?php if (empty($this->items)) : ?>
				<div class="alert alert-no-items">
					<?php echo Text::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
				</div>
			<?php else : ?>
				<table class="table table-striped">
                    <thead>
					<tr>
						<th width="20">
							<input type="checkbox" name="toggle" value="" onclick="checkAll(<?php echo count($this->items); ?>);"/>
						</th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_CREATED_DATE'); ?>
						</th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_CREATED_BY'); ?>
						</th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_IPADDR'); ?>
						</th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_REASON'); ?>
						</th>

						<th width="5">
							<?php echo Text::_('JGRID_HEADING_ID'); ?>
						</th>
					</tr>
                    </thead>
                    <tfoot>
                    <td colspan="7">
	                    <?php echo $this->pagination->getListFooter(); ?>
                    </td>
                    </tfoot>
                    <tbody>
					<?php

					foreach ($this->items as $i => $item):
						$canEdit = $user->authorise('core.edit', 'com_jed.suspiciousip.' . $item->id);
						$canCheckin = $user->authorise('core.manage', 'com_checkin') || $item->checked_out == $userId || $item->checked_out == 0;
						$canEditOwn = $user->authorise('core.edit.own', 'com_jed.suspiciousip.' . $item->id) && $item->created_by == $userId;
						$canChange = $user->authorise('core.edit.state', 'com_jed.suspiciousip.' . $item->id) && $canCheckin;
						?>
						<tr>
							<td>
								<?php echo HTMLHelper::_('grid.id', $i, $item->id); ?>
							</td>
							<td>
								<?php echo $item->created_time; ?>
							</td>
							<td>
								<?php echo $item->created_by; ?>
							</td>
							<td>
								<?php echo $item->ipaddr; ?>
							</td>
							<td>
								<?php echo $item->reason; ?>
							</td>
							<td>
								<?php echo $item->id; ?>
							</td>
						</tr>
					<?php endforeach; ?>
                    </tbody>
				</table>
			<?php endif; ?>

			<input type="hidden" name="task" value=""/>
			<input type="hidden" name="boxchecked" value="0"/>
			<?php echo HTMLHelper::_('form.token'); ?>
		</div>
</form>
