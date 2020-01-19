<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\MVC\View\HtmlView;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Helper\ContentHelper;

/**
 * View for JED Extensions.
 *
 * @package   Joomla.JED
 * @since     4.0.0
 */
class JedViewExtensions extends HtmlView
{
	/**
	 * An array of items
	 *
	 * @var     array
	 * @since   4.0.0
	 */
	protected $items;

	/**
	 * The pagination object
	 *
	 * @var     JPagination
	 * @since   4.0.0
	 */
	protected $pagination;

	/**
	 * The model state
	 *
	 * @var     object
	 * @since   4.0.0
	 */
	protected $state;

	/**
	 * Form object for search filters
	 *
	 * @var     JForm
	 * @since   4.0.0
	 */
	public $filterForm;

	/**
	 * The active search filters
	 *
	 * @var     array
	 * @since   4.0.0
	 */
	public $activeFilters;

	/**
	 * Display method of extensions view
	 *
	 * @param   string  $tpl  The template name
	 *
	 * @return string
	 *
	 * @since  4.0.0
	 * @throws Exception
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
			throw new Exception(implode("\n", $errors), 500);
		}

		// Add the toolbar
		$this->addToolBar();

		return parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return void
	 *
	 * @since  4.0.0
	 * @throws Exception
	 */
	protected function addToolBar()
	{
		$canDo = ContentHelper::getActions('com_jed', 'extension', $this->state->get('filter.published'));

		JToolBarHelper::title(Text::_('COM_JED_TITLE_EXTENSIONS'), 'plugin.png');

		if ($canDo->get('core.create'))
		{
			JToolbarHelper::addNew('extension.add');
		}

		if (($canDo->get('core.edit')) || ($canDo->get('core.edit.own')))
		{
			JToolbarHelper::editList('extension.edit');
		}

		if ($canDo->get('core.edit.state'))
		{
			JToolbarHelper::publish('extensions.publish', 'JTOOLBAR_PUBLISH', true);
			JToolbarHelper::unpublish('extensions.unpublish', 'JTOOLBAR_UNPUBLISH', true);
		}

		JToolBarHelper::cancel('extensions.cancel', 'JTOOLBAR_CLOSE');
		JToolBarHelper::spacer();
	}

	/**
	 * Returns an array of fields the table can be sorted by
	 *
	 * @return  array  Array containing the field name to sort by as the key and display text as value
	 *
	 * @since   4.0.0
	 */
	protected function getSortFields()
	{
		return array(
			't.title'       => Text::_('COM_JED_EXTENSIONS_TITLE'),
			't.category'    => Text::_('COM_JED_EXTENSIONS_CATEGORY'),
			't.published'   => Text::_('COM_JED_EXTENSIONS_PUBLISHED'),
			't.approved'    => Text::_('COM_JED_EXTENSIONS_APPROVED'),
			't.developer'   => Text::_('COM_JED_EXTENSIONS_DEVELOPER'),
			't.type'        => Text::_('COM_JED_EXTENSIONS_TYPE'),
			't.reviewCount' => Text::_('COM_JED_EXTENSIONS_REVIEWCOUNT'),
			't.id'          => Text::_('JGRID_HEADING_ID')
		);
	}
}
