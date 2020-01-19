<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView;

/**
 * View for JED Reviews
 *
 * @package   Joomla.JED
 * @since     4.0.0
 */
class JedViewReviews extends HtmlView
{
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
	 * Display method of reviews view
	 *
	 * @param   string  $tpl  The template name
	 *
	 * @return string
	 *
	 * @since  4.0.0
	 *
	 * @throws Exception
	 */
	public function display($tpl = null)
	{
		/** @var JedModelReviews $model */
		$model               = $this->getModel();
		$this->state         = $model->getState();
		$this->items         = $model->getItems();
		$this->pagination    = $model->getPagination();
		$this->filterForm    = $model->getFilterForm();
		$this->activeFilters = $model->getActiveFilters();

		// Check for errors.
		if (count($errors = $model->getErrors()))
		{
			throw new RuntimeException(implode("\n", $errors), 500);
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
		$canDo = ContentHelper::getActions('com_jed', 'review', $this->state->get('filter.published'));

		JToolBarHelper::title(Text::_('COM_JED_TITLE_REVIEWS'), 'plugin.png');

		if ($canDo->get('core.edit.state'))
		{
			JToolbarHelper::publish('review.publish', 'JTOOLBAR_PUBLISH', true);
			JToolbarHelper::unpublish('review.unpublish', 'JTOOLBAR_UNPUBLISH', true);
		}

		JToolBarHelper::spacer();
	}

	/**
	 * Returns an array of fields the table can be sorted by
	 *
	 * @return  array  Array containing the field name to sort by as the key and display text as value
	 *
	 * @since   3.0
	 */
	protected function getSortFields()
	{
		return array(
			'reviews.published'     => Text::_('JPUBLISHED'),
			'reviews.created_on'    => Text::_('JGLOBAL_FIELD_CREATED_DESC'),
			'reviews.title'         => Text::_('COM_JED_REVIEWS_TITLE'),
			'reviews.overall_score' => Text::_('COM_JED_REVIEWS_SCORE'),
			'users.username'        => Text::_('COM_JED_REVIEWS_AUTHOR'),
			'extensions.title'      => Text::_('COM_JED_EXTENSION'),
			'reviews.ipAddress'    => Text::_('COM_JED_REVIEWS_IP_ADDRESS'),
			'reviews.flagged'       => Text::_('COM_JED_REVIEWS_FLAGGED'),
			'reviews.id'            => Text::_('JGRID_HEADING_ID')
		);
	}
}
