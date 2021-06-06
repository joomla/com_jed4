<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\View\Home;

defined('_JEXEC') or die;

use Exception;
use Jed\Component\Jed\Administrator\Helper\JedHelper;
use Jed\Component\Jed\Administrator\Model\HomeModel;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Toolbar\Toolbar;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Registry\Registry;
use function defined;

/**
 * View for JED Home.
 *
 * @since     4.0.0
 * @package   JED
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

	/**
	 * The active filters
	 *
	 * @since  4.0.0
	 * @var    array
	 */
	public array $activeFilters = [];

	/**
	 * List of items to show
	 *
	 * @since  4.0.0
	 * @var    array
	 */
	protected array $items = [];

	/**
	 * Pagination object
	 *
	 * @since  4.0.0
	 * @var    Pagination
	 */
	protected Pagination $pagination;

	/**
	 * The model state
	 *
	 * @since  4.0.0
	 * @var    Registry
	 */
	protected Registry $state;

	/**
	 * List of total statistics
	 *
	 * @since  4.0.0
	 * @var    array
	 */
	protected array $totals = [];

	/**
	 * Last 5 reviews
	 *
	 * @since  4.0.0
	 * @var    array
	 */
	protected array $reviews = [];

	/**
	 * Last 5 tickets
	 *
	 * @since  4.0.0
	 * @var    array
	 */
	protected array $tickets = [];

	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function display($tpl = null): void
	{
		/** @var HomeModel $model */
		$model         = $this->getModel();
		$this->totals  = $model->getTotals();
		$this->reviews = $model->getReviews();
		$this->tickets = $model->getTickets();

		$this->addToolbar();

		parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @since  4.0.0
	 */
	private function addToolbar(): void
	{
		ToolBarHelper::title(Text::_('COM_JED'));

		$user = Factory::getApplication()->getIdentity();

		if ($user->authorise('core.admin', 'com_jed')
			|| $user->authorise(
				'core.options', 'com_jed'
			))
		{
			$bar = Toolbar::getInstance();

			JedHelper::addConfigToolbar($bar);


			ToolbarHelper::preferences('com_jed');
		}
	}
}
