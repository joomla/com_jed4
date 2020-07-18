<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\MVC\Model\BaseDatabaseModel;

/**
 * Extension model.
 *
 * @package   JED
 * @since     4.0.0
 */
class JedModelExtension extends BaseDatabaseModel
{
	/**
	 * Function to get a specific extension.
	 *
	 * @param   integer  $pk  The ID of the item
	 *
	 * @return stdClass|mixed The data
	 * @since 4.0.0
	 * @throws Exception If the ID is not found
	 */
	public function getItem($pk = null)
	{
		$pk    = $pk ?: $this->getState('extension.id');
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'extensions.id',
						'extensions.title',
						'extensions.intro',
						'extensions.body',
						'extensions.logo',
						'extensions.numReviews',
						'extensions.score',
						'extensions.versions',
						'extensions.type',
						'extensions.created_on',
						'extensions.modified_on',
						'extensions.version',
						'extensions.homepageLink',
						'extensions.downloadLink',
						'extensions.demoLink',
						'extensions.supportLink',
						'extensions.documentationLink',
						'extensions.licenseLink',
						'extensions.translationLink',
						'extensions.created_by',
						'users.name',
						'categories.id',
						'categories.title'
					],
					[
						'id',
						'title',
						'intro',
						'body',
						'image',
						'reviews',
						'score',
						'compatibility',
						'type',
						'added',
						'updated',
						'version',
						'homepageLink',
						'downloadLink',
						'demoLink',
						'supportLink',
						'documentationLink',
						'licenseLink',
						'translationLink',
						'developerId',
						'developer',
						'categoryId',
						'category',
					]
				)
			)
			->from($db->quoteName('#__jed_extensions', 'extensions'))
			->leftJoin(
				$db->quoteName('#__categories', 'categories')
				. ' ON ' . $db->quoteName('categories.id') . ' = ' . $db->quoteName('extensions.category_id')
			)
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('extensions.created_by')
			)
			->where($db->quoteName('extensions.id') . ' = ' . (int) $pk)
			->where($db->quoteName('extensions.published') . ' = 1');

		$extension = $db->setQuery($query)->loadObject();

		// Legacy support to make sure we have an intro
		if (!$extension->intro)
		{
			$extension->intro = HTMLHelper::_('string.truncate', $extension->body, 150, true, false);
			$extension->body  = str_replace($extension->intro, '', $extension->body);
		}

		// Extend extension data
		$extension->extensionTypes    = $this->getExtensionTypes($extension->id);
		$extension->relatedCategories = $this->getRelatedCategories($extension->id);
		$extension->phpVersion        = $this->getPhpVersions($extension->id);
		$extension->joomlaVersion     = $this->getJoomlaVersions($extension->id);

		// Get other extensions from this developer
		/** @var JedModelExtensions $extensionsModel */
		$extensionsModel = BaseDatabaseModel::getInstance('Extensions', 'JedModel', array('ignore_request' => true));
		$extensionsModel->setState('filter.developer', $extension->developerId);
		$extensionsModel->setState('filter.extensionId', $extension->id);
		$extensionsModel->setState('filter.extensionId.include', false);
		$extension->otherExtensions = $extensionsModel->getItems();

		return $extension;
	}

	/**
	 * Method to auto-populate the model state.
	 *
	 * This method should only be called once per instantiation and is designed
	 * to be called on the first call to the getState() method unless the model
	 * configuration flag to ignore the request is set.
	 *
	 * @return  void
	 *
	 * @note    Calling getState in this method will result in recursion.
	 * @since   4.0.0
	 * @throws  Exception
	 */
	protected function populateState(): void
	{
		$this->setState('extension.id', Factory::getApplication()->input->getInt('id'));

		parent::populateState();
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
			->select(
				$db->quoteName(
					[
						'categories.id',
						'categories.title',
					],
					[
						'id',
						'title',
					]
				)
			)
			->from($db->quoteName('#__jed_extensions_categories', 'extensionsCategories'))
			->leftJoin(
				$db->quoteName('#__categories', 'categories')
				. ' ON ' . $db->quoteName('categories.id') . ' = ' . $db->quoteName('extensionsCategories.category_id')
			)
			->where($db->quoteName('extensionsCategories.extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadObjectList();
	}

	/**
	 * Get the supported Joomla versions.
	 *
	 * @param   int  $extensionId  The extension ID to get the Joomla versions for
	 *
	 * @return  array  List of supported PHP versions.
	 *
	 * @since   4.0.0
	 */
	public function getJoomlaVersions(int $extensionId): array
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select('REPLACE(' . $db->quoteName('version') . ', "0.0", "x")')
			->from($db->quoteName('#__jed_extensions_joomla_versions'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadColumn();
	}

	/**
	 * Get the supported PHP versions.
	 *
	 * @param   int  $extensionId  The extension ID to get the PHP versions for
	 *
	 * @return  array  List of supported PHP versions.
	 *
	 * @since   4.0.0
	 */
	public function getPhpVersions(int $extensionId): array
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select('REPLACE(' . $db->quoteName('version') . ', "0", "x")')
			->from($db->quoteName('#__jed_extensions_php_versions'))
			->where($db->quoteName('extension_id') . ' = ' . $extensionId);
		$db->setQuery($query);

		return $db->loadColumn();
	}

}
