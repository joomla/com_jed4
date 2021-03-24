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
use Joomla\CMS\Router\Route;
use Jed\Component\Jed\Administrator\View\Reviews\HtmlView;

/** @var HtmlView $this */

/** @var Joomla\CMS\WebAsset\WebAssetManager $wa */
$wa = Factory::getApplication()->getDocument()->getWebAssetManager();
$wa->getRegistry()
    ->addExtensionRegistryFile('com_jed');
$wa->usePreset('autoComplete')
    ->addInlineScript(<<<JS
    window.addEventListener('DOMContentLoaded', () => {
        jed.filterDeveloperAutocomplete();
    });
JS
);

$user      = Factory::getUser();
$userId    = $user->get('id');
$listOrder = $this->escape($this->state->get('list.ordering'));
$listDirn  = $this->escape($this->state->get('list.direction'));
$canOrder  = $user->authorise('core.edit.state', 'com_jed.reviews');
$saveOrder = $listOrder === 't.ordering';
?>
<form id="adminForm" action="<?php echo Route::_('index.php?option=com_jed&view=reviews'); ?>" method="post" name="adminForm">
    <div class="row">
        <div class="col-md-12">
            <div id="j-main-container" class="j-main-container">
			    <?php echo LayoutHelper::render('joomla.searchtools.default', ['view' => $this]); ?>
                <?php if (empty($this->items)) : ?>
                    <div class="alert alert-no-items">
                        <span class="icon-info-circle" aria-hidden="true"></span><span class="visually-hidden"><?php echo Text::_('INFO'); ?></span>
                        <?php echo Text::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
                    </div>
                <?php else : ?>
                    <table class="table itemList" id="reviewList">
                        <caption class="visually-hidden">
		                    <?php echo Text::_('COM_JED_REVIEWS_TABLE_CAPTION'); ?>,
                            <span id="orderedBy"><?php echo Text::_('JGLOBAL_SORTED_BY'); ?> </span>,
                            <span id="filteredBy"><?php echo Text::_('JGLOBAL_FILTERED_BY'); ?></span>
                        </caption>
                    <thead>
                    <tr>
                        <td class="w-1 text-center">
	                        <?php echo HTMLHelper::_('grid.checkall'); ?>
                        </td>
                        <td scope="col" class="w-1 text-center d-none d-md-table-cell">
							<?php echo HTMLHelper::_('searchtools.sort', 'JPUBLISHED', 'reviews.published', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-1 text-center d-none d-md-table-cell">
							<?php echo HTMLHelper::_('searchtools.sort', 'JGLOBAL_FIELD_CREATED_LABEL', 'reviews.created_on', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-1 text-center">
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_TITLE', 'reviews.title', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_SCORE', 'reviews.overallScore', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_AUTHOR', 'users.username', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSION', 'extensions.title', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_DEVELOPER', 'extensions.created_by', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_IP_ADDRESS', 'reviews.ipAddress', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
							<?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_REVIEWS_FLAGGED', 'reviews.flagged', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-3 d-none d-lg-table-cell">
							<?php echo HTMLHelper::_('searchtools.sort', 'JGRID_HEADING_ID', 'reviews.id', $listDirn, $listOrder); ?>
                        </td>
                    </tr>
                    </thead>
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
                                        )
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

	                <?php echo $this->pagination->getListFooter(); ?>
                <?php endif; ?>
                <input type="hidden" name="task" value=""/>
                <input type="hidden" name="boxchecked" value="0"/>
                <?php echo HTMLHelper::_('form.token'); ?>
            </div>
        </div>
    </div>
</form>
