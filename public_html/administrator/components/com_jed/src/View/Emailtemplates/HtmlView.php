<?php
/**
 * @package       JED
 *
 * @subpackage    Ticket
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\View\Emailtemplates;
// No direct access
defined('_JEXEC') or die;

use Exception;
use Jed\Component\Jed\Administrator\Helper\JedHelper;
use JHtmlSidebar;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Toolbar\Toolbar;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Component\Content\Administrator\Extension\ContentComponent;

/**
 * View class for a list of Email Templates.
 *
 * @since  4.0.0
 */
class HtmlView extends BaseHtmlView
{
    public $filterForm;

    public string $sidebar;
    /**
     * List of items
     *
     * @var    array
     * @since  4.0.0
     */
    protected array $items = [];

    /**
     * The pagination object
     *
     * @var    Pagination
     * @since  4.0.0
     */
    protected Pagination $pagination;

    protected $state;
    protected array $activeFilters = [];


    /**
     * Display the view
     *
     * @param string $tpl Template name
     *
     * @return void
     *
     * @throws Exception
     *
     * @since 4.0.0
     */
    public function display($tpl = null)
    {
        $this->state = $this->get('State');
        $this->items = $this->get('Items');
        $this->pagination = $this->get('Pagination');
        $this->filterForm = $this->get('FilterForm');
        $this->activeFilters = $this->get('ActiveFilters');

        // Check for errors.
        if (count($errors = $this->get('Errors'))) {
            throw new Exception(implode("\n", $errors));
        }

        $this->addToolbar();

        $this->sidebar = JHtmlSidebar::render();
        parent::display($tpl);
    }

    /**
     * Add the page title and toolbar.
     *
     * @return void
     *
     * @since 4.0.0
     */
    protected function addToolbar()
    {
        $canDo = JedHelper::getActions();

        $customIcon = '';

        if (file_exists(JPATH_COMPONENT_ADMINISTRATOR . '/assets/images/l_emailtemplates.png')) {
            $customIcon = 'emailtemplates';
        }

        ToolbarHelper::title(Text::_('COM_JED_TITLE_EMAILTEMPLATES'), $customIcon);

        $toolbar = Toolbar::getInstance();

        // Check if the form exists before showing the add/edit buttons
        $formPath = JPATH_COMPONENT_ADMINISTRATOR . '/src/View/Emailtemplates';

        if (file_exists($formPath)) {
            if ($canDo->get('core.create')) {
                $toolbar->addNew('emailtemplate.add');
            }
        }

        if ($canDo->get('core.edit.state')) {
            $dropdown = $toolbar->dropdownButton('status-group')
                ->text('JTOOLBAR_CHANGE_STATUS')
                ->toggleSplit(false)
                ->icon('fas fa-ellipsis-h')
                ->buttonClass('btn btn-action')
                ->listCheck(true);

            $childBar = $dropdown->getChildToolbar();

            if (isset($this->items[0]->state)) {
                $childBar->publish('emailtemplates.publish')->listCheck(true);
                $childBar->unpublish('emailtemplates.unpublish')->listCheck(true);
                $childBar->archive('emailtemplates.archive')->listCheck(true);
            } elseif (isset($this->items[0])) {
                // If this component does not use state then show a direct delete button as we can not trash
                $toolbar->delete('emailtemplates.delete')
                    ->text('JTOOLBAR_EMPTY_TRASH')
                    ->message('JGLOBAL_CONFIRM_DELETE')
                    ->listCheck(true);
            }

            if (isset($this->items[0]->checked_out)) {
                $childBar->checkin('emailtemplates.checkin')->listCheck(true);
            }

            if (isset($this->items[0]->state)) {
                $childBar->trash('emailtemplates.trash')->listCheck(true);
            }
        }


        // Show trash and delete for components that uses the state field
        if (isset($this->items[0]->state)) {

            if ($this->state->get('filter.state') == ContentComponent::CONDITION_TRASHED && $canDo->get('core.delete')) {
                $toolbar->delete('emailtemplates.delete')
                    ->text('JTOOLBAR_EMPTY_TRASH')
                    ->message('JGLOBAL_CONFIRM_DELETE')
                    ->listCheck(true);
            }
        }

        if ($canDo->get('core.admin')) {
            $toolbar->preferences('com_jed');
        }

        // Set sidebar action - New in 3.0
        JHtmlSidebar::setAction('index.php?option=com_jed&view=emailtemplates');
    }

    /**
     * Check if state is set
     *
     * @param mixed $state State
     *
     * @return bool
     *
     * @since 4.0.0
     */
    public function getState($state): bool
    {
        return isset($this->state->{$state}) ? $this->state->{$state} : false;
    }

    /**
     * Method to order fields
     *
     * @return array
     *
     * @since 4.0.0
     */
    protected function getSortFields(): array
    {
        return array(
            'a.`id`' => Text::_('JGRID_HEADING_ID'),
            'a.`title`' => Text::_('COM_JED_EMAILTEMPLATES_FIELD_TITLE_LABEL'),
            'a.`subject`' => Text::_('COM_JED_EMAILTEMPLATES_FIELD_SUBJECT_LABEL'),
            'a.`email_type`' => Text::_('COM_JED_EMAILTEMPLATES_FIELD_EMAIL_TYPE_LABEL'),
            'a.`created_by`' => Text::_('COM_JED_GENERAL_FIELD_CREATED_ON_LABEL_BY'),
            'a.`modified_by`' => Text::_('COM_JED_EMAILTEMPLATES_FIELD_MODIFIED_ON_LABEL_BY'),
            'a.`created`' => Text::_('COM_JED_GENERAL_FIELD_CREATED_ON_LABEL'),
            'a.`modified`' => Text::_('COM_JED_EMAILTEMPLATES_FIELD_MODIFIED_ON_LABEL'),
            'a.`state`' => Text::_('JSTATUS'),
        );
    }
}
