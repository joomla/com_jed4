<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Model\AdminModel;
use Joomla\CMS\MVC\Model\ListModel;
use Joomla\CMS\Table\Table;
use Joomla\Utilities\ArrayHelper;

/**
 * Jed Suspiciousip Model
 *
 * @package  Jed
 * @since    4.0.0
 */defined('_JEXEC') or die;

class JedModelSuspiciousip extends AdminModel
{
	/**
	 * @var   string  The prefix to use with controller messages.
	 *
	 * @since 4.0.0
	 */
	protected $text_prefix = 'COM_JED';
	/**
	 * Method to get the record form.
	 *
	 * @param   array    $data      An optional array of data for the form to interrogate.
	 * @param   boolean  $loadData  True if the form is to load its own data (default case), false if not.
	 *
	 * @return  Form|boolean    A Form object on success, false on failure
	 * @since   4.0.0
	 */
	public function getForm($data = array(), $loadData = true)
	{
		// Get the form.
		$form = $this->loadForm('com_jed.suspiciousip', 'suspiciousip', array('control' => 'jform', 'load_data' => $loadData));
		if (empty($form))
		{
			return false;
		}
		return $form;
	}
	/**
	 * Method to get the data that should be injected in the form.
	 *
	 * @return    mixed    The data for the form.
	 *
	 * @throws  Exception
	 *
	 * @since   4.0.0
	 */
	protected function loadFormData()
	{
		// Check the session for previously entered form data.
		$data = Factory::getApplication()->getUserState('com_jed.edit.suspiciousip.data', array());
		if (empty($data))
		{
			$data = $this->getItem();
		}
		return $data;
	}
	/**
	 * Method to change the title & alias.
	 *
	 * @param   integer $category_id The id of the category.
	 * @param   string  $alias       The alias.
	 * @param   string  $title       The title.
	 *
	 * @return   array  Contains the modified title and alias.
	 *
	 * @throws   Exception
	 *
	 * @since    4.0.0
	 */
	protected function generateNewTitle($category_id, $alias, $title)
	{
		// Alter the title & alias
		$table = $this->getTable();
		while ($table->load(array('alias' => $alias)))
		{
			$title = StringHelper::increment($title);
			$alias = StringHelper::increment($alias, 'dash');
		}
		return array($title, $alias);
	}
}