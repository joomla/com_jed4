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
                        <th width="1%"><input type="checkbox" name="toggle" value="" onclick="Joomla.checkAll(this);" /></th>
                        <th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_IPADDR'); ?>
                        </th>
                        <th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_REASON'); ?>
                        </th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_CREATED_DATE'); ?>
						</th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_CREATED_BY'); ?>
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
						$canEdit    = $user->authorise('core.edit', 'com_jed.suspiciousip.' . $item->id);
						$canCheckin = $user->authorise('core.manage', 'com_checkin') || $item->checked_out === $userId || $item->checked_out === 0;
						$canEditOwn = $user->authorise('core.edit.own', 'com_jed.suspiciousip.' . $item->id) && $item->created_by === $userId;
						$canChange  = $user->authorise('core.edit.state', 'com_jed.suspiciousip.' . $item->id) && $canCheckin;
						?>
						<tr>
							<td>
								<?php echo HTMLHelper::_('grid.id', $i, $item->id); ?>
							</td>
                            <td>
                                <div class="pull-left break-word">
		                            <?php if ($item->checked_out) : ?>
			                            <?php echo HTMLHelper::_('jgrid.checkedout', $i, $item->editor, $item->checked_out_time, 'suspiciousips.', $canCheckin); ?>
		                            <?php endif; ?>
		                            <?php if ($canEdit) : ?>
			                            <?php echo HTMLHelper::_('link', 'index.php?option=com_jed&task=suspiciousip.edit&id=' . $item->id, $item->ipaddr); ?>
		                            <?php else : ?>
			                            <?php echo $this->escape($item->ipaddr); ?>
		                            <?php endif; ?>
                                </div>
                            </td>
                            <td>
								<?php echo $item->reason; ?>
                            </td>
							<td>
								<?php echo HTMLHelper::_('date', $item->created_time, Text::_('COM_JED_DATETIME_FORMAT')); ?>
							</td>
							<td>
								<?php echo $item->creator; ?>
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
