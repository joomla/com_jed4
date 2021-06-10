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
 * VEL Report Model Class.
 *
 * @since    4.0.0
 */
class VelreportModel extends AdminModel
{
	/**
	 * @since    4.0.0
	 * @var    string    Alias to manage history control
	 */
	public $typeAlias = 'com_jed.velreport';
	/**
	 * @since  4.0.0
	 * @var      string    The prefix to use with controller messages.
	 */
	protected $text_prefix = 'COM_JED';
	/**
	 * @since    4.0.0
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
	 * @since    4.0.0
	 *
	 */
	public function getForm($data = array(), $loadData = true): Form
	{

		// Get the form.
		$form = $this->loadForm(
			'com_jed.velreport', 'velreport',
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
	 * @param   string  $name
	 * @param   string  $prefix  A prefix for the table class name. Optional.
	 * @param   array   $options
	 *
	 * @return    Table    A database object
	 *
	 * @throws Exception
	 * @since    4.0.0
	 *
	 */
	public function getTable($name = 'Velreport', $prefix = 'Administrator', $options = array()): Table
	{
		return parent::getTable($name, $prefix, $options);
	}

	/**
	 * Method to get the data that should be injected in the form.
	 *
	 * @return   mixed  The data for the form.
	 *
	 * @throws
	 * @since    4.0.0
	 *
	 */
	protected function loadFormData()
	{
		// Check the session for previously entered form data.
		$data = Factory::getApplication()->getUserState('com_jed.edit.velreport.data', array());

		if (empty($data))
		{
			if ($this->item === null)
			{
				$this->item = $this->getItem();
			}

			$data = $this->item;


			// Support for multiple or not foreign key field: pass_details_ok
			$array = array();

			foreach ((array) $data->pass_details_ok as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->pass_details_ok = $array;
			}

			// Support for multiple or not foreign key field: vulnerability_type
			$array = array();

			foreach ((array) $data->vulnerability_type as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->vulnerability_type = $array;
			}

			// Support for multiple or not foreign key field: exploit_type
			$array = array();

			foreach ((array) $data->exploit_type as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->exploit_type = $array;
			}

			// Support for multiple or not foreign key field: vulnerability_actively_exploited
			$array = array();

			foreach ((array) $data->vulnerability_actively_exploited as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->vulnerability_actively_exploited = $array;
			}

			// Support for multiple or not foreign key field: vulnerability_publicly_available
			$array = array();

			foreach ((array) $data->vulnerability_publicly_available as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->vulnerability_publicly_available = $array;
			}

			// Support for multiple or not foreign key field: developer_communication_type
			$array = array();

			foreach ((array) $data->developer_communication_type as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->developer_communication_type = $array;
			}

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

			// Support for multiple or not foreign key field: passed_to_vel
			$array = array();

			foreach ((array) $data->passed_to_vel as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->passed_to_vel = $array;
			}

			// Support for multiple or not foreign key field: data_source
			$array = array();

			foreach ((array) $data->data_source as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->data_source = $array;
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
	 * @since    4.0.0
	 */
	public function getItem($pk = null)
	{
		return parent::getItem($pk);
	}

}
