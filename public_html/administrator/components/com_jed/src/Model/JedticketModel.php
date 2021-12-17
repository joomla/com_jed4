<?php
/**
 * @package       JED
 *
 * @subpackage    Tickets
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Model;
// No direct access.
defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\MVC\Model\AdminModel;
use Joomla\CMS\Object\CMSObject;
use Joomla\CMS\Table\Table;

/**
 * JED Ticket model.
 *
 * @since  4.0.0 
 */
class JedticketModel extends AdminModel
{
	/**
	 * @since   4.0.0
	 * @var    string    Alias to manage history control
	 */
	public $typeAlias = 'com_jed.jedticket';
	/**
	 * @since  4.0.0
	 * @var      string    The prefix to use with controller messages.
	 */
	protected $text_prefix = 'COM_JED';
	/**
	 * @since  4.0.0
	 * @var null  Item data
	 */
	protected $item = null;

	/**
	 * @since  4.0.0
	 * @var int  Linked Item Type
	 */
	protected int $linked_item_type;
	/**
	 * @since  4.0.0
	 * @var int  Id of linked Item
	 */
	protected int $linked_item_id;


	/**
	 * Returns a reference to the a Table object, always creating it.
	 *
	 * @param   string  $name
	 * @param   string  $prefix  A prefix for the table class name. Optional.
	 * @param   array   $options
	 *
	 * @return    Table    A database object
	 *
	 * @throws Exception
	 * @since  4.0.0
	 */
	public function getTable($name = 'Jedticket', $prefix = 'Administrator', $options = array()): Table
	{
		return parent::getTable($name, $prefix, $options);
	}

	/**
	 * Method to get the record form.
	 *
	 * @param   array    $data      An optional array of data for the form to interogate.
	 * @param   boolean  $loadData  True if the form is to load its own data (default case), false if not.
	 *
	 * @return  Form|bool  A Form object on success, false on failure
	 *
	 * @throws
	 * @since  4.0.0
	 *
	 */
	public function getForm($data = array(), $loadData = true): Form
	{
		// Get the form.
		$form = $this->loadForm(
			'com_jed.jedticket', 'jedticket',
			array('control'   => 'jform',
			      'load_data' => $loadData
			)
		);


		if (empty($form))
		{
			return false;
		}

		return $form;
	}

    /**
     * Method to get Ticket Messages
     *
     * @retun array|bool    An array on success, false on failure
     *
     * @since 4.0.0
     */
    public function getTicketMessages() :  array
    {
        //SELECT * FROM t6keo_jed_ticket_messages WHERE ticket_id=1
        // Create a new query object.
		$db    = Factory::getDBO();
		$query = $db->getQuery(true);

		// Select some fields
		$query->select('a.*');

		// From the jed_ticket_messages table
		$query->from($db->quoteName('#__jed_ticket_messages', 'a'));
        
        // Filter by Ticket Id 

		$ticketId = $this->item->id;
		if (is_numeric($ticketId))
		{
			$query->where('a.ticket_id = ' . (int) $ticketId);
		}
		elseif (is_string($ticketId))
		{
			$query->where('a.ticket_id = ' . $db->quote($ticketId));
		}
		else
		{
			$query->where('a.ticket_id = -5');
		}


		// Load the items
		$db->setQuery($query);
		$db->execute();
		if ($db->getNumRows())
		{
			return $db->loadObjectList();
		}

		return array();
    }

	/**
	 *
	 * Method to get VEL Report Item Data
	 *
	 * @return  array|bool  An array on success, false on failure
	 *
	 * @since 4.0.0
	 */
	public function getVelReportData(): array
	{

		// Create a new query object.
		$db    = Factory::getDBO();
		$query = $db->getQuery(true);

		// Select some fields
		$query->select('a.*');

		// From the vel_report table
		$query->from($db->quoteName('#__jed_vel_report', 'a'));

		// Filter by idVelReport global.

		$idVelReport = $this->linked_item_id;
		if (is_numeric($idVelReport))
		{
			$query->where('a.id = ' . (int) $idVelReport);
		}
		elseif (is_string($idVelReport))
		{
			$query->where('a.id = ' . $db->quote($idVelReport));
		}
		else
		{
			$query->where('a.id = -5');
		}


		// Load the items
		$db->setQuery($query);
		$db->execute();
		if ($db->getNumRows())
		{
			return $db->loadObjectList();
		}

		return false;
	}

