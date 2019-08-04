<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\View\HtmlView;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
/**
 * JedViewSuspiciousip View
 *
 * @since 4.0.0
 */
class JedViewSuspiciousip extends HtmlView
{
	/**
	 * Display method of JedViewSuspiciousip view
	 *
	 * @return null
	 * @since  4.0.0
	 * @throws Exception
	 */
	public function display($tpl = null)
	{
		// Get application instance
		$app = Factory::getApplication();
		// Retrieve the item values
		$this->item = $this->get('Item');
		// Set the developer user id (created_by field)
		$app->setUserState("com_jed.filter.created_by", $this->item->get('created_by'));
		$this->form   = $this->get('Form');
		$this->state  = $this->get('State');
		$this->return = Factory::getApplication()->input->get('return');
		$this->canDo  = ContentHelper::getActions('com_jed');
		// Set the toolbar
		$this->addToolBar();
		// Display the template
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
		$canDo = ContentHelper::getActions('com_jed', 'suspiciousip', $this->state->get('filter.published'));
		$title = !empty($this->item->title) ? $this->item->title : Text::_('JTOOLBAR_NEW');
		ToolBarHelper::title($title, 'stack article');
		// If not checked out, can save the item.
		if (($canDo->get('core.edit') || ($canDo->get('core.create'))))
		{
			ToolBarHelper::apply('suspiciousip.apply', 'JTOOLBAR_APPLY');
			ToolBarHelper::save('suspiciousip.save', 'JTOOLBAR_SAVE');
			ToolbarHelper::save2new('suspiciousip.save2new');
		}
		if (empty($this->item->id))
		{
			ToolBarHelper::cancel('suspiciousip.cancel', 'JTOOLBAR_CANCEL');
		}
		else
		{
			ToolBarHelper::cancel('suspiciousip.cancel', 'JTOOLBAR_CLOSE');
		}
	}

}
