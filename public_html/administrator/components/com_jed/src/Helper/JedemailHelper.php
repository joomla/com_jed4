<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Helper;

defined('_JEXEC') or die;


use Exception;
use Joomla\CMS\Factory;
use Joomla\CMS\Mail\Mail;
use Joomla\CMS\User\User;
use function defined;

/**
 * JED Email Helper
 *
 * @since     4.0.0
 * @package   JED
 */
class JedemailHelper
{
    /**
     * The mail engine
     *
     * @var    Mail
     * @since  4.0.0
     */


   	/**
	 * Send an email to the user.
	 *
	 * @param   string  $subject    The message subject
	 * @param   string  $body       The message body
	 * @param   User    $recipient  The user recipient
	 * @param   string  $sender     The current JED administrator user
	 *
	 * @return  string
	 *
	 * @throws \PHPMailer\PHPMailer\Exception
	 * @since   4.0.0
	 */
	static public function sendEmail(string $subject, string $body, User  $recipient, string $sender): string
	{ 


	//	$sender = User::getInstance($userId);


		// Prepare the email
		$mailer = Factory::getMailer();

		$mailer->isHtml()
			->addReplyTo('noreply@extensions.joomla.org', $sender)
			->setFrom('noreply@extensions.joomla.org', $sender);

		// Send the email

		try
		{
				$result = $mailer
					->addRecipient($recipient->email, $recipient->name)
					->setSubject($subject)
					->setBody($body)
					->Send();

				if ($result === false)
				{
					return $mailer->ErrorInfo;
				}
		}
		catch (Exception $e)
		{
			return $e->getMessage();
		}

        return "";
		//	$this->storeEmail($extensionId, $subject, $body, $developer, $sender);
	}

}

