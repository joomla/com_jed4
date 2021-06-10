<?php
/**
 * @package       JED
 *
 * @subpackage    VEL
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\View\Veldeveloperupdates;
// No direct access
defined('_JEXEC') or die;

use Exception;
use Jed\Component\Jed\Administrator\Helper\JedHelper;
use Joomla\CMS\Form\Form;
use Joomla\CMS\HTML\Helpers\Sidebar;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Object\CMSObject;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Toolbar\Toolbar;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Component\Content\Administrator\Extension\ContentComponent;

/**
 * View class for a list of JED VEL Developer Updates.
 *
 * @since  4.0.0
 */
class HtmlView extends BaseHtmlView
{
	/**
	 * The form filter
	 *
	 * @since  4.0.0
	 * @var    Form|null
	 */
	public ?Form $filterForm;

	public string $sidebar;
	/**
	 * The active filters
	 *
	 * @since  4.0.0
	 * @var    array
	 * @var    array
	 */
	public array $activeFilters = [];
	/**
	 * List of items
	 *
	 * @since  4.0.0
	 * @var    array
	 */
	protected array $items = [];
	/**
	 * The pagination object
	 *
	 * @since  4.0.0
	 * @var    Pagination
	 */
	protected Pagination $pagination;
	protected $state;

	/**
	 * Display the view
	 *
	 * @param   string  $tpl  Template name
	 *
	 * @return void
	 *
	 * @throws Exception
	 *
	 * @since 4.0.0
	 */
	public function display($tpl = null)
	{
		$this->state         = $this->get('State');
		$this->items         = $this->get('Items');
		$this->pagination    = $this->get('Pagination');
		$this->filterForm    = $this->get('FilterForm');
		$this->activeFilters = $this->get('ActiveFilters');

		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors));
		}

		$this->addToolbar();

		$this->sidebar = Sidebar::render();
		parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return void
	 *
	 * @since  4.0.0
	 */
	protected function addToolbar()
	{
		$this->state = $this->get('State');
		$canDo       = JedHelper::getActions();

		ToolbarHelper::title(Text::_('COM_JED_TITLE_VELDEVELOPERUPDATES'), 'generic');

		$toolbar = Toolbar::getInstance('toolbar');

		// Check if the form exists before showing the add/edit buttons
		$formPath = JPATH_COMPONENT_ADMINISTRATOR . '/src/View/Veldeveloperupdates';

		if (file_exists($formPath))
		{
			if ($canDo->get('core.create'))
			{
				$toolbar->addNew('veldeveloperupdate.add');
			}
		}

		if ($canDo->get('core.edit.state'))
		{
			$dropdown = $toolbar->dropdownButton('status-group')
				->text('JTOOLBAR_CHANGE_STATUS')
				->toggleSplit(false)
				->icon('fas fa-ellipsis-h')
				->buttonClass('btn btn-action')
				->listCheck(true);

			$childBar = $dropdown->getChildToolbar();

			if (isset($this->items[0]->state))
			{
				$childBar->publish('veldeveloperupdates.publish')->listCheck(true);
				$childBar->unpublish('veldeveloperupdates.unpublish')->listCheck(true);
				$childBar->archive('veldeveloperupdates.archive')->listCheck(true);
			}
			elseif (isset($this->items[0]))
			{
				// If this component does not use state then show a direct delete button as we can not trash
				$toolbar->delete('veldeveloperupdates.delete')
					->text('JTOOLBAR_EMPTY_TRASH')
					->message('JGLOBAL_CONFIRM_DELETE')
					->listCheck(true);
			}

			if (isset($this->items[0]->checked_out))
			{
				$childBar->checkin('veldeveloperupdates.checkin')->listCheck(true);
			}

			if (isset($this->items[0]->state))
			{
				$childBar->trash('veldeveloperupdates.trash')->listCheck(true);
			}
		}


		// Show trash and delete for components that uses the state field
		if (isset($this->items[0]->state))
		{

			if ($this->state->get('filter.state') == ContentComponent::CONDITION_TRASHED && $canDo->get('core.delete'))
			{
				$toolbar->delete('veldeveloperupdates.delete')
					->text('JTOOLBAR_EMPTY_TRASH')
					->message('JGLOBAL_CONFIRM_DELETE')
					->listCheck(true);
			}
		}
		JedHelper::addConfigToolbar($toolbar);

		if ($canDo->get('core.admin'))
		{
			$toolbar->preferences('com_jed');
		}

		// Set sidebar action
		Sidebar::setAction('index.php?option=com_jed&view=velabandonedreports');
	}

	/**
	 * Check if state is set
	 *
	 * @param   mixed  $state  State
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
			'a.`id`'                      => Text::_('JGRID_HEADING_ID'),
			'a.`contact_organisation`'    => Text::_('COM_JED_VEL_ABANDONEDREPORTS_FIELD_ORGANISATIONCOMPANY_LABEL'),
			'a.`contact_email`'           => Text::_('COM_JED_VEL_GENERAL_FIELD_EMAIL_LABEL'),
			'a.`vulnerable_item_name`'    => Text::_('COM_JED_VEL_FIELD_ITEM_NAME_LABEL'),
			'a.`vulnerable_item_version`' => Text::_('COM_JED_VEL_FIELD_ITEM_VERSION_LABEL'),
			'a.`vel_item_id`'             => Text::_('COM_JED_VEL_DEVELOPERUPDATES_FIELD_VEL_ITEM_ID_LABEL'),
			'a.`update_data_source`'      => Text::_('COM_JED_VEL_DEVELOPERUPDATE_FIELD_UPDATE_DATA_SOURCE_LABEL'),
			'a.`update_date_submitted`'   => Text::_('COM_JED_GENERAL_FIELD_DATE_SUBMITTED_LABEL'),
		);
	}
}