	/**
	 *
	 * Method to get VEL Developer Update Data
	 *
	 * @return  array|bool  An array on success, false on failure
	 *
	 * @since 4.0.0
	 */
	public function getVelDeveloperUpdateData(): array
	{

		// Create a new query object.
		$db    = Factory::getDBO();
		$query = $db->getQuery(true);

		// Select some fields
		$query->select('a.*');

		// From the vel_report table
		$query->from($db->quoteName('#__jed_vel_developer_update', 'a'));

		// Filter by idVelDevUpdate global.

		$idVelDevUpdate = $this->linked_item_id;
		if (is_numeric($idVelDevUpdate))
		{
			$query->where('a.id = ' . (int) $idVelDevUpdate);
		}
		elseif (is_string($idVelDevUpdate))
		{
			$query->where('a.id = ' . $db->quote($idVelDevUpdate));
		}
		else
		{
			$query->where('a.id = -5');
		}


		// Load the items
		$db->setQuery($query);
		$db->execute();
		if ($db->getNumRows())
		{
			return $db->loadObjectList();
		}

		return false;
	}

	/**
	 *
	 * Method to get VEL Abandonware Data
	 *
	 * @return  array|bool  An array on success, false on failure
	 *
	 * @since 4.0.0
	 */
	public function getVelAbandonedReportData(): array
	{

		// Create a new query object.
		$db    = Factory::getDBO();
		$query = $db->getQuery(true);

		// Select some fields
		$query->select('a.*');

		// From the vel_abandoned_report table
		$query->from($db->quoteName('#__jed_vel_abandoned_report', 'a'));

		// Filter by idVelDevUpdate global.

		$idVelAbandonedReport = $this->linked_item_id;
		if (is_numeric($idVelAbandonedReport))
		{
			$query->where('a.id = ' . (int) $idVelAbandonedReport);
		}
		elseif (is_string($idVelAbandonedReport))
		{
			$query->where('a.id = ' . $db->quote($idVelAbandonedReport));
		}
		else
		{
			$query->where('a.id = -5');
		}


		// Load the items
		$db->setQuery($query);
		$db->execute();
		if ($db->getNumRows())
		{
			return $db->loadObjectList();
		}

		return false;
	}

	/**
	 * Method to get the data that should be injected in the form.
	 *
	 * @return   mixed  The data for the form.
	 *
	 * @throws
	 * @since  4.0.0
	 *
	 */
	protected function loadFormData()
	{
		// Check the session for previously entered form data.
		$data = Factory::getApplication()->getUserState('com_jed.edit.jedticket.data', array());

		if (empty($data))
		{
			if ($this->item === null)
			{
				$this->item = $this->getItem();
			}

			$data = $this->item;


			// Support for multiple or not foreign key field: ticket_origin
			$array = array();

			foreach ((array) $data->ticket_origin as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->ticket_origin = $array;
			}

			// Support for multiple or not foreign key field: ticket_status
			$array = array();

			foreach ((array) $data->ticket_status as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->ticket_status = $array;
			}
		}

		return $data;
	}

	/**
	 * Method to get a single record.
	 *
	 * @param   null  $pk  The id of the primary key.
	 *
	 * @return CMSObject Object on success
	 *
	 * @throws Exception
	 * @since  4.0.0
	 */
	public function getItem($pk = null) : CMSObject
	{
        
		$db    = $this->getDbo();
		$query = $db->getQuery(true);

		$pk = (!empty($pk)) ? $pk : (int) $this->getState($this->getName() . '.id');
	    $item                   = parent::getItem($pk);
     
        $this->linked_item_type = $item->linked_item_type;
		$this->linked_item_id   = $item->linked_item_id;

		return $item;
	}


    /**
	 *
	 * Method to get Ticket Internal Notes Data
	 *
	 * @return  object|bool  Object on success
	 *
	 * @since 4.0.0
	 */
    public function getTicketInternalNotes() : CMSObject
    {
        /* Steps
            1 - Look to see if there are notes, if not set flag
            2 - If there are notes store them in array in reverse date order
            3 - Create Empty New notes array / flag for holding */
        $db    = $this->getDbo();
		$query = $db->getQuery(true);
        // Select some fields
		$query->select('a.*');

		// From the jed_ticket_internal_notes table
		$query->from($db->quoteName('#__jed_ticket_internal_notes', 'a'));

        // Filter by Ticket Id

        $ticketId = $this->item->id;
        if (is_numeric($ticketId))
        {
            $query->where('a.ticket_id = ' . (int) $ticketId);
        }
        elseif (is_string($ticketId))
        {
            $query->where('a.ticket_id = ' . $db->quote($ticketId));
        }
        else
        {
            $query->where('a.ticket_id = -5');
        }
        // Load the items
        $db->setQuery($query);
        $db->execute();
        if ($db->getNumRows())
        {
            return $db->loadObjectList();
        }

        return false;
    }
}
