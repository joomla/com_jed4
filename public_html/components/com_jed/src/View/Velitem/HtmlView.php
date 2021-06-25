<?php

/**
 * @package       JED
 *
 * @subpackage    VEL
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Site\View\Velitem;
// No direct access
defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Object\CMSObject;
use Joomla\Registry\Registry;
use stdClass;
use function defined;

/**
 * View class for a Single Vulnerable Item.
 *
 * @since 4.0.0
 */
class HtmlView extends BaseHtmlView
{
	/**
	 * Form with settings
	 *
	 * @since  4.0.0
	 * @var    Form|null
	 */
	protected ?Form $form;

	/**
	 * The item object
	 *
	 * @since  4.0.0
	 * @var    stdClass
	 */
	protected stdClass $item;

	/**
	 * Get the state
	 *
	 * @since  4.0.0
	 * @var    CMSObject
	 */
	protected CMSObject $state;

	/**
	 * Get the Params
	 *
	 * @since  4.0.0
	 * @var    Registry
	 */
	protected Registry $params;

	/**
	 * Display the view
	 *
	 * @param   string  $tpl  Template name
	 *
	 * @return void
	 *
	 * @throws Exception
	 *
	 * @since    4.0.0
	 */
	public function display($tpl = null)
	{
		$app = Factory::getApplication();

		$this->state = $this->get('State');

		$this->item = $this->get('Item');

		$this->params = $app->getParams('com_jed');


		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors));
		}

		$this->_prepareDocument();
		parent::display($tpl);
	}

	/**
	 * Prepares the document
	 *
	 * @return void
	 *
	 * @throws Exception
	 *
	 * @since    4.0.0
	 */
	protected function _prepareDocument()
	{
		$app   = Factory::getApplication();
		$menus = $app->getMenu();

		// Because the application sets a default page title,
		// We need to get it from the menu item itself
		$menu = $menus->getActive();

		if ($menu)
		{
			$this->params->def('page_heading', $this->params->get('page_title', $menu->title));
		}
		else
		{
			$this->params->def('page_heading', Text::_('COM_JED_DEFAULT_PAGE_TITLE'));
		}

		$title = $this->params->get('page_title', '');

		if (empty($title))
		{
			$title = $app->get('sitename');
		}
		elseif ($app->get('sitename_pagetitles', 0) == 1)
		{
			$title = Text::sprintf('JPAGETITLE', $app->get('sitename'), $title);
		}
		elseif ($app->get('sitename_pagetitles', 0) == 2)
		{
			$title = Text::sprintf('JPAGETITLE', $title, $app->get('sitename'));
		}

		$this->document->setTitle($title);

		if ($this->params->get('menu-meta_description'))
		{
			$this->document->setDescription($this->params->get('menu-meta_description'));
		}

		if ($this->params->get('menu-meta_keywords'))
		{
			$this->document->setMetadata('keywords', $this->params->get('menu-meta_keywords'));
		}

		if ($this->params->get('robots'))
		{
			$this->document->setMetadata('robots', $this->params->get('robots'));
		}
	}

	/**
	 * Check if state is set
	 *
	 * @param   mixed  $state  State
	 *
	 * @return bool
	 *
	 * @since    4.0.0
	 */
	public function getState($state): bool
	{
		return isset($this->state->{$state}) ? $this->state->{$state} : false;
	}
}
