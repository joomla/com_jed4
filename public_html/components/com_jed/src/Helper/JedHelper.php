<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */


namespace Jed\Component\Jed\Site\Helper;

defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\Factory;
use Joomla\CMS\Table\Table;
use Joomla\CMS\Uri\Uri;


/**
 * JED Helper
 *
 * @since     4.0.0
 * @package   JED
 */
class JedHelper
{
	/**
	 * Function to format JED Extension Images
	 *
	 * @param   string  $filename  The image filename
	 * @param   string  $size      Size of image, small|large
	 *
	 * @return  string  Full image url
	 *
	 * @since   4.0.0
	 */
	static public function formatImage(string $filename, string $size = 'small'): string
	{
		if (!$filename)
		{
			return '';
		}
		$imageSize = "";
		// Filename for small image
		if ($size === 'small')
		{
			$imageSize = str_replace('.', '_resizeDown400px175px16.', $filename);
		}

		// Filename for large image
		if ($size === 'large')
		{
			$imageSize = str_replace('.', '_resizeDown1200px525px16.', $filename);
		}

		// Use CDN url
		return 'https://extensionscdn.joomla.org/cache/fab_image/' . $imageSize;
	}

	/**
	 * reformatTitle
	 *
	 * A lot of the restored JED 3 titles have extra spacing or missing punctuation. This fixes that for display.
	 *
	 * @param $l_str
	 *
	 * @return string
	 *
	 * @since 4.0.0
	 */
	static public function reformatTitle($l_str): string
	{

		$loc = str_replace(',', ', ', $l_str);
		$loc = str_replace(' ,', ',', $loc);
		$loc = str_replace('  ', ' ', $loc);

		return trim($loc);
	}

