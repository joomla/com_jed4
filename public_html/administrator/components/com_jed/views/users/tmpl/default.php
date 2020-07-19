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

/** @var JedViewUsers $this */

$user      = Factory::getUser();
$userId    = $user->get('id');
$listOrder = $this->escape($this->state->get('list.ordering'));
$listDirn  = $this->escape($this->state->get('list.direction'));
$canOrder  = $user->authorise('core.edit.state', 'com_jed.users');
$saveOrder = $listOrder === 't.ordering';

HTMLHelper::_('formbehavior.chosen');
?>

<form action="<?php echo 'index.php?option=com_jed&view=users'; ?>" method="post" name="adminForm"
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
                <table class="table table-striped" id="userList">
                    <thead>
                    <tr>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_USER_NAME', 'users.name', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_USER_USERNAME', 'users.username', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_USER_DEVELOPER_NAME', 'jed_users.developerName', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_USERS_PUBLISHED_EXTENSIONS', 'publishedExtensions', $listDirn, $listOrder); ?>
                        </th>
                        <th>
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_USERS_PUBLISHED_REVIEWS', 'publishedReviews', $listDirn, $listOrder); ?>
                        </th>
                        <th>
		                    <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_USER_REGISTER_DATE', 'users.registerDate', $listDirn, $listOrder); ?>
                        </th>
                        <th>
		                    <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_USER_LASTVISIT_DATE', 'users.lastvisitDate', $listDirn, $listOrder); ?>
                        </th>
                        <th width="7">
							<?php echo HTMLHelper::_('searchtools.sort', 'JGRID_HEADING_ID', 'users.id', $listDirn, $listOrder); ?>
                        </th>
                    </tr>
                    </thead>
                    <tfoot>
                    <tr>
                        <td colspan="6"><?php echo $this->pagination->getListFooter(); ?></td>
                    </tr>
                    </tfoot>
                    <tbody>
					<?php
					$user           = Factory::getUser();
					$listOrder      = $this->escape($this->state->get('list.ordering'));
					$userId         = $user->get('id');

					foreach ($this->items as $i => $item):

						$ordering = ($listOrder === 'users.username');
						$canCheckin = $user->authorise('core.manage', 'com_checkin') || $item->checked_out === $userId || $item->checked_out === 0;
						$canChange  = $user->authorise('core.edit.state', 'com_jed.users.' . $item->id) && $canCheckin;
						?>
                        <tr>
                            <td>
								<?php echo $item->name; ?>
                            </td>
                            <td>
                                <a href="<?php echo 'index.php?option=com_jed&task=user.edit&id=' . (int) $item->id; ?>" title="<?php echo $this->escape($item->username); ?>">
									<?php echo $this->escape($item->username); ?>
                                </a>
                            </td>
                            <td>
								<?php echo $item->developerName; ?>
                            </td>
                            <td>
                                <a href="<?php echo 'index.php?option=com_jed&view=extensions&filter[developer]=' . (int) $item->id; ?>" title="<?php echo Text::_('COM_JED_USERS_EXTENSIONS_BY') . ' ' . $this->escape($item->username); ?>">
									<?php echo $item->publishedExtensions; ?>
                                </a>
                            </td>
                            <td>
                                <a href="<?php echo 'index.php?option=com_jed&view=reviews&filter[reviewer]=' . (int) $item->id; ?>" title="<?php echo Text::_('COM_JED_USERS_REVIEWS_BY') . ' ' . $this->escape($item->username); ?>">
									<?php echo $item->publishedReviews; ?>
                                </a>
                            </td>
                            <td>
		                        <?php echo HTMLHelper::_('date', $item->registerDate, Text::_('COM_JED_DATETIME_FORMAT')); ?>
                            </td>
                            <td>
		                        <?php echo HTMLHelper::_('date', $item->lastvisitDate, Text::_('COM_JED_DATETIME_FORMAT')); ?>
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
