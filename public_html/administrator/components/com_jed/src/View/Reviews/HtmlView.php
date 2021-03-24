<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\View\Reviews;

defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Object\CMSObject;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Jed\Component\Jed\Administrator\Model\ReviewsModel;
use Joomla\Registry\Registry;
use RuntimeException;

use function defined;

/**
 * View for JED Reviews
 *
 * @package   Joomla.JED
 * @since     4.0.0
 */
class HtmlView extends BaseHtmlView
{
	/**
	 * Form object for search filters
	 *
	 * @var    Form|null
	 * @since  4.0.0
	 */
	public ?Form $filterForm;

	/**
	 * The active search filters
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	public array $activeFilters;

	/**
	 * An array of items
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected array $items;

	/**
	 * The pagination object
	 *
	 * @var    Pagination
	 * @since  4.0.0
	 */
	protected Pagination $pagination;

	/**
	 * The model state
	 *
	 * @var    CMSObject
	 * @since  4.0.0
	 */
	protected CMSObject $state;

	/**
	 * Display method of reviews view
	 *
	 * @param   string  $tpl  The template name
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function display($tpl = null): void
	{
		/** @var ReviewsModel $model */
		$model               = $this->getModel();
		$this->state         = $model->getState();
		$this->items         = $model->getItems();
		$this->pagination    = $model->getPagination();
		$this->filterForm    = $model->getFilterForm();
		$this->activeFilters = $model->getActiveFilters();
		$errors              = $model->getErrors();

		if ($errors && count($errors))
		{
			throw new RuntimeException(implode("\n", $errors), 500);
		}

		$this->addToolBar();

		parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return void
	 *
	 * @since  4.0.0
	 */
	private function addToolBar(): void
	{
		$canDo = ContentHelper::getActions(
			'com_jed', 'review', $this->state->get('filter.published')
		);

		ToolBarHelper::title(Text::_('COM_JED_TITLE_REVIEWS'), 'star');

		if ($canDo->get('core.edit.state'))
		{
			ToolbarHelper::publish('reviews.publish', 'JTOOLBAR_PUBLISH', true);
			ToolbarHelper::unpublish(
				'reviews.unpublish', 'JTOOLBAR_UNPUBLISH', true
			);
		}
	}
}
