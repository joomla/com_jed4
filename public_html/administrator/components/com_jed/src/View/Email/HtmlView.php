<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\View\Email;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\object\CMSObject;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Registry\Registry;

/**
 * Email view
 *
 * @since   4.0.0
 */
class HtmlView extends BaseHtmlView
{
	/**
	 * Form with settings
	 *
	 * @var    Form
	 * @since  4.0.0
	 */
	protected $form;

	/**
	 * The item object
	 *
	 * @var    CMSObject
	 * @since  4.0.0
	 */
	protected $item;

	/**
	 * Get the state
	 *
	 * @var    Registry
	 * @since  4.0.0
	 */
	protected $state;

	/**
	 * Access rights of a user
	 *
	 * @var    CMSObject
	 * @since  4.0.0
	 */
	protected $canDo;

	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  mixed  A string if successful, otherwise a JError object.
	 *
	 * @since   2.0.0
	 * @throws  Exception
	 *
	 */
	public function display($tpl = null)
	{
		/** @var JedModelEmail $model */
		$model       = $this->getModel();
		$this->form  = $model->getForm();
		$this->item  = $model->getItem();
		$this->state = $model->getState();
		$this->canDo = ContentHelper::getActions('com_jed');

		// Add the toolbar
		$this->addToolbar();

		// Display it all
		return parent::display($tpl);
	}

	/**
	 * Displays a toolbar for a specific page.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	private function addToolbar()
	{
		Factory::getApplication()->input->set('hidemainmenu', true);

		ToolbarHelper::title(Text::_('COM_JED_EDIT_EMAIL'), 'mail');

		if ($this->canDo->get('core.edit') || $this->canDo->get('core.create'))
		{
			ToolbarHelper::apply('email.apply');
			ToolbarHelper::save('email.save');
		}

		if ($this->canDo->get('core.create') && $this->canDo->get('core.manage'))
		{
			ToolbarHelper::save2new('email.save2new');
		}

		if (!$this->item->id)
		{
			ToolbarHelper::cancel('email.cancel');
		}
		else
		{
			ToolbarHelper::cancel('email.cancel', 'JTOOLBAR_CLOSE');
		}
	}
}
