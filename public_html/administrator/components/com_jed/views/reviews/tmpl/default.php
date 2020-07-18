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
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Language\Text;

/** @var JedViewReviews $this */

$user      = Factory::getUser();
$userId    = $user->get('id');
$listOrder = $this->escape($this->state->get('list.ordering'));
$listDirn  = $this->escape($this->state->get('list.direction'));
$canOrder  = $user->authorise('core.edit.state', 'com_jed.reviews');
$saveOrder = $listOrder === 't.ordering';

HTMLHelper::_('formbehavior.chosen');
?>

<form action="<?php echo 'index.php?option=com_jed&view=reviews'; ?>" method="post" name="adminForm"
      id="adminForm">
	<?php if (!empty($this->sidebar)) : ?>
    <div id="j-sidebar-container" class="span2">
		<?php echo $this->sidebar; ?>
    </div>
    <div id="j-main-container" class="span10">
		<?php else : ?>
        <div id="j-main-container">
			<?php endif; ?>
			<?php
			echo LayoutHelper::render('joomla.searchtools.default', ['view' => $this]);
			?>
            <div class="clearfix"></div>
			<?php if (empty($this->items)) : ?>
                <div class="alert alert-no-items">
					<?php echo Text::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
                </div>
			<?php else : ?>
                <table class="table table-striped" id="reviewList">
                    <thead>
                    <tr>
                        <th width="20">
                            <input type="checkbox" name="toggle" value="" onclick="checkAll(<?php echo count($this->items); ?>);"/>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'JPUBLISHED', 'reviews.published', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'JGLOBAL_FIELD_CREATED_LABEL', 'reviews.created_on', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_TITLE', 'reviews.title', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_SCORE', 'reviews.overallScore', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_AUTHOR', 'users.username', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSION', 'extensions.title', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_DEVELOPER', 'extensions.created_by', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_IP_ADDRESS', 'reviews.ipAddress', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_FLAGGED', 'reviews.flagged', $listDirn, $listOrder); ?>
                        </th>
                        <th width="5">
							<?php echo HTMLHelper::_('searchtools.sort', 'JGRID_HEADING_ID', 'reviews.id', $listDirn, $listOrder); ?>
                        </th>
                    </tr>
                    </thead>
                    <tfoot>
                    <tr>
                        <td colspan="11"><?php echo $this->pagination->getListFooter(); ?></td>
                    </tr>
                    </tfoot>
                    <tbody>
					<?php
					$user           = Factory::getUser();
					$listOrder      = $this->escape($this->state->get('list.ordering'));
					$userId         = $user->get('id');

					foreach ($this->items as $i => $item):

						$ordering = ($listOrder === 'reviews.id');
						$canCheckin = $user->authorise('core.manage', 'com_checkin') || $item->checked_out === $userId || $item->checked_out === 0;
						$canChange  = $user->authorise('core.edit.state', 'com_jed.reviews.' . $item->id) && $canCheckin;
						?>
                        <tr>
                            <td>
								<?php echo HTMLHelper::_('grid.id', $i, $item->id); ?>
                            </td>
                            <td class="center" width="50">
                                <div class="btn-group">
									<?php echo HTMLHelper::_('jgrid.published', $item->published, $i, 'reviews.', $canChange); ?>
                                </div>
                            </td>
                            <td>
								<?php echo HTMLHelper::_('date', $item->created_on, Text::_('COM_JED_DATETIME_FORMAT')); ?>
                            </td>
                            <td>
                                <a href="<?php echo 'index.php?option=com_jed&task=review.edit&id=' . (int) $item->id; ?>">
									<?php echo $item->title; ?>
                                </a>
                            </td>
                            <td>
	                            <?php echo $item->overallScore; ?>
                                @TODO Overall score
                            </td>
                            <td>
                                <a href="<?php echo 'index.php?option=com_users&task=user.edit&id=' . (int) $item->userId; ?>" title="<?php echo $this->escape($item->username); ?>">
									<?php echo $this->escape($item->username); ?>
                                </a>
                            </td>
                            <td>
                                <a href="<?php echo 'index.php?option=com_jed&task=extension.edit&id=' . (int) $item->extensionId; ?>" title="<?php echo $this->escape($item->extensionname); ?>">
									<?php echo $this->escape($item->extensionname); ?>
                                </a>
                            </td>
                            <td>
                                <a href="<?php echo 'index.php?option=com_users&task=user.edit&id=' . (int) $item->developerId; ?>" title="<?php echo $this->escape($item->developer); ?>">
									<?php echo $this->escape($item->developer); ?>
                                </a>
                            </td>
                            <td>
								<?php echo $item->ipAddress; ?>
                            </td>
                            <td>
								<?php
								echo (int) $item->flagged === 1 && !is_null($item->ipAddress)
									? HTMLHelper::_(
										'link',
										'https://batchrev.extensions.joomla.org/ipaddress/' . $item->ipAddress . '.html',
										Text::_('JYES'),
										'target="_blank"'
									) . ' <span class="icon-new-tab"></span>'
									: Text::_('JNO');
								?>
                            </td>
                            <td>
								<?php echo $item->id; ?>
                            </td>
                        </tr>
					<?php endforeach; ?>
                    </tbody>
                </table>
			<?php endif; ?>

			<?php echo $this->pagination->getListFooter(); ?>

            <input type="hidden" name="task" value=""/>
            <input type="hidden" name="boxchecked" value="0"/>
			<?php echo HTMLHelper::_('form.token'); ?>
</form>