	/**
	 * IsLoggedIn
	 *
	 * Returns if user is logged in
	 *
	 * @return bool
	 *
	 * @since 4.0.0
	 */
	static public function IsLoggedIn(): bool
	{

		$user = Factory::getUser();
		if ($user->id > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Gets the edit permission for an user
	 *
	 * @param   mixed  $item  The item
	 *
	 * @return  bool
	 *
	 * @since   4.0.0
	 */
	static public function canUserEdit($item): bool
	{

		$permission = false;
		$user       = Factory::getUser();

		if ($user->authorise('core.edit', 'com_jed'))
		{
			$permission = true;
		}
		else
		{
			if (isset($item->created_by))
			{
				if ($item->created_by == $user->id)
				{
					$permission = true;
				}
			}
			else
			{
				$permission = true;
			}
		}

		return $permission;
	}

	/**
	 * Returns URL for user login
	 *
	 * @return string
	 *
	 * @since 4.0.0
	 */
	static public function getLoginlink(): string
	{
		$redirectUrl    = '&return=' . urlencode(base64_encode(Uri::getInstance()->toString()));
		$joomlaLoginUrl = 'index.php?option=com_users&view=login';

		return $joomlaLoginUrl . $redirectUrl;
	}

    static public function GetMessageTemplate(int $template_id) : object
    {
        // Create a new query object.
        $db = Factory::getDbo();
		$query = $db->getQuery(true);
		$query->select('*')->from($db->quoteName('#__jed_message_templates'))
			->where('id=' .$template_id);
		// Reset the query using our newly populated query object.
		$db->setQuery($query);
		// Load the results as a stdClass object.
		$data = $db->loadObject();
        return $data;
    }
    static public function CreateVELTicketMessage(int $report_type, int $item_id) : array
    {
        $ticket_message = array();
        $ticket_message['id']               = 0;
		$ticket_message['created_by']       = $user->id;
		$ticket_message['modified_by']      = $user->id;
		$ticket_message['created_on']       = 'now()';
		$ticket_message['state']            = 0;
		$ticket_message['ordering']         = 0;
		$ticket_message['checked_out']      = 0;
		$ticket_message['checked_out_time'] = '0000-00-00 00:00:00';

        return $ticket_message;
    }
    
    static public function CreateVELTicket(int $report_type, int $item_id) : array
    {
        
        $db = Factory::getDbo();
        
        $ticket = array();

		$user = Factory::getUser();

		$ticket['id']               = 0;
		$ticket['created_by']       = $user->id;
		$ticket['modified_by']      = $user->id;
		$ticket['created_on']       = 'now()';
		$ticket['modified_on']      = 'now()';
		$ticket['state']            = 0;
		$ticket['ordering']         = 0;
		$ticket['checked_out']      = 0;
		$ticket['checked_out_time'] = '0000-00-00 00:00:00';
		$ticket['ticket_origin'] = 0; //Registered User

		switch ($report_type)
		{
			case 1: // VEL REPORT
				$ticket['ticket_category_type'] = 11;
				$ticket['ticket_subject']       = "A new Vulnerable Item Report";
				$ticket['linked_item_type']     = 4;     //    Vulnerable Item Initial Report
				break;
			case 2: // DEVELOPER UPDATE
				$ticket['ticket_category_type'] = 12;
				$ticket['ticket_subject']       = "A new VEL Developer Update";
				$ticket['linked_item_type']     = 5;     //    Vulnerable Item Developer Update
				break;

			case 3: // ABANDONWARE REPORT
				$ticket['ticket_category_type'] = 13;
				$ticket['ticket_subject']       = "A new VEL Abandonware Report";
				$ticket['linked_item_type']     = 6;     //    Vulnerable Item Abandonware Report
				break;

		}
		
		/* 
            Ticket Category type
            
		   <option value="1">Unknown</option>
           <option value="2">Extension</option>
		   <option value="3">Review</option>
		   <option value="4">Joomla Site Issue</option>
		   <option value="5">New Listing Support</option>
		   <option value="6">Current Listing Support</option>
		   <option value="7">Site Technical Issues</option>
		   <option value="8">Unpublished Support</option>
		   <option value="9">Reported Review</option>
		   <option value="10">Reported Extension</option>
		   <option value="11">Vulnerable Item Report</option>
		   <option value="12">VEL Developer Update</option>
           <option value="13">VEL Abandonware Report</option>*/


		$ticket['allocated_group'] = 6; //These are VEL subjects
		/* Alloc Groups
			1 - Any
			2 - Team Leadership
			3 - Listing Specialist
			4 - Review Specialist
			5 - Support Specialist
			6 - VEL Specialist */

		$ticket['linked_item_id'] = $item_id;

		/* Linked Item Types
         <option value="1" selected="selected">Unknown</option>
		 <option value="2">Extension</option>
		 <option value="3">Review</option>
		 <option value="4">Vulnerable Item Initial Report</option>
		 <option value="5">Vulnerable Item Developer Update</option>
         <option value="6">Abandonware Report</option>
//       <option value="7">Vulnerable Item Email Correspondence</option> */


		$ticket['ticket_status'] = 0; //New
		/*
			<option value="0" selected="selected">New</option>
			<option value="1">Awaiting User</option>
			<option value="2">Awaiting JED</option>
			<option value="3">Resolved</option>
			<option value="4">Closed</option>
			<option value="5">Updated</option>

		*/
		$ticket['ticket_text']               = '<p>Please see linked report</p>';
		$ticket['internal_notes']            = '';

		$ticket['uploaded_files_preview']  = '';
		$ticket['uploaded_files_location'] = '';
		$ticket['allocated_to']            = 0;
		$ticket['parent_id']               = -1;


		foreach ($ticket as $k => $v)
		{
			$columns[] = $k;
			if (str_ends_with($k, "_on"))
			{

				$values[] = $v;
			}
			else
			{
				$values[] = $db->quote($v);
			}

		}
        
        return $ticket;
    }

	/**
	 * When a VEL is reported or a Developer Update made this creates a corresponding Ticket
	 *
	 * @param   int  $report_type  1 for VEL REPORT, 2 for DEVELOPER UPDATE, 3 for ABANDONWARE REPORT
	 * @param   int  $item_id      Reference for stored report
	 *
	 * @return  int     Id of new ticket
	 * @throws Exception
	 * @since 4.0.0
	 *
	 */
    
    
	static public function CreateVELReportTicket(int $report_type, int $item_id)
	{

		$ticketTable = Table::getInstance('JedticketTable', '\\Jed\\Component\\Jed\\Administrator\\Table\\');
		//$ticketTable = BaseDatabaseModel::getInstance('Jedticket');
		$db = Factory::getDbo();

		$ticket = array();

		$user = Factory::getUser();

		$ticket['id']               = 0;
		$ticket['created_by']       = $user->id;
		$ticket['modified_by']      = $user->id;
		$ticket['created_on']       = 'now()';
		$ticket['modified_on']      = 'now()';
		$ticket['state']            = 0;
		$ticket['ordering']         = 0;
		$ticket['checked_out']      = 0;
		$ticket['checked_out_time'] = '0000-00-00 00:00:00';
		$ticket_message             = $ticket;

		$ticket['ticket_origin'] = 0; //Registered User

		switch ($report_type)
		{
			case 1: // VEL REPORT
				$ticket['ticket_category_type'] = 11;
				$ticket['ticket_subject']       = "A new Vulnerable Item Report";
				$ticket['linked_item_type']     = 4;     //    Vulnerable Item Initial Report
				break;
			case 2: // DEVELOPER UPDATE
				$ticket['ticket_category_type'] = 12;
				$ticket['ticket_subject']       = "A new VEL Developer Update";
				$ticket['linked_item_type']     = 5;     //    Vulnerable Item Developer Update
				break;

			case 3: // ABANDONWARE REPORT
				$ticket['ticket_category_type'] = 13;
				$ticket['ticket_subject']       = "A new VEL Abandonware Report";
				$ticket['linked_item_type']     = 6;     //    Vulnerable Item Abandonware Report
				break;

		}
		$ticket_message['subject'] = $ticket['ticket_subject'];

		/* 
            Ticket Category type
            
		   <option value="1">Unknown</option>
           <option value="2">Extension</option>
		   <option value="3">Review</option>
		   <option value="4">Joomla Site Issue</option>
		   <option value="5">New Listing Support</option>
		   <option value="6">Current Listing Support</option>
		   <option value="7">Site Technical Issues</option>
		   <option value="8">Unpublished Support</option>
		   <option value="9">Reported Review</option>
		   <option value="10">Reported Extension</option>
		   <option value="11">Vulnerable Item Report</option>
		   <option value="12">VEL Developer Update</option>
           <option value="13">VEL Abandonware Report</option>*/


		$ticket['allocated_group'] = 6; //These are VEL subjects
		/* Alloc Groups
			1 - Any
			2 - Team Leadership
			3 - Listing Specialist
			4 - Review Specialist
			5 - Support Specialist
			6 - VEL Specialist */

		$ticket['linked_item_id'] = $item_id;

		/* Linked Item Types
         <option value="1" selected="selected">Unknown</option>
		 <option value="2">Extension</option>
		 <option value="3">Review</option>
		 <option value="4">Vulnerable Item Initial Report</option>
		 <option value="5">Vulnerable Item Developer Update</option>
         <option value="6">Abandonware Report</option>
//         <option value="7">Vulnerable Item Email Correspondence</option> */


		$ticket['ticket_status'] = 0; //New
		/*
			<option value="0" selected="selected">New</option>
			<option value="1">Awaiting User</option>
			<option value="2">Awaiting JED</option>
			<option value="3">Resolved</option>
			<option value="4">Closed</option>
			<option value="5">Updated</option>

		*/
		$ticket['ticket_text']               = 'Please see linked report';
		$ticket_message['subject']           = $ticket['ticket_text'];
		$ticket_message['message_direction'] = 1; /* 1 for coming in, 0 for going out */
		$ticket['internal_notes']            = '';

		$ticket['uploaded_files_preview']  = '';
		$ticket['uploaded_files_location'] = '';
		$ticket['allocated_to']            = 0;
		$ticket['parent_id']               = -1;


		foreach ($ticket as $k => $v)
		{
			$columns[] = $k;
			if (str_ends_with($k, "_on"))
			{

				$values[] = $v;
			}
			else
			{
				$values[] = $db->quote($v);
			}

		}


		$ticketTable->save($ticket);

		$ticketId = $ticketTable->id;
		/* Add write to ticket message */

		$ticket_message_table        = Table::getInstance('TicketmessageTable', '\\Jed\\Component\\Jed\\Administrator\\Table\\');
		$ticket_message['ticket_id'] = $ticketId; 
	foreach ($ticket_message as $k => $v)
		{

			$columns_m[] = $k;
			if (str_ends_with($k, "_on"))
			{

				$values_m[] = $v;
			}
			else
			{
				$values_m[] = $db->quote($v);
			}

		}
      //  var_dump($ticket_message);exit();
		$a = $ticket_message_table->save($ticket_message);

		/* Send Email Confirmation of Submission */

		// Create a new query object.
		$query = $db->getQuery(true);
		$query->select('*')->from($db->quoteName('#__jed_message_templates'))
			->where('id=1000');
		// Reset the query using our newly populated query object.
		$db->setQuery($query);
		// Load the results as a stdClass object.
		$data = $db->loadObject();
//print_r($data);exit();
		if (isset($data->subject))
		{
			$sent = JedemailHelper::sendEmail($data->subject, $data->template, $user, 'mark@burninglight.co.uk');
			if ($sent)
			{

				$ticket_message['subject']           = $data->subject;
				$ticket_message['message']           = $data->template;
				$ticket_message['message_direction'] = 0; /* 1 for coming in, 0 for going out */
                $ticket['created_by']       = -1;
		          $ticket['modified_by']      = -1;
				$ticket_message_table->save($ticket_message);
			}
		}

		return $ticketId;
            
            


	}

	/**
	 * is_blank
	 *
	 * isEmpty sees a value of 0 has being empty which means that using it to test database option values fails with entries of 0
	 *
	 * @param $value
	 *
	 * @return bool
	 *
	 * @since 4.0.0
	 */
	static public function is_blank($value): bool
	{
		return empty($value) && !is_numeric($value);
	}


	/**
	 * Checks whether or not a user is manager or super user
	 *
	 * @return bool
	 *
	 * @since 4.0.0
	 */
	static public function isAdminOrSuperUser(): bool
	{
		try
		{
			$user = Factory::getUser();

			return in_array("8", $user->groups) || in_array("7", $user->groups);
		}
		catch (Exception $exc)
		{
			return false;
		}
	}

	/**
	 * Checks if a given date is valid and in a specified format (YYYY-MM-DD)
	 *
	 * @param   string  $date  Date to be checked
	 *
	 * @return bool
	 *
	 * @since 4.0.0
	 */
	static public function isValidDate(string $date): bool
	{
		$date = str_replace('/', '-', $date);

		return (date_create($date)) ? Factory::getDate($date)->format("Y-m-d") : false;
	}


	/**
	 * This method advises if the $id of the item belongs to the current user
	 *
	 * @param   integer  $id     The id of the item
	 * @param   string   $table  The name of the table
	 *
	 * @return  boolean             true if the user is the owner of the row, false if not.
	 * @since 4.0.0
	 */
	static public function userIDItem(int $id, string $table): bool
	{
		try
		{
			$user = Factory::getUser();
			$db   = Factory::getDbo();

			$query = $db->getQuery(true);
			$query->select("id")
				->from($db->quoteName($table))
				->where("id = " . $db->escape($id))
				->where("created_by = " . $user->id);

			$db->setQuery($query);

			$results = $db->loadObject();
			if ($results)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		catch (Exception $exc)
		{
			return false;
		}
	}
}
