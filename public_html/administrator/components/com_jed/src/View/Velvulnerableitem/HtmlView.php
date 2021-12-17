<?php
/**
 * @package       JED
 *
 * @subpackage    VEL
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\View\Velvulnerableitem;
// No direct access
defined('_JEXEC') or die;

use Exception;
use Jed\Component\Jed\Administrator\Helper\JedHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Toolbar\ToolbarHelper;

/**
 * View class for a VEL Vulnerable Item.
 *
 * @since  4.0.0
 */
class HtmlView extends BaseHtmlView
{
	protected $state;

	protected $item;

	protected $form;

    protected $VELLinkedReports;

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
		$this->item          = $this->get('Item');
		$this->form          = $this->get('Form');
        $this->VELLinkedReports = $this->get('VELLinkedReports');
		
		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors));
		}

		$this->addToolbar();
		parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return void
	 *
	 * @throws Exception
	 *
	 * @since 4.0.0
	 */
	protected function addToolbar()
	{
		Factory::getApplication()->input->set('hidemainmenu', true);

		$user  = Factory::getUser();
		$isNew = ($this->item->id == 0);

		if (isset($this->item->checked_out))
		{
			$checkedOut = !($this->item->checked_out == 0 || $this->item->checked_out == $user->get('id'));
		}
		else
		{
			$checkedOut = false;
		}

		$canDo = JedHelper::getActions();

		ToolbarHelper::title(Text::_('COM_JED_TITLE_VELVULNERABLEITEM'), "generic");

		// If not checked out, can save the item.
		if (!$checkedOut && ($canDo->get('core.edit') || ($canDo->get('core.create'))))
		{
			ToolbarHelper::apply('velvulnerableitem.apply', 'JTOOLBAR_APPLY');
			ToolbarHelper::save('velvulnerableitem.save', 'JTOOLBAR_SAVE');
		}

		if (!$checkedOut && ($canDo->get('core.create')))
		{
			ToolbarHelper::custom('velvulnerableitem.save2new', 'save-new.png', 'save-new_f2.png', 'JTOOLBAR_SAVE_AND_NEW', false);
		}

		// If an existing item, can save to a copy.
		if (!$isNew && $canDo->get('core.create'))
		{
			ToolbarHelper::custom('velvulnerableitem.save2copy', 'save-copy.png', 'save-copy_f2.png', 'JTOOLBAR_SAVE_AS_COPY', false);
		}


		// add Build Title button.
		//ToolBarHelper::custom('velvulnerableitem.buildTitle', 'joomla custom-button-buildtitle', '', 'COM_JED_VEL_GENERAL_BUTTON_BUILD_TITLE', false);

		// add Build Internal Description button.
		//ToolBarHelper::custom('velvulnerableitem.buildInternalDescription', 'joomla custom-button-buildinternaldescription', '', 'COM_JED_VEL_GENERAL_BUTTON_BUILD_INTERNAL_DESCRIPTION', false);

		// add Build Public Description button.
		//ToolBarHelper::custom('velvulnerableitem.buildPublicDescription', 'joomla custom-button-buildpublicdescription', '', 'COM_JED_VEL_GENERAL_BUTTON_BUILD_PUBLIC_DESCRIPTION', false);

		// add Contact Developer button.
		ToolBarHelper::custom('velvulnerableitem.contactDeveloper', 'joomla custom-button-contactdeveloper', '', 'COM_JED_VEL_GENERAL_BUTTON_CONTACT_DEVELOPER', false);

		if (empty($this->item->id))
		{
			ToolbarHelper::cancel('velvulnerableitem.cancel', 'JTOOLBAR_CANCEL');
		}
		else
		{
			ToolbarHelper::cancel('velvulnerableitem.cancel', 'JTOOLBAR_CLOSE');
		}
	}
}
