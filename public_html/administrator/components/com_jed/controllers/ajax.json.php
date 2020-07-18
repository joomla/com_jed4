<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\Response\JsonResponse;

/**
 * JED AJAX controller.
 *
 * @package   JED
 * @since     4.0.0
 */
class JedControllerAjax extends BaseController
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
		$search = $this->input->getString('query');
		/** @var JedModelExtensions $model */
		$model = $this->getModel('Extensions', 'JedModel');
		$data  = $model->getDevelopers($search);

		echo json_encode(['suggestions' => $data]);
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
		/** @var JedModelEmail $model */
		$model   = $this->getModel('Email', 'JedModel');
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
		// Check for request forgeries
		$this->checkToken() or jexit('Invalid Token');

		try
		{
			$body        = $this->input->get('body', '', 'raw');
			$messageId   = $this->input->getInt('messageId');
			$developerId = $this->input->getInt('developerId');
			$extensionId = $this->input->getInt('extensionId');
			$userId      = $this->input->getInt('userId');

			/** @var JedModelEmail $model */
			$model = $this->getModel('Email', 'JedModel');
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
}
