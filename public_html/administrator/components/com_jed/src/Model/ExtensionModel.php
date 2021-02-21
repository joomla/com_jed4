<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\Model;

\defined('_JEXEC') or die();

use Joomla\CMS\Date\Date;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Model\AdminModel;
use Joomla\CMS\Object\CMSObject;
use Joomla\CMS\Table\Table;
use Joomla\CMS\User\User;

/**
 * JED Extension Model
 *
 * @package  JED
 * @since    4.0.0
 */
class ExtensionModel extends AdminModel
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
		$form = $this->loadForm(
			'com_jed.extension', 'extension',
			['control' => 'jform', 'load_data' => $loadData]
		);

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

		$extensionId = $this->getState($this->getName() . '.id');

		if ((int) $data['approve']['approved'] !== 3)
		{
			$this->removeApprovedReason((int) $data['id']);
		}

		if ((int) $data['publish']['published'] === 1)
		{
			$this->removePublishedReason((int) $data['id']);
		}

		$this->storeRelatedCategories($extensionId, $data['related'] ?? []);
		$this->storeVersions($extensionId, $data['phpVersion'] ?? [], 'php');
		$this->storeVersions(
			$extensionId, $data['joomlaVersion'] ?? [], 'joomla'
		);
		$this->storeExtensionTypes($extensionId, $data['extensionTypes'] ?? []);
		$this->storeImages($extensionId, $data['images'] ?? []);

		return true;
	}

	/**
	 * Remove approved reasons.
	 *
	 * @param   int  $extensionId  The extension ID to remove the approved reasons for
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	private function removeApprovedReason(int $extensionId): void
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->delete($db->quoteName('#__jed_extensions_approved_reasons'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query)
			->execute();
	}

	/**
	 * Remove published reasons.
	 *
	 * @param   int  $extensionId  The extension ID to remove the published reasons for
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	private function removePublishedReason(int $extensionId): void
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->delete($db->quoteName('#__jed_extensions_published_reasons'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query)
			->execute();
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
	private function storeRelatedCategories(int $extensionId,
		array $relatedCategoryIds
	): void {
		$db = $this->getDbo();

		$query = $db->getQuery(true)
			->delete($db->quoteName('#__jed_extensions_categories'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query)
			->execute();

		if (empty($relatedCategoryIds))
		{
			return;
		}

		$relatedCategoryIds = array_slice($relatedCategoryIds, 0, 5);

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

		array_walk(
			$relatedCategoryIds,
			static function ($relatedCategoryId) use (&$query, $extensionId) {
				$query->values($extensionId . ',' . $relatedCategoryId);
			}
		);

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
	private function storeVersions(int $extensionId, array $versions,
		string $type
	): void {
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

		array_walk(
			$versions,
			static function ($version) use (&$query, $db, $extensionId) {
				$query->values($extensionId . ',' . $db->quote($version));
			}
		);

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

		array_walk(
			$types,
			static function ($type) use (&$query, $db, $extensionId) {
				$query->values($extensionId . ',' . $db->quote($type));
			}
		);

		$db->setQuery($query)
			->execute();
	}

	/**
	 * Store the images for an extension.
	 *
	 * @param   int    $extensionId  The extension ID to save the images for
	 * @param   array  $images       The extension types to store
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	private function storeImages(int $extensionId, array $images): void
	{
		$db = $this->getDbo();

		$query = $db->getQuery(true)
			->delete($db->quoteName('#__jed_extensions_images'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query)
			->execute();

		// Do not do anything else if no options are checked
		if (empty($images))
		{
			return;
		}

		$query->clear()
			->insert($db->quoteName('#__jed_extensions_images'))
			->columns(
				$db->quoteName(
					[
						'extension_id',
						'filename',
						'order'
					]
				)
			);

		array_walk(
			$images,
			static function ($image, $key) use (&$query, $db, $extensionId) {
				$order = (int) str_replace('images', '', $key) + 1;
				$query->values(
					$extensionId . ',' . $db->quote($image['image']) . ','
					. $order
				);
			}
		);

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
			throw new \InvalidArgumentException(
				Text::_('COM_JED_EXTENSION_ID_MISSING')
			);
		}

		$db          = $this->getDbo();
		$extensionId = (int) $data['id'];

		/** @var TableExtension $table */
		$table = $this->getTable('Extension');

		$table->load($extensionId);

		if (!$table->save($data))
		{
			throw new \RuntimeException($table->getError());
		}

		$this->removeApprovedReason($extensionId);

		if (empty($data['approvedReason']) || (int) $data['approved'] !== 3)
		{
			return;
		}

		$query = $db->getQuery(true)
			->insert($db->quoteName('#__jed_extensions_approved_reasons'))
			->columns(
				$db->quoteName(
					[
						'extension_id',
						'reason'
					]
				)
			);

		array_walk(
			$data['approvedReason'],
			static function ($reason) use (&$query, $db, $extensionId) {
				$query->values($extensionId . ',' . $db->quote($reason));
			}
		);

		$db->setQuery($query)
			->execute();
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
			throw new \InvalidArgumentException(
				Text::_('COM_JED_EXTENSION_ID_MISSING')
			);
		}

		$db          = $this->getDbo();
		$extensionId = (int) $data['id'];

		/** @var TableExtension $table */
		$table = $this->getTable('Extension');

		$table->load($extensionId);

		if (!$table->save($data))
		{
			throw new \RuntimeException($table->getError());
		}

		$this->removePublishedReason($extensionId);

		if (empty($data['publishedReason']) || (int) $data['published'] === 1)
		{
			return;
		}

		$query = $db->getQuery(true)
			->insert($db->quoteName('#__jed_extensions_published_reasons'))
			->columns(
				$db->quoteName(
					[
						'extension_id',
						'reason'
					]
				)
			);

		array_walk(
			$data['publishedReason'],
			static function ($reason) use (&$query, $db, $extensionId) {
				$query->values($extensionId . ',' . $db->quote($reason));
			}
		);

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
	 * Store an internal note.
	 *
	 * @param   string  $body         The note content
	 * @param   int     $developerId  The developer to store the note for
	 * @param   int     $userId       The JED member storing the note
	 * @param   int     $extensionId  The extension ID the message is about
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	public function storeNote(string $body, int $developerId, int $userId,
		int $extensionId
	): void {
		// Get the developer details
		$developer = User::getInstance($developerId);

		if ($developer->get('id', null) === null)
		{
			throw new \InvalidArgumentException(
				Text::_('COM_JED_DEVELOPER_NOT_FOUND')
			);
		}

		$noteTable = Table::getInstance('Note', 'Table');
		$result    = $noteTable->save(
			[
				'extension_id'    => $extensionId,
				'body'            => $body,
				'developer_id'    => $developer->get('id'),
				'developer_name'  => $developer->get('name'),
				'developer_email' => $developer->get('email'),
				'created'         => (Date::getInstance())->toSql(),
				'created_by'      => $userId
			]
		);

		if ($result === false)
		{
			throw new \RuntimeException($noteTable->getError());
		}
	}

	/**
	 * Method to get the data that should be injected in the form.
	 *
	 * @return  mixed   The data for the form.
	 *
	 * @since   4.0.0
	 *
	 * @throws  \Exception
	 */
	protected function loadFormData()
	{
		// Check the session for previously entered form data.
		$data = Factory::getApplication()->getUserState(
			'com_jed.edit.extension.data', []
		);

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
		$approved['approved']       = $item->get('approved');
		$approved['approvedReason'] = $this->getApprovedReasons($item->id);
		$approved['approvedNotes']  = $item->get('approvedNotes');
		$item->set('approve', $approved);

		// Rework the published state
		$published                    = [];
		$published['published']       = $item->get('published');
		$published['publishedReason'] = $this->getPublishedReasons($item->id);
		$published['publishedNotes']  = $item->get('publishedNotes');
		$item->set('publish', $published);

		$item->set('related', $this->getRelatedCategories($item->id));
		$item->set('phpVersion', $this->getVersions($item->id, 'php'));
		$item->set('joomlaVersion', $this->getVersions($item->id, 'joomla'));
		$item->set('extensionTypes', $this->getExtensionTypes($item->id));
		$item->set('body', nl2br($item->get('body')));
		$item->set('history', $this->getHistory($item->id));
		$item->set('images', $this->getImages($item->id));

		return $item;
	}

	/**
	 * Get the approved reasons.
	 *
	 * @param   int  $extensionId  The extension ID to get the reasons for
	 *
	 * @return  array  List of approved reasons.
	 *
	 * @since   4.0.0
	 */
	public function getApprovedReasons(int $extensionId): array
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select($db->quoteName('reason'))
			->from($db->quoteName('#__jed_extensions_approved_reasons'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadColumn();
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
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select($db->quoteName('type'))
			->from($db->quoteName('#__jed_extensions_types'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadColumn();
	}

	/**
	 * Get a list of historiacl actions for the extension.
	 *
	 * @param   int  $extensionId  The extension ID to get the history for
	 *
	 * @return  array  List of actions ordered by date.
	 *
	 * @since   4.0.0
	 */
	public function getHistory(int $extensionId): array
	{
		$db = $this->getDbo();

		// Get the action log entries
		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'actionLogs.message_language_key',
						'actionLogs.message',
						'actionLogs.log_date',
						'users.name',
					],
					[
						'message_language_key',
						'message',
						'logDate',
						'name',
					]
				)
			)
			->select($db->quote('actionLog') . ' AS ' . $db->quoteName('type'))
			->from($db->quoteName('#__action_logs', 'actionLogs'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName(
					'actionLogs.user_id'
				)
			)
			->where(
				$db->quoteName('actionLogs.extension') . ' = ' . $db->quote(
					'com_jed.extension'
				)
			)
			->where(
				$db->quoteName('actionLogs.item_id') . ' = ' . $extensionId
			);
		$db->setQuery($query);

		$actionLogs = $db->loadObjectList();

		// Get the mails
		$query->clear()
			->select(
				$db->quoteName(
					[
						'emailLogs.extension_id',
						'emailLogs.subject',
						'emailLogs.body',
						'emailLogs.developer_name',
						'emailLogs.developer_email',
						'emailLogs.created_by',
						'emailLogs.created',
						'emailLogs.developer_id',
						'users.name'
					],
					[
						'extension_id',
						'subject',
						'body',
						'developerName',
						'developerEmail',
						'created_by',
						'logDate',
						'developerId',
						'memberName'
					]
				)
			)
			->select($db->quote('mail') . ' AS ' . $db->quoteName('type'))
			->from($db->quoteName('#__jed_email_logs', 'emailLogs'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName(
					'emailLogs.created_by'
				)
			)
			->where(
				$db->quoteName('emailLogs.extension_id') . ' = ' . $extensionId
			);

		$db->setQuery($query);

		$emailLogs = $db->loadObjectList();

		// Get the mails
		$query->clear()
			->select(
				$db->quoteName(
					[
						'notes.extension_id',
						'notes.body',
						'notes.developer_name',
						'notes.created_by',
						'notes.created',
						'notes.developer_id',
						'users.name'
					],
					[
						'extension_id',
						'body',
						'developerName',
						'created_by',
						'logDate',
						'developerId',
						'memberName'
					]
				)
			)
			->select($db->quote('note') . ' AS ' . $db->quoteName('type'))
			->from($db->quoteName('#__jed_extensions_notes', 'notes'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName(
					'notes.created_by'
				)
			)
			->where(
				$db->quoteName('notes.extension_id') . ' = ' . $extensionId
			);

		$db->setQuery($query);

		$notes = $db->loadObjectList();

		// Combine all the logs
		$logs = array_merge($actionLogs, $emailLogs, $notes);

		// Order de logs by date
		usort(
			$logs,
			static function ($a, $b) {
				return $a->logDate < $b->logDate;
			}
		);

		return $logs;
	}

	/**
	 * Get the images.
	 *
	 * @param   int  $extensionId  The extension ID to get the images for
	 *
	 * @return  array  List of used images.
	 *
	 * @since   4.0.0
	 */
	public function getImages(int $extensionId): array
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select($db->quoteName('filename'))
			->from($db->quoteName('#__jed_extensions_images'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId)
			->order($db->quoteName('order'));
		$db->setQuery($query);

		$items  = $db->loadObjectList();
		$images = [];

		array_walk(
			$items,
			static function ($item, $key) use (&$images) {
				$images['images' . $key]['image'] = $item->filename;
			}
		);

		return $images;
	}
}
