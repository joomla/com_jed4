<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

?>
<div id="j-main-container" class="span12">
    <div class="pull-left">
        <h2><?php echo Text::_('COM_JED_HOME_TOTAL_REVIEWS'); ?></h2>
        <?php echo $this->totals['reviews']; ?>
    </div>

    <div class="pull-left">
        <h2><?php echo Text::_('COM_JED_HOME_TOTAL_EXTENSIONS'); ?></h2>
        <?php echo $this->totals['extensions']; ?>
    </div>

    <div class="pull-left">
        <h2><?php echo Text::_('COM_JED_HOME_TOTAL_REVIEWS_PER_DAY'); ?></h2>
        <?php echo $this->totals['reviewsPerDay']; ?>
    </div>
</div>
<div class="span5">
    <table class="table table-striped">
        <caption><?php echo Text::_('COM_JED_HOME_REVIEWS'); ?></caption>
        <thead>
            <tr>
                <td><?php echo Text::_('COM_JED_HOME_TITLE_TITLE'); ?></td>
                <td><?php echo Text::_('COM_JED_HOME_TITLE_DATE'); ?></td>
                <td><?php echo Text::_('COM_JED_HOME_TITLE_EXTENSION'); ?></td>
                <td><?php echo Text::_('COM_JED_HOME_TITLE_PUBLISHED'); ?></td>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($this->reviews as $review) : ?>
                <tr>
                    <td><?php echo $review->title ; ?></td>
                    <td><?php echo HTMLHelper::_('date', $review->created_on); ?></td>
                    <td><?php echo $review->extension ; ?></td>
                    <td><?php echo $review->published ? Text::_('JYES') : Text::_('JNO'); ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<div class="span5">
    <table class="table table-striped">
        <caption><?php echo Text::_('COM_JED_HOME_TICKETS'); ?></caption>
        <thead>
        <tr>
            <td><?php echo Text::_('COM_JED_HOME_TITLE_SUBJECT'); ?></td>
            <td><?php echo Text::_('COM_JED_HOME_TITLE_DATE'); ?></td>
            <td><?php echo Text::_('COM_JED_HOME_TITLE_CREATED_BY'); ?></td>
            <td><?php echo Text::_('COM_JED_HOME_TITLE_STATUS'); ?></td>
            <td><?php echo Text::_('COM_JED_HOME_TITLE_CATEGORY'); ?></td>
            <td><?php echo Text::_('COM_JED_HOME_TITLE_EXTENSION'); ?></td>
            <td><?php echo Text::_('COM_JED_HOME_TITLE_ASSIGNED_TO'); ?></td>
        </tr>
        </thead>
        <tbody>
		<?php foreach ($this->tickets as $ticket) : ?>
            <tr>
                <td><?php echo $ticket; ?></td>
                <td><?php echo $ticket; ?></td>
                <td><?php echo $ticket; ?></td>
                <td><?php echo $ticket; ?></td>
                <td><?php echo $ticket; ?></td>
                <td><?php echo $ticket; ?></td>
                <td><?php echo $ticket; ?></td>
            </tr>
		<?php endforeach; ?>
        </tbody>
    </table>
</div>
