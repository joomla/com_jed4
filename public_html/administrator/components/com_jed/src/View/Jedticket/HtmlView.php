<?php
/**
 * @package       JED
 *
 * @subpackage    Tickets
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\View\Jedticket;
// No direct access
defined('_JEXEC') or die;

use Exception;
use Jed\Component\Jed\Administrator\Helper\JedHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Toolbar\ToolbarHelper;

/**
 * View class for a display of JED Ticket.
 *
 * @since  4.0.0
 */
class HtmlView extends BaseHtmlView
{
	protected $state;

	protected $item;

	protected $form;

	protected int $linked_item_type;

	protected $linked_item_Model;
    
    protected $ticket_messages;
    
    protected $related_object_string;

	protected ?Form $linked_form;
    

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
		$this->state            = $this->get('State');
		$this->item             = $this->get('Item');
		$this->form             = $this->get('Form');
        $this->ticket_messages = $this->get('TicketMessages');
		$this->linked_item_type = $this->item->linked_item_type;
        

        if ($this->linked_item_type === 2) // Extension
		{
			$this->linked_item_Model = BaseDatabaseModel::getInstance( 'Extension', 'JedModel', ['ignore_request' => true]);
            $this->related_object_string = "Sorry but extensions as related object are not currently coded.";
			//$this->linked_item_data = $this->get('ExtensionData');
			//$this->linked_form      = $this->linked_item_Model->getForm($this->linked_item_data, false);

			//$this->linked_form->bind($this->linked_item_data);
		}
        if ($this->linked_item_type === 3) //Review
		{
			$this->linked_item_Model = BaseDatabaseModel::getInstance('Review', 'JedModel', ['ignore_request' => true]);
            $this->related_object_string = "Sorry but reviews as related object are not currently coded.";

			//$this->linked_item_data = $this->get('ReviewData');
			//$this->linked_form      = $this->linked_item_Model->getForm($this->linked_item_data, false);

			//$this->linked_form->bind($this->linked_item_data);
		}
		if ($this->linked_item_type === 4) // VEL Report
		{
			$this->linked_item_Model = BaseDatabaseModel::getInstance('Velreport', 'JedModel', ['ignore_request' => true]);
			$this->linked_item_data = $this->get('VelReportData');
//var_dump($this->linked_item_data[0]);exit();
			$this->linked_form      = $this->linked_item_Model->getForm($this->linked_item_data, false);
			$this->linked_form->bind($this->linked_item_data);
            if($this->linked_item_data[0]->vel_item_id > 0) {
				$this->related_object_string = '<button type="button" class="btn btn-primary"  onclick="Joomla.submitbutton(\'jedticket.gotoVEL\')">View VEL Item '.$this->linked_item_data[0]->vel_item_id.'</button>';
				
             //   $this->related_object_string = '<a href="index.php?option=com_jed&task=velvulnerableitem.edit&id='.$this->linked_item_data[0]->vel_item_id.'">VEL Report '.$this->linked_item_data[0]->vel_item_id .'</a>';
            } else {
                $this->related_object_string = "Awaiting creation of VEL Item";

            }
            
            
		}
		if ($this->linked_item_type === 5) // VEL Developer Update
		{
			$this->linked_item_Model = BaseDatabaseModel::getInstance('Veldeveloperupdate', 'JedModel', ['ignore_request' => true]);
			$this->linked_item_data  = $this->get('VelDeveloperUpdateData');

			$this->linked_form = $this->linked_item_Model->getForm($this->linked_item_data, false);
			$this->linked_form->bind($this->linked_item_data);
            if($this->linked_item_data[0]->vel_item_id > 0) {
				$this->related_object_string = '<button type="button" class="btn btn-primary"  onclick="Joomla.submitbutton(\'jedticket.gotoVEL\')">View VEL Item '.$this->linked_item_data[0]->vel_item_id.'</button>';
				
             //   $this->related_object_string = '<a href="index.php?option=com_jed&task=velvulnerableitem.edit&id='.$this->linked_item_data[0]->vel_item_id.'">VEL Report '.$this->linked_item_data[0]->vel_item_id .'</a>';
            } else {
                $this->related_object_string = "Awaiting Linking to VEL Item";

            }
            
		}
		if ($this->linked_item_type === 6) // VEL Abandonware Report
		{
			$this->linked_item_Model = BaseDatabaseModel::getInstance('Velabandonedreport', 'JedModel', ['ignore_request' => true]);
			$this->linked_item_data  = $this->get('VelAbandonedReportData');

			$this->linked_form = $this->linked_item_Model->getForm($this->linked_item_data, false);
			$this->linked_form->bind($this->linked_item_data);
            
             if($this->linked_item_data[0]->vel_item_id > 0) {
				$this->related_object_string = '<button type="button" class="btn btn-primary"  onclick="Joomla.submitbutton(\'jedticket.gotoVEL\')">View VEL Item '.$this->linked_item_data[0]->vel_item_id.'</button>';
				
             //   $this->related_object_string = '<a href="index.php?option=com_jed&task=velvulnerableitem.edit&id='.$this->linked_item_data[0]->vel_item_id.'">VEL Report '.$this->linked_item_data[0]->vel_item_id .'</a>';
            } else {
                $this->related_object_string = "Awaiting creation of VEL Item";

            }
		}


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

		ToolbarHelper::title(Text::_('COM_JED_TITLE_JEDTICKET'), "generic");

		// If not checked out, can save the item.
		if (!$checkedOut && ($canDo->get('core.edit') || ($canDo->get('core.create'))))
		{
			ToolbarHelper::apply('jedticket.apply');
			ToolbarHelper::save('jedticket.save');
		}

		if (!$checkedOut && ($canDo->get('core.create')))
		{
			ToolbarHelper::custom('jedticket.save2new', 'save-new.png', 'save-new_f2.png', 'JTOOLBAR_SAVE_AND_NEW', false);
		}

		// If an existing item, can save to a copy.
		if (!$isNew && $canDo->get('core.create'))
		{
			ToolbarHelper::custom('jedticket.save2copy', 'save-copy.png', 'save-copy_f2.png', 'JTOOLBAR_SAVE_AS_COPY', false);
		}


		if (empty($this->item->id))
		{
			ToolbarHelper::cancel('jedticket.cancel');
		}
		else
		{
			ToolbarHelper::cancel('jedticket.cancel', 'JTOOLBAR_CLOSE');
		}
		/*
			Test Debug Code

		if ($this->linked_item_type === 4)
		{
			ToolBarHelper::custom('velreport.copyReporttoVEL', 'joomla custom-button-copyreporttovel', '', 'COM_JED_VEL_CREATE_NEW_VEL_ITEM_FROM_REPORT', false);
		}
		if ($this->linked_item_type === 6)
		{
			ToolBarHelper::custom('velabandonedreport.copyReporttoVEL', 'joomla custom-button-copyreporttovel', '', 'COM_JED_VEL_CREATE_NEW_VEL_ITEM_FROM_REPORT', false);
		}
		*/
	}
}
