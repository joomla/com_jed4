<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;

defined('_JEXEC') or die;

/** @var JedViewExtension $this */
?>

	<div class="jed-wrapper jed-extension-header">
		<div class="jed-container">
			<div class="jed-extension-header__content">
				<div class="jed-extension-header__item">
					<h1 class="heading heading--xl"><?php echo $this->item->title; ?></h1>
					<div class="jed-extension-header__info">
						<div class="jed-extension-header__developer">By
							<a href="#"><?php echo $this->item->developer; ?></a></div>
						<div class="stars-wrapper">
							<?php echo LayoutHelper::render('elements.stars', ['score' => $this->item->score]); ?>
							<a href="#reviews"><?php echo $this->item->reviews; ?> reviews</a>
						</div>
					</div>
				</div>
				<div class="jed-extension-header__item">
					<div class="jed-extension-header__buttons button-group">
						<?php if ($this->item->downloadLink): ?>
							<a href="<?php echo $this->item->downloadLink; ?>" class="button button--blue button--big">Get extension</a>
						<?php endif; ?>

						<a href="#" class="button button--blue button--big button--icon-only">
							<span aria-hidden="true" class="icon-heart-2"></span>
							<span class="visually-hidden">Favourite</span>
						</a>
					</div>
				</div>
			</div>
			<ul class="tabs">
				<li class="tab is-active">
					<a href="#">Free</a>
				</li>
				<li class="tab">
					<a href="#">Paid</a>
				</li>
				<li class="tab">
					<a href="#">Cloud</a>
				</li>
			</ul>
		</div>
	</div>

	<div class="jed-wrapper jed-extension margin-bottom">
		<div class="jed-container">
			<div class="jed-extension__image">
				<div class="image-placeholder">
					<?php if ($this->item->image): ?>
						<img src="<?php echo JedHelper::formatImage($this->item->image, 'large'); ?>" alt="<?php echo $this->item->title; ?>"/>
					<?php endif; ?>
				</div>
			</div>
			<div class="jed-grid jed-grid--2-1 margin-bottom">
				<div class="jed-grid__item">
					<p class="extension-tags font-size-s">
						<span aria-hidden="true" class="icon-tag"></span>
						<a href="<?php echo Route::_('index.php?option=com_jed&view=extensions&category=' . $this->item->categoryId); ?>"><?php echo $this->item->category; ?></a>,
						<?php foreach ($this->item->relatedCategories as $category): ?>
							<a href="<?php echo Route::_('index.php?option=com_jed&view=extensions&category=' . $category->id); ?>"><?php echo $category->title; ?></a>,
						<?php endforeach; ?>
					</p>
					<p class="font-size-xl">
						<?php echo $this->item->intro; ?>
					</p>
					<p class="button-group">
						<?php if ($this->item->homepageLink): ?>
							<a href="<?php echo $this->item->homepageLink; ?>" class="button button--grey">Homepage</a>
						<?php endif; ?>
						<?php if ($this->item->demoLink): ?>
							<a href="<?php echo $this->item->demoLink; ?>" class="button button--grey">Demo</a>
						<?php endif; ?>
						<?php if ($this->item->documentationLink): ?>
							<a href="<?php echo $this->item->documentationLink; ?>" class="button button--grey">Documentation</a>
						<?php endif; ?>
						<?php if ($this->item->supportLink): ?>
							<a href="<?php echo $this->item->supportLink; ?>" class="button button--grey">Support</a>
						<?php endif; ?>
						<?php if ($this->item->licenseLink): ?>
							<a href="<?php echo $this->item->licenseLink; ?>" class="button button--grey">License</a>
						<?php endif; ?>
						<?php if ($this->item->translationLink): ?>
							<a href="<?php echo $this->item->translationLink; ?>" class="button button--grey">Translation</a>
						<?php endif; ?>
					</p>
				</div>
				<div class="jed-grid__item">
					<p>
						<span class="button-group display-block align-right">
							<a href="#" class="button button--grey">Report</a>
							<a href="#" class="button button--grey">Share</a>
						</span>
					</p>
					<dl class="deflist">
						<div>
							<dt>Version</dt>
							<dd><?php echo $this->item->version; ?></dd>
						</div>
						<div>
							<dt>Last updated</dt>
							<dd><?php echo HTMLHelper::_('date', $this->item->updated, Text::_('F d, Y')); ?></dd>
						</div>
						<div>
							<dt>Date added</dt>
							<dd><?php echo HTMLHelper::_('date', $this->item->added, Text::_('F d, Y')); ?></dd>
						</div>
						<div>
							<dt>Includes</dt>
							<dd><?php echo implode(', ', array_map('ucfirst', $this->item->extensionTypes)); ?></dd>
						</div>
						<div>
							<dt>Joomla! version(s)</dt>
							<dd><?php echo implode(', ', $this->item->joomlaVersion); ?></dd>
						</div>
						<div>
							<dt>PHP version(s)</dt>
							<dd><?php echo implode(', ', $this->item->phpVersion); ?></dd>
						</div>
					</dl>
				</div>
			</div>
			<div class="jed-grid jed-grid--1-1-1 margin-bottom-half">
				<div class="jed-grid__item">
					<div class="image-placeholder"></div>
				</div>
				<div class="jed-grid__item">
					<div class="image-placeholder"></div>
				</div>
				<div class="jed-grid__item">
					<div class="image-placeholder"></div>
				</div>
			</div>
			<div class="jed-grid jed-grid--2-1 margin-bottom">
				<div class="jed-grid__item">
					<h2 class="heading heading--m">Description</h2>
					<?php
					// @TODO Parse markdown, show part of text after read all
					echo HTMLHelper::_('string.truncate', $this->item->body, 1000, true);
					?>
					<p><a href="#">Read all</a></p>
				</div>
				<div class="jed-grid__item"></div>
			</div>
			<div class="jed-grid jed-grid--1-2" id="reviews">
				<div class="jed-grid__item">
					<h2 class="heading heading--m">Reviews for free version</h2>
					<strong><?php echo $this->item->score / 10; ?></strong>
					<?php echo LayoutHelper::render('elements.stars', ['score' => $this->item->score]); ?>
					<a href="#"><?php echo $this->item->reviews; ?> reviews</a>
				</div>
				<div class="jed-grid__item">
					<h2 class="heading heading--m">Most valuable reviews</h2>
					<div class="review">
						<h3>Powerful and useful extension</h3>
						<p>Rating</p>
						<p>Positives & negatives</p>
						<p>Description</p>
						<p>Author</p>
					</div>
					<div class="review">
						<h3>Powerful and useful extension</h3>
						<p>Rating</p>
						<p>Positives & negatives</p>
						<p>Description</p>
						<p>Author</p>
					</div>
					<p><a href="#">All reviews</a></p>
				</div>
			</div>
		</div>
	</div>

