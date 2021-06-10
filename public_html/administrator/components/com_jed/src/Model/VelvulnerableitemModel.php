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
 * VEL Vulnerable Item model.
 *
 * @since  4.0.0
 */
class VelvulnerableitemModel extends AdminModel
{
	/**
	 * @since  4.0.0
	 * @var    string    Alias to manage history control
	 */
	public $typeAlias = 'com_jed.velvulnerableitem';
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
	 * @since 4.0.0
	 * @var int ID Of VEL Report
	 */
	protected int $idVelReport = -1;

	/**
	 * @since 4.0.0
	 * @var int ID Of VEL linked item (report, abandoned report or developer update
	 */
	protected int $linked_item_id = -1;

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
			'com_jed.velvulnerableitem', 'velvulnerableitem',
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

	public function getVelReportData()
	{

		// Create a new query object.
		$db    = Factory::getDBO();
		$query = $db->getQuery(true);

		// Select some fields
		$query->select('a.*');

		// From the vel_report table
		$query->from($db->quoteName('#__jed_vel_report', 'a'));

		// Filter by idVelReport global.

		$idVelReport = $this->idVelReport;
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
			$items = $db->loadObjectList();


			// set selection value to a translatable value
			/*if (VelHelper::checkArray($items))
			{
				foreach ($items as $nr => &$item)
				{
					// convert pass_details_ok
					$item->pass_details_ok = $this->selectionTranslationVelReport($item->pass_details_ok, 'pass_details_ok');
					// convert vulnerability_type
					$item->vulnerability_type = $this->selectionTranslationVelReport($item->vulnerability_type, 'vulnerability_type');
					// convert exploit_type
					$item->exploit_type = $this->selectionTranslationVelReport($item->exploit_type, 'exploit_type');
					// convert data_source
					$item->data_source = $this->selectionTranslationVelReport($item->data_source, 'data_source');
					// convert consent_to_process
					$item->consent_to_process = $this->selectionTranslationVelReport($item->consent_to_process, 'consent_to_process');
					// convert passed_to_vel
					$item->passed_to_vel = $this->selectionTranslationVelReport($item->passed_to_vel, 'passed_to_vel');
				}
			}*/

			return $items;
		}

		return false;
	}

	public function getVelDeveloperUpdateData()
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
			$items = $db->loadObjectList();


			// set selection value to a translatable value
			/*if (VelHelper::checkArray($items))
			{
				foreach ($items as $nr => &$item)
				{
					// convert pass_details_ok
					$item->pass_details_ok = $this->selectionTranslationVelReport($item->pass_details_ok, 'pass_details_ok');
					// convert vulnerability_type
					$item->vulnerability_type = $this->selectionTranslationVelReport($item->vulnerability_type, 'vulnerability_type');
					// convert exploit_type
					$item->exploit_type = $this->selectionTranslationVelReport($item->exploit_type, 'exploit_type');
					// convert data_source
					$item->data_source = $this->selectionTranslationVelReport($item->data_source, 'data_source');
					// convert consent_to_process
					$item->consent_to_process = $this->selectionTranslationVelReport($item->consent_to_process, 'consent_to_process');
					// convert passed_to_vel
					$item->passed_to_vel = $this->selectionTranslationVelReport($item->passed_to_vel, 'passed_to_vel');
				}
			}*/

			return $items;
		}

		return false;
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
	public function getTable($name = 'Velvulnerableitem', $prefix = 'Administrator', $options = array()): Table
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
		$data = Factory::getApplication()->getUserState('com_jed.edit.velvulnerableitem.data', array());

		if (empty($data))
		{
			if ($this->item === null)
			{
				$this->item = $this->getItem();
			}

			$data = $this->item;


			// Support for multiple or not foreign key field: status
			$array = array();

			foreach ((array) $data->status as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->status = $array;
			}

			// Support for multiple or not foreign key field: risk_level
			$array = array();

			foreach ((array) $data->risk_level as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->risk_level = $array;
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

			// Support for multiple or not foreign key field: discoverer_public
			$array = array();

			foreach ((array) $data->discoverer_public as $value)
			{
				if (!is_array($value))
				{
					$array[] = $value;
				}
			}
			if (!empty($array))
			{

				$data->discoverer_public = $array;
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
