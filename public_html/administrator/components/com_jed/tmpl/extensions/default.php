<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;

defined('_JEXEC') or die;

/** @var JedViewExtensions $this */

HTMLHelper::_('script', 'com_jed/autoComplete.min.js', ['version' => 'auto', 'relative' => true]);
HTMLHelper::_('stylesheet', 'com_jed/autoComplete.css', ['version' => 'auto', 'relative' => true]);

$user      = Factory::getUser();
$userId    = $user->get('id');
$listOrder  = $this->escape($this->state->get('list.ordering'));
$listDirn   = $this->escape($this->state->get('list.direction'));
?>
<form id="adminForm" action="<?php echo Route::_('index.php?option=com_jed&view=extensions'); ?>" method="post" name="adminForm">
    <div class="row">
        <div class="col-md-12">
            <div id="j-main-container" class="j-main-container">
                <?php echo LayoutHelper::render('joomla.searchtools.default', ['view' => $this]); ?>
                <?php if (empty($this->items)) : ?>
                    <div class="alert alert-info">
                        <span class="icon-info-circle" aria-hidden="true"></span><span class="visually-hidden"><?php echo Text::_('INFO'); ?></span>
                        <?php echo Text::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
                    </div>
                <?php else : ?>
                <table class="table itemList" id="extensionList">
                    <caption class="visually-hidden">
		                <?php echo Text::_('COM_JED_EXTENSIONS_TABLE_CAPTION'); ?>,
                        <span id="orderedBy"><?php echo Text::_('JGLOBAL_SORTED_BY'); ?> </span>,
                        <span id="filteredBy"><?php echo Text::_('JGLOBAL_FILTERED_BY'); ?></span>
                    </caption>
                    <thead>
                    <tr>
                        <td class="w-1 text-center">
	                        <?php echo HTMLHelper::_('grid.checkall'); ?>
                        </td>
                        <td scope="col" class="w-1 text-center d-none d-md-table-cell">
                            <?php echo HTMLHelper::_('searchtools.sort', 'JPUBLISHED', 'extensions.published', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-1 text-center d-none d-md-table-cell">
                            <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_APPROVED', 'extensions.approved', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-1 text-center">
                        <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_TITLE', 'extensions.title', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
                        <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_CATEGORY', 'categories.title', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
                        <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_LAST_UPDATED', 'extensions.modified_on', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
                        <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_DATE_ADDED', 'extensions.created_on', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
                            <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_DEVELOPER', 'users.name', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
                            <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_TYPE', 'extensions.type', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-10 d-none d-md-table-cell text-center">
                            <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_REVIEWCOUNT', 'extensions.reviewcount', $listDirn, $listOrder); ?>
                        </td>
                        <td scope="col" class="w-3 d-none d-lg-table-cell">
                            <?php echo HTMLHelper::_('searchtools.sort', 'JGRID_HEADING_ID', 'extensions.id', $listDirn, $listOrder); ?>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($this->items as $i => $item):

                        $ordering = ($listOrder === 'extension.id');
                        $canCreate = $user->authorise('core.create', 'com_jed.extension.' . $item->id);
                        $canEdit = $user->authorise('core.edit', 'com_jed.extension.' . $item->id);
                        $canCheckin = $user->authorise('core.manage',
                                'com_checkin') || $item->checked_out === $userId || $item->checked_out === 0;
                        $canEditOwn = $user->authorise('core.edit.own',
                                'com_jed.extension.' . $item->id) && $item->created_by === $userId;
                        $canChange = $user->authorise('core.edit.state', 'com_jed.extension.' . $item->id) && $canCheckin;
                        ?>
                        <tr>
                            <td>
                                <?php echo HTMLHelper::_('grid.id', $i, $item->id); ?>
                            </td>
                            <td class="center" width="50">
                                <?php
                                switch ($item->published)
                                {
                                    // Rejected
                                    case '-1':
                                        $icon = 'unpublish';
                                        break;
                                    // Approved
                                    case '1':
                                        $icon = 'publish';
                                        break;
                                    // Awaiting response
                                    case '2':
                                        $icon = 'expired';
                                        break;
                                    // Pending
                                    case '0':
                                    default:
                                        $icon = 'pending';
                                        break;

                                }
                                echo '<span class="icon-' . $icon . '" aria-hidden="true"></span>';
                                ?>
                            </td>
                            <td>
                                <?php
                                switch ($item->approved)
                                {
                                    // Rejected
                                    case '-1':
                                        $icon = 'unpublish';
                                        break;
                                    // Approved
                                    case '1':
                                        $icon = 'publish';
                                        break;
                                    // Awaiting response
                                    case '2':
                                        $icon = 'expired';
                                        break;
                                    // Pending
                                    case '0':
                                    default:
                                        $icon = 'pending';
                                        break;

                                }
                                echo '<span class="icon-' . $icon . '" aria-hidden="true"></span>';
                                ?>
                            </td>
                            <td>
                                <div class="pull-left break-word">
                                    <?php if ($item->checked_out) : ?>
                                        <?php echo HTMLHelper::_('jgrid.checkedout', $i, $item->editor, $item->checked_out_time, 'extensions.', $canCheckin); ?>
                                    <?php endif; ?>
                                    <?php if ($canEdit) : ?>
                                        <?php echo HTMLHelper::_('link', 'index.php?option=com_jed&task=extension.edit&id=' . $item->id, $item->title); ?>
                                    <?php else : ?>
                                        <?php echo $this->escape($item->title); ?>
                                    <?php endif; ?>
                                    <span class="small break-word">
                                        <?php echo Text::sprintf('JGLOBAL_LIST_ALIAS', $this->escape($item->alias)); ?>
                                    </span>
                                </div>
                            </td>
                            <td>
                                <?php echo $item->category; ?>
                            </td>
                            <td>
                                <?php echo HTMLHelper::_('date', $item->modified_on, Text::_('COM_JED_DATETIME_FORMAT')); ?>
                            </td>
                            <td>
                                <?php echo HTMLHelper::_('date', $item->created_on, Text::_('COM_JED_DATETIME_FORMAT')); ?>
                            </td>
                            <td>
                                <?php echo $item->developer; ?>
                            </td>
                            <td>
                                <?php echo Text::_('COM_JED_EXTENSIONS_TYPE_' . $item->type); ?>
                            </td>
                            <td>
                                <?php echo $item->reviewCount; ?>
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

<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        const autoCompleteJS = new autoComplete({
        data: {
            src: async () => {
                const query = document.querySelector("#filter_developer").value;
                const source = await fetch(`index.php?option=com_jed&task=ajax.developers&format=json&tmpl=component&${Joomla.optionsStorage['csrf.token']}=1&q=${query}`);
                const data = await source.json();
                return data.data;
            },
            key: ["id","name"],
            cache: false
        },
        selector: "#filter_developer",
        observer: true,
        threshold: 3,
        debounce: 300,
        resultsList: {
            destination: "#filter_developer",
            position: "afterend",
            element: "ul"
        },
        maxResults: 5,
        highlight: true,
        resultItem: {
            content: (data, source) => {
                source.innerHTML = data.match;
            },
            element: "li"
        },
        noResults: (dataFeedback, generateList) => {
            generateList(autoCompleteJS, dataFeedback, dataFeedback.results);
            const result = document.createElement("li");
            result.setAttribute("class", "no_result");
            result.setAttribute("tabindex", "1");
            result.innerHTML = `<span style="display: flex; align-items: center; font-weight: 100; color: rgba(0,0,0,.2);">Found No Results for "${dataFeedback.query}"</span>`;
            document.querySelector(`#${autoCompleteJS.resultsList.idName}`).appendChild(result);
        },
        onSelection: feedback => {             // Action script onSelection event | (Optional)
            document.getElementById('filter_developer').value = feedback.selection.value.name;
            document.getElementById('filter_developer_id').value = feedback.selection.value.id;
        }
    });
    });
</script>
