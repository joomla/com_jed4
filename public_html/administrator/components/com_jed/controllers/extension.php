<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die();

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Controller\FormController;
use Joomla\CMS\Router\Route;

/**
 * Extension list controller class.
 *
 * @package  JED
 * @since    4.0.0
 */
class JedControllerExtension extends FormController
{
	/**
	 * Download a selected extension.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	public function download(): void
	{
		/** @var JedModelExtension $model */
		$model       = $this->getModel();
		$id          = $this->input->getInt('id');
		$fileDetails = $model->getFilename($id);

		if (!file_exists($fileDetails->file))
		{
			throw new InvalidArgumentException(Text::sprintf('COM_JED_EXTENSIONS_DOWNLOAD_NOT_FOUND',
				$fileDetails->file));
		}

		header('Content-type: application/zip');
		header('Content-Disposition: attachment; filename=' . $fileDetails->originalFile);
		header('Content-length: ' . filesize($fileDetails->file));
		header('Pragma: no-cache');
		header('Expires: 0');
		readfile($fileDetails->file);

		Factory::getApplication()->close();
	}

	/**
	 * Set the approval state for the extension.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	public function approve(): void
	{
		$data = $this->input->get('jform', [], 'array');
		/** @var JedModelExtension $model */
		$model     = $this->getModel();
		$form      = $model->getForm();
		$validData = $model->validate($form, $data, 'approve');

		// Add the ID to be able to save the data
		$validData['approve']['id'] = $data['id'];

		// Save the data
		$model->saveApprove($validData['approve']);

		// Redirect back to the edit screen.
		$this->setRedirect(
			Route::_(
				'index.php?option=com_jed&view=extension'
				. $this->getRedirectToItemAppend($data['id']), false
			)
		);
	}

	/**
	 * Set the publish state for the extension.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	public function publish(): void
	{
		$data = $this->input->get('jform', [], 'array');
		/** @var JedModelExtension $model */
		$model     = $this->getModel();
		$form      = $model->getForm();
		$validData = $model->validate($form, $data, 'publish');

		// Add the ID to be able to save the data
		$validData['publish']['id'] = $data['id'];

		// Save the data
		$model->savePublish($validData['publish']);

		// Redirect back to the edit screen.
		$this->setRedirect(
			Route::_(
				'index.php?option=com_jed&view=extension'
				. $this->getRedirectToItemAppend($data['id']), false
			)
		);
	}
}
