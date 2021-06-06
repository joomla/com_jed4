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
use Joomla\CMS\Table\Table;

/**
 * Ticket Linked Item Type model.
 *
 * @since  4.0.0
 */
class TicketlinkeditemtypeModel extends AdminModel
{
	/**
	 * @since   4.0.0
	 * @var    string    Alias to manage history control
	 */
	public $typeAlias = 'com_jed.ticketlinkeditemtype';
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
	 * Returns a reference to the a Table object, always creating it.
	 *
	 * @param   string  $name
	 * @param   string  $prefix  A prefix for the table class name. Optional.
	 * @param   array   $options
	 *
	 * @return    Table    A database object
	 *
	 * @since  4.0.0
	 *
	 * @throws Exception
	 */
	public function getTable($name = 'Ticketlinkeditemtype', $prefix = 'Administrator', $options = array()): Table
	{
		return parent::getTable($name, $prefix, $options);
	}

	/**
	 * Method to get the record form.
	 *
	 * @param   array    $data      An optional array of data for the form to interogate.
	 * @param   boolean  $loadData  True if the form is to load its own data (default case), false if not.
	 *
	 * @return  mixed  A JForm object on success, false on failure
	 *
	 * @since  4.0.0
	 *
	 * @throws
	 */
	public function getForm($data = array(), $loadData = true): Form
	{

		// Get the form.
		$form = $this->loadForm(
			'com_jed.ticketlinkeditemtype', 'ticketlinkeditemtype',
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
	 * Method to get the data that should be injected in the form.
	 *
	 * @return   mixed  The data for the form.
	 *
	 * @since  4.0.0
	 *
	 * @throws
	 */
	protected function loadFormData()
	{
		// Check the session for previously entered form data.
		$data = Factory::getApplication()->getUserState('com_jed.edit.ticketlinkeditemtype.data', array());

		if (empty($data))
		{
			if ($this->item === null)
			{
				$this->item = $this->getItem();
			}

			$data = $this->item;

		}

		return $data;
	}

	/**
	 * Method to get a single record.
	 *
	 * @param   integer  $pk  The id of the primary key.
	 *
	 * @return  object|boolean    Object on success, false on failure.
	 *
	 * @since  4.0.0
	 * @throws Exception
	 */
	public function getItem($pk = null): object
	{
		return parent::getItem($pk);
	}


}
