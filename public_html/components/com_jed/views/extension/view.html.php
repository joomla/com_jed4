<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView;

/**
 * Extension view.
 *
 * @package   JED
 * @since     4.0.0
 */
class JedViewExtension extends HtmlView
{
	/**
	 * The course item.
	 *
	 * @var    object
	 * @since  4.0.0
	 */
	protected $item;

	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  mixed  A string if successful, otherwise a Error object.
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	public function display($tpl = null)
	{
		$this->item = $this->get('Item');

		if (!$this->item || !$this->item->id || count($errors = $this->get('Errors')))
		{
			throw new Exception(Text::sprintf('JLIB_APPLICATION_ERROR_UNHELD_ID', 0), 404);
		}

		// Prepare the document
		$this->prepareDocument();

		return parent::display($tpl);
	}

	/**
	 * Prepares the document.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 * @throws Exception
	 */
	protected function prepareDocument()
	{
		$app     = Factory::getApplication();
		$doc     = Factory::getDocument();
		$pathway = $app->getPathway();

		// Set page title
		$doc->setTitle($this->item->title);

		// Add to breadcrumbs
		$pathway->addItem($this->item->title);
	}
}
