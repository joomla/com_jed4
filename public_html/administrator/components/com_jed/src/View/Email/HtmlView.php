<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\View\Email;

defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\object\CMSObject;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Component\Jed\Administrator\Model\EmailModel;
use Joomla\Registry\Registry;

use function defined;

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
	 * @var    Form|null
	 * @since  4.0.0
	 */
	protected ?Form $form;

	/**
	 * The item object
	 *
	 * @var    CMSObject
	 * @since  4.0.0
	 */
	protected CMSObject $item;

	/**
	 * Get the state
	 *
	 * @var    CMSObject
	 * @since  4.0.0
	 */
	protected CMSObject $state;

	/**
	 * Access rights of a user
	 *
	 * @var    CMSObject
	 * @since  4.0.0
	 */
	protected CMSObject $canDo;

	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  void
	 *
	 * @since   2.0.0
	 * @throws  Exception
	 */
	public function display($tpl = null): void
	{
		/** @var EmailModel $model */
		$model       = $this->getModel();
		$this->form  = $model->getForm();
		$this->item  = $model->getItem();
		$this->state = $model->getState();
		$this->canDo = ContentHelper::getActions('com_jed');

		$this->addToolbar();

		parent::display($tpl);
	}

	/**
	 * Displays a toolbar for a specific page.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	private function addToolbar(): void
	{
		Factory::getApplication()->input->set('hidemainmenu', true);

		ToolbarHelper::title(Text::_('COM_JED_EDIT_EMAIL'), 'mail');

		if ($this->canDo->get('core.edit') || $this->canDo->get('core.create'))
		{
			ToolbarHelper::apply('email.apply');
			ToolbarHelper::save('email.save');
		}

		if ($this->canDo->get('core.create')
			&& $this->canDo->get(
				'core.manage'
			))
		{
			ToolbarHelper::save2new('email.save2new');
		}

		if (!$this->item->get('id'))
		{
			ToolbarHelper::cancel('email.cancel');
		}
		else
		{
			ToolbarHelper::cancel('email.cancel', 'JTOOLBAR_CLOSE');
		}
	}
}