<?php if ($this->item->otherExtensions): ?>
	<div class="jed-cards-wrapper margin-bottom-half">
		<h2 class="heading heading--m">Other extensions by <?php echo $this->item->developer; ?> (<?php echo count($this->item->otherExtensions); ?>)</h2>
		<div class="jed-container">
			<ul class="jed-grid jed-grid--1-1-1">
				<?php foreach ($this->item->otherExtensions as $item): ?>
					<?php echo LayoutHelper::render('cards.extension', [
						'image'         => $item->image,
						'title'         => $item->title,
						'developer'     => $item->developer,
						'score'         => $item->score,
						'reviews'       => $item->reviews,
						'compatibility' => $item->compatibility,
						'description'   => $item->intro,
						'type'          => $item->type,
						'category'      => $item->category,
						'link'          => Route::_('index.php?option=com_jed&view=extension&id=' . $item->id)
					]); ?>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
<?php endif; ?>

<?php if ($this->item->relatedExtensions): ?>
	<div class="jed-cards-wrapper margin-bottom-half">
		<div class="jed-container">
			<h2 class="heading heading--m">You might also be interested in</h2>
			<ul class="jed-grid jed-grid--1-1-1">
				<?php foreach ($this->item->relatedExtensions as $item): ?>
					<?php echo LayoutHelper::render('cards.extension', [
						'image'         => $item->image,
						'title'         => $item->title,
						'developer'     => $item->developer,
						'score'         => $item->score,
						'reviews'       => $item->reviews,
						'compatibility' => $item->compatibility,
						'description'   => $item->intro,
						'type'          => $item->type,
						'category'      => $item->category,
						'link'          => Route::_('index.php?option=com_jed&view=extension&id=' . $item->id)
					]); ?>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
<?php endif; ?>