<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Controller;

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\Response\JsonResponse;
use Jed\Component\Jed\Administrator\Model\EmailModel;
use Jed\Component\Jed\Administrator\Model\ExtensionsModel;

use function defined;

/**
 * JED AJAX controller.
 *
 * @package   JED
 * @since     4.0.0
 */
class AjaxController extends BaseController
{
	/**
	 * Search for developers.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	public function developers(): void
	{
		$this->checkToken('get') || die;

		$search = $this->input->getString('q');
		/** @var ExtensionsModel $model */
		$model = $this->getModel('Extensions');
		$data  = $model->getDevelopers($search);

		echo(new JsonResponse($data));
	}

	/**
	 * Load the message content.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	public function getMessage(): void
	{
		$messageId = $this->input->getInt('messageId');
		/** @var EmailModel $model */
		$model   = $this->getModel('Email');
		$message = $model->getItem($messageId);

		echo(new JsonResponse($message->body));
	}

	/**
	 * Send the message via email.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	public function sendMessage(): void
	{
		$this->checkToken() or jexit('Invalid Token');

		try
		{
			$body        = $this->input->get('body', '', 'raw');
			$messageId   = $this->input->getInt('messageId');
			$developerId = $this->input->getInt('developerId');
			$extensionId = $this->input->getInt('extensionId');
			$userId      = $this->input->getInt('userId');

			/** @var EmailModel $model */
			$model = $this->getModel('Email');
			$model->sendEmail($body, $messageId, $developerId, $userId, $extensionId);
			$message = Text::_('COM_JED_MESSAGE_SENT_TO_DEVELOPER');

			$error = false;
		}
		catch (Exception $exception)
		{
			$message = $exception->getMessage();
			$error   = true;
		}

		echo(new JsonResponse(null, $message, $error));
	}

	/**
	 * Store an internal note
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	public function storeNote(): void
	{
		$this->checkToken() or jexit('Invalid Token');

		try
		{
			$body        = $this->input->get('body', '', 'raw');
			$developerId = $this->input->getInt('developerId');
			$extensionId = $this->input->getInt('extensionId');
			$userId      = $this->input->getInt('userId');

			/** @var ExtensionModel $model */
			$model = $this->getModel('Extension');
			$model->storeNote($body, $developerId, $userId, $extensionId);
			$message = Text::_('COM_JED_EXTENSION_NOTE_STORED');

			$error = false;
		}
		catch (Exception $exception)
		{
			$message = $exception->getMessage();
			$error   = true;
		}

		echo(new JsonResponse(null, $message, $error));
	}

	/**
	 * Set the approval state for the extension.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function approveExtension(): void
	{
		$this->checkToken() or jexit('Invalid Token');

		try
		{
			$data = $this->input->get('jform', [], 'array');
			/** @var ExtensionModel $model */
			$model     = $this->getModel('Extension');
			$form      = $model->getForm();
			$validData = $model->validate($form, $data, 'approve');

			// Add the ID to be able to save the data
			$validData['approve']['id'] = $data['id'];

			// Save the data
			$model->saveApprove($validData['approve']);
			$message = Text::_('COM_JED_EXTENSION_APPROVE_STORED');

			$error = false;
		}
		catch (Exception $exception)
		{
			$message = $exception->getMessage();
			$error   = true;
		}

		echo(new JsonResponse(null, $message, $error));
	}

	/**
	 * Set the publish state for the extension.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function publishExtension(): void
	{
		$this->checkToken() or jexit('Invalid Token');

		try
		{
			$data = $this->input->get('jform', [], 'array');
			/** @var ExtensionModel $model */
			$model     = $this->getModel('Extension');
			$form      = $model->getForm();
			$validData = $model->validate($form, $data, 'publish');

			// Add the ID to be able to save the data
			$validData['publish']['id'] = $data['id'];

			// Save the data
			$model->savePublish($validData['publish']);
			$message = Text::_('COM_JED_EXTENSION_PUBLISH_STORED');

			$error = false;
		}
		catch (Exception $exception)
		{
			$message = $exception->getMessage();
			$error   = true;
		}

		echo(new JsonResponse(null, $message, $error));
	}
}
