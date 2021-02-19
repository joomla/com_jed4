<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\Controller;

\defined('_JEXEC') or die;

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
}
