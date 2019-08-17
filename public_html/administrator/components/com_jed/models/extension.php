<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Model\AdminModel;

/**
 * JED Extension Model
 *
 * @package  JED
 * @since    1.0.0
 */
class JedModelExtension extends AdminModel
{
	/**
	 * Method to get the record form.
	 *
	 * @param   array    $data      Data for the form.
	 * @param   boolean  $loadData  True if the form is to load its own data (default case), false if not.
	 *
	 * @return  mixed   A JForm object on success, false on failure
	 *
	 * @since   1.0.0
	 */
	public function getForm($data = [], $loadData = true)
	{
		// Get the form.
		$form = $this->loadForm('com_jed.extension', 'extension',
			['control' => 'jform', 'load_data' => $loadData]);

		if (empty($form))
		{
			return false;
		}

		return $form;
	}

	/**
	 * Method to save the form data.
	 *
	 * @param   array  $data  The form data.
	 *
	 * @return  boolean  True on success, False on error.
	 *
	 * @since   1.0.0
	 *
	 * @throws  Exception
	 */
	public function save($data): bool
	{
		if (!$data['id'])
		{
			$data['created_by'] = Factory::getUser()->get('id');
		}

		if (!parent::save($data))
		{
			return false;
		}

		// Get the extension ID
		$extensionId = $this->getState($this->getName() . '.id');

		// Store the related categories
		$this->storeRelatedCategories($extensionId, $data['related']);

		// Store the PHP versions
		$this->storePhpVersions($extensionId, $data['phpVersion']);

		return true;
	}

	/**
	 * Store related categories for an extension.
	 *
	 * @param   int    $extensionId         The extension ID to save the categories for
	 * @param   array  $relatedCategoryIds  The related category IDs to store
	 *
	 * @return  void
	 *
	 * @since   1.0.0
	 */
	private function storeRelatedCategories(int $extensionId, array $relatedCategoryIds): void
	{
		$db = $this->getDbo();

		// Delete any existing relations
		$query = $db->getQuery(true)
			->delete($db->quoteName('#__jed_extensions_categories'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query)
			->execute();

		$query->clear()
			->insert($db->quoteName('#__jed_extensions_categories'))
			->columns(
				$db->quoteName(
					[
						'extension_id',
						'category_id'
					]
				)
			);

		array_walk($relatedCategoryIds,
			static function ($relatedCategoryId) use (&$query, $extensionId)
			{
				$query->values($extensionId . ',' . $relatedCategoryId);
			});

		$db->setQuery($query)
			->execute();
	}

	/**
	 * Store supported PHP versions for an extension.
	 *
	 * @param   int    $extensionId  The extension ID to save the versions for
	 * @param   array  $phpVersions  The PHP versions to store
	 *
	 * @return  void
	 *
	 * @since   1.0.0
	 */
	private function storePhpVersions(int $extensionId, array $phpVersions): void
	{
		$db = $this->getDbo();

		// Delete any existing relations
		$query = $db->getQuery(true)
			->delete($db->quoteName('#__jed_extensions_phpversions'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query)
			->execute();

		$query->clear()
			->insert($db->quoteName('#__jed_extensions_phpversions'))
			->columns(
				$db->quoteName(
					[
						'extension_id',
						'phpVersion'
					]
				)
			);

		array_walk($phpVersions,
			static function ($phpVersion) use (&$query, $db, $extensionId)
			{
				$query->values($extensionId . ',' . $db->quote($phpVersion));
			});

		$db->setQuery($query)
			->execute();
	}

	/**
	 * Method to get the data that should be injected in the form.
	 *
	 * @return      mixed   The data for the form.
	 *
	 * @since       1.0.0
	 *
	 * @throws      Exception
	 */
	protected function loadFormData()
	{
		// Check the session for previously entered form data.
		$data = Factory::getApplication()->getUserState('com_jed.edit.extension.data', array());

		if (empty($data))
		{
			$data = $this->getItem();
		}

		return $data;
	}

	/**
	 * Method to get a single record.
	 *
	 * @param   integer  $pk  The id of the primary key.
	 *
	 * @return  \JObject|boolean  Object on success, false on failure.
	 *
	 * @since   1.0.0
	 */
	public function getItem($pk = null)
	{
		// Get the base details
		$item = parent::getItem($pk);

		$item->related = $this->getRelatedCategories($item->id);
		$item->phpVersion = $this->getPhpVersions($item->id);

		return $item;
	}

	/**
	 * Get the related categories.
	 *
	 * @param   int  $extensionId The extension ID to get the categories for
	 *
	 * @return  array  List of related categories.
	 *
	 * @since   1.0.0
	 */
	public function getRelatedCategories(int $extensionId): array
	{
		// Get the related categories
		$db = $this->getDbo();
		$query = $db->getQuery(true)
			->select($db->quoteName('category_id'))
			->from($db->quoteName('#__jed_extensions_categories'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadColumn();
	}

	/**
	 * Get the supported PHP versions.
	 *
	 * @param   int  $extensionId The extension ID to get the PHP versions for
	 *
	 * @return  array  List of supported PHP versions.
	 *
	 * @since   1.0.0
	 */
	public function getPhpVersions(int $extensionId): array
	{
		// Get the related categories
		$db = $this->getDbo();
		$query = $db->getQuery(true)
			->select($db->quoteName('phpVersion'))
			->from($db->quoteName('#__jed_extensions_phpversions'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadColumn();
	}

	/**
	 * Get the filename of the given extension ID.
	 *
	 * @param   int  $extensionId The extension ID to get the filename for
	 *
	 * @return  stdClass  The extension file information.
	 *
	 * @since   4.0.0
	 */
	public function getFilename(int $extensionId): stdClass
	{
		$db = $this->getDbo();
		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'file',
						'originalFile'
					]
				)
			)
			->from($db->quoteName('#__jed_extensions_files'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadObject();
	}
}
