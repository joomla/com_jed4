<?php
/**
 * @package       JED
 *
 * @subpackage    VEL
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
 * VEL Developer Update model.
 *
 * @since  4.0.0
 */
class VeldeveloperupdateModel extends AdminModel
{
	/**
	 * @since  4.0.0
	 * @var    string    Alias to manage history control
	 */
	public $typeAlias = 'com_jed.veldeveloperupdate';
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
			'com_jed.veldeveloperupdate', 'veldeveloperupdate',
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
	 * Returns a reference to the a Table object, always creating it.
	 *
	 * @param   string  $name     The table type to instantiate
	 * @param   string  $prefix   A prefix for the table class name. Optional.
	 * @param   array   $options  Configuration array for model. Optional.
	 *
	 * @return    Table    A database object
	 *
	 * @throws Exception
	 * @since  4.0.0
	 */
	public function getTable($name = 'Veldeveloperupdate', $prefix = 'Administrator', $options = array())
	{
		return parent::getTable($name, $prefix, $options);
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
		$data = Factory::getApplication()->getUserState('com_jed.edit.veldeveloperupdate.data', array());

		if (empty($data))
		{
			if ($this->item === null)
			{
				$this->item = $this->getItem();
			}

			$data = $this->item;


			// Support for multiple or not foreign key field: consent_to_process
			$array = array();

			foreach ((array) $data->consent_to_process as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->consent_to_process = $array;
			}

			// Support for multiple or not foreign key field: update_data_source
			$array = array();

			foreach ((array) $data->update_data_source as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->update_data_source = $array;
			}
		}

		return $data;
	}

	/**
	 * Method to get a single record.
	 *
	 * @param   integer  $pk  The id of the primary key.
	 *
	 * @return  object|bool    Object on success, false on failure.
	 *
	 * @throws Exception
	 * @since  4.0.0
	 */
	public function getItem($pk = null)
	{
		return parent::getItem($pk);
	}

}
