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
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Model\AdminModel;
use Joomla\CMS\Object\CMSObject;

/**
 * JED Extension Model
 *
 * @package  JED
 * @since    4.0.0
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
	 * @since   4.0.0
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
	 * @since   4.0.0
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
		$this->storeRelatedCategories($extensionId, $data['related'] ?? []);

		// Store the PHP versions
		$this->storeVersions($extensionId, $data['phpVersion'] ?? [], 'php');

		// Store the Joomla versions
		$this->storeVersions($extensionId, $data['joomlaVersion'] ?? [], 'joomla');

		// Store the extension types
		$this->storeExtensionTypes($extensionId, $data['extensionTypes'] ?? []);

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
	 * @since   4.0.0
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

		// If there are no categories, return
		if (empty($relatedCategoryIds))
		{
			return;
		}

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
			static function ($relatedCategoryId) use (&$query, $extensionId) {
				$query->values($extensionId . ',' . $relatedCategoryId);
			});

		$db->setQuery($query)
			->execute();
	}

	/**
	 * Store supported versions for an extension.
	 *
	 * @param   int     $extensionId  The extension ID to save the versions for
	 * @param   array   $versions     The versions to store
	 * @param   string  $type         THe type of versions to store
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	private function storeVersions(int $extensionId, array $versions, string $type): void
	{
		$db = $this->getDbo();

		// Delete any existing relations
		$query = $db->getQuery(true)
			->delete($db->quoteName('#__jed_extensions_' . $type . '_versions'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query)
			->execute();

		// If there are no versions to store, return
		if (empty($versions))
		{
			return;
		}

		$query->clear()
			->insert($db->quoteName('#__jed_extensions_' . $type . '_versions'))
			->columns(
				$db->quoteName(
					[
						'extension_id',
						'version'
					]
				)
			);

		array_walk($versions,
			static function ($version) use (&$query, $db, $extensionId) {
				$query->values($extensionId . ',' . $db->quote($version));
			});

		$db->setQuery($query)
			->execute();
	}

	/**
	 * Store used extension types for an extension.
	 *
	 * @param   int    $extensionId  The extension ID to save the types for
	 * @param   array  $types        The extension types to store
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	private function storeExtensionTypes(int $extensionId, array $types): void
	{
		$db = $this->getDbo();

		// Delete any existing relations
		$query = $db->getQuery(true)
			->delete($db->quoteName('#__jed_extensions_types'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query)
			->execute();

		// Do not do anything else if no options are checked
		if (empty($types))
		{
			return;
		}

		$query->clear()
			->insert($db->quoteName('#__jed_extensions_types'))
			->columns(
				$db->quoteName(
					[
						'extension_id',
						'type'
					]
				)
			);

		array_walk($types,
			static function ($type) use (&$query, $db, $extensionId) {
				$query->values($extensionId . ',' . $db->quote($type));
			});

		$db->setQuery($query)
			->execute();
	}

	/**
	 * Method to save the approved state.
	 *
	 * @param   array  $data  The form data.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	public function saveApprove($data): void
	{
		if (!$data['id'])
		{
			throw new \InvalidArgumentException(Text::_('COM_JED_EXTENSION_ID_MISSING'));
		}

		/** @var TableExtension $table */
		$table = $this->getTable('Extension');

		// Load the data
		$table->load($data['id']);

		// Store the data
		if (!$table->save($data))
		{
			throw new \RuntimeException($table->getError());
		}
	}

	/**
	 * Method to save the published state.
	 *
	 * @param   array  $data  The form data.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	public function savePublish($data): void
	{
		if (!$data['id'])
		{
			throw new \InvalidArgumentException(Text::_('COM_JED_EXTENSION_ID_MISSING'));
		}

		$db          = $this->getDbo();
		$extensionId = (int) $data['id'];

		/** @var TableExtension $table */
		$table = $this->getTable('Extension');

		// Load the data
		$table->load($extensionId);

		// Store the data
		if (!$table->save($data))
		{
			throw new \RuntimeException($table->getError());
		}

		// Delete any existing relations
		$query = $db->getQuery(true)
			->delete($db->quoteName('#__jed_extensions_published_reasons'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query)
			->execute();

		if (empty($data['publishedReason']))
		{
			return;
		}

		$query->clear()
			->insert($db->quoteName('#__jed_extensions_published_reasons'))
			->columns(
				$db->quoteName(
					[
						'extension_id',
						'reason'
					]
				)
			);

		array_walk($data['publishedReason'],
			static function ($reason) use (&$query, $db, $extensionId) {
				$query->values($extensionId . ',' . $db->quote($reason));
			});

		$db->setQuery($query)
			->execute();
	}

	/**
	 * Get the filename of the given extension ID.
	 *
	 * @param   int  $extensionId  The extension ID to get the filename for
	 *
	 * @return  stdClass  The extension file information.
	 *
	 * @since   4.0.0
	 */
	public function getFilename(int $extensionId): stdClass
	{
		$db    = $this->getDbo();
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

		$fileDetails = $db->loadObject();

		if ($fileDetails === null)
		{
			$fileDetails       = new stdClass;
			$fileDetails->file = '';
		}

		return $fileDetails;
	}

	/**
	 * Method to get the data that should be injected in the form.
	 *
	 * @return      mixed   The data for the form.
	 *
	 * @since       4.0.0
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
	 * @return  CMSObject  Object with item details.
	 *
	 * @since   4.0.0
	 */
	public function getItem($pk = null): CMSObject
	{
		// Get the base details
		$item = parent::getItem($pk);

		if (!$item instanceof CMSObject)
		{
			return new CMSObject;
		}

		// If we have an empty object, we cannot fill it
		if (!$item->id)
		{
			return $item;
		}

		// Rework the approved state
		$approved                   = [];
		$approved['approvedReason'] = $item->get('approvedReason');
		$approved['approvedNotes']  = $item->get('approvedNotes');
		$item->set('approve', $approved);

		// Rework the published state
		$published                   = [];
		$published['publishedReason'] = $this->getPublishedReasons($item->id);
		$published['publishedNotes']  = $item->get('publishedNotes');
		$item->set('publish', $published);

		$item->set('related', $this->getRelatedCategories($item->id));
		$item->set('phpVersion', $this->getVersions($item->id, 'php'));
		$item->set('joomlaVersion', $this->getVersions($item->id, 'joomla'));
		$item->set('extensionTypes', $this->getExtensionTypes($item->id));
		$item->set('body', nl2br($item->get('body')));

		return $item;
	}

	/**
	 * Get the published reasons.
	 *
	 * @param   int  $extensionId  The extension ID to get the reasons for
	 *
	 * @return  array  List of published reasons.
	 *
	 * @since   4.0.0
	 */
	public function getPublishedReasons(int $extensionId): array
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select($db->quoteName('reason'))
			->from($db->quoteName('#__jed_extensions_published_reasons'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadColumn();
	}

	/**
	 * Get the related categories.
	 *
	 * @param   int  $extensionId  The extension ID to get the categories for
	 *
	 * @return  array  List of related categories.
	 *
	 * @since   4.0.0
	 */
	public function getRelatedCategories(int $extensionId): array
	{
		$db    = $this->getDbo();
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
	 * @param   int     $extensionId  The extension ID to get the PHP versions for
	 * @param   string  $type         The type of version to get
	 *
	 * @return  array  List of supported PHP versions.
	 *
	 * @since   4.0.0
	 */
	public function getVersions(int $extensionId, string $type): array
	{
		// Get the related categories
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select($db->quoteName('version'))
			->from($db->quoteName('#__jed_extensions_' . $type . '_versions'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadColumn();
	}

	/**
	 * Get the used extension types.
	 *
	 * @param   int  $extensionId  The extension ID to get the types for
	 *
	 * @return  array  List of used extension types.
	 *
	 * @since   4.0.0
	 */
	public function getExtensionTypes(int $extensionId): array
	{
		// Get the related categories
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select($db->quoteName('type'))
			->from($db->quoteName('#__jed_extensions_types'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadColumn();
	}
}
