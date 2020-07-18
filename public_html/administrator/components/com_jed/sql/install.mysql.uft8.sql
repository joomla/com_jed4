CREATE TABLE IF NOT EXISTS `#__jed_admin_notes`
(
    `id`             int(11) unsigned NOT NULL AUTO_INCREMENT,
    `created_by`     int(6)           NOT NULL,
    `created`        datetime         NOT NULL,
    `message`        text             NOT NULL,
    `type`           varchar(50)      NOT NULL,
    `parent_type_id` int(11)          NOT NULL,
    `do_mail`        tinyint(1)       NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_audit`
(
    `id`            int(11) unsigned NOT NULL AUTO_INCREMENT,
    `created_time`  datetime         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id`       int(11)          NOT NULL,
    `event`         varchar(50)      NOT NULL,
    `event_item_id` int(6)           NOT NULL,
    `message`       text             NOT NULL,
    `ip_address`    char(45)         NOT NULL,
    `location`      varchar(100)     NOT NULL,
    `browser`       varchar(50)      NOT NULL,
    `platform`      varchar(50)      NOT NULL,
    `major_version` int(3)           NOT NULL,
    `minor_version` int(3)           NOT NULL,
    `is_mobile`     tinyint(1)       NOT NULL,
    `suspicious`    tinyint(1)       NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `#__jed_audit_FK` (`user_id`),
    CONSTRAINT `#__jed_audit_FK` FOREIGN KEY (`user_id`) REFERENCES `#__users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_extension_files`
(
    `id`            int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id`  int(11) unsigned NOT NULL,
    `file`          varchar(255)     NOT NULL,
    `meta`          text,
    `created_by`    int(11)      DEFAULT NULL,
    `original_file` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `Extension files` (`extension_id`),
    CONSTRAINT `Extension files` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_extension_linkcheck_log`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `datetime`     datetime          DEFAULT NULL,
    `extension_id` int(11) unsigned  DEFAULT NULL COMMENT 'The extension id which failed the ping',
    `link_type`    varchar(255)      DEFAULT NULL COMMENT 'the field name of the link which failed the ping',
    `core_title`   varchar(255)      DEFAULT NULL,
    `url`          varchar(255)      DEFAULT NULL,
    `fail_count`   int(255) unsigned DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `Extension link check log` (`extension_id`),
    CONSTRAINT `Extension link check` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_extensions`
(
    `id`                      int(11) unsigned NOT NULL AUTO_INCREMENT,
    `title`                   varchar(400)     NOT NULL DEFAULT '',
    `alias`                   varchar(400)     NOT NULL DEFAULT '',
    `body`                    mediumtext       NOT NULL,
    `published`               int(3)           NOT NULL DEFAULT '0',
    `ordering`                int(11)          NOT NULL DEFAULT '0',
    `checked_out`             int(11) unsigned          DEFAULT '0',
    `created_by`              int(11)                   DEFAULT '0',
    `modified_by`             int(11) unsigned          DEFAULT '0',
    `checked_out_time`        datetime                  DEFAULT NULL,
    `created_on`              datetime                  DEFAULT NULL,
    `modified_on`             datetime                  DEFAULT NULL,
    `homepageLink`            varchar(255)              DEFAULT NULL,
    `downloadLink`            varchar(255)              DEFAULT NULL,
    `demoLink`                varchar(255)              DEFAULT NULL,
    `supportLink`             varchar(255)              DEFAULT NULL,
    `documentationLink`       varchar(255)              DEFAULT NULL,
    `licenseLink`             varchar(255)              DEFAULT NULL,
    `translationLink`         varchar(255)              DEFAULT NULL,
    `versions`                varchar(255)              DEFAULT NULL,
    `popular`                 tinyint(1)                DEFAULT NULL,
    `requiresRegistration`    tinyint(1)                DEFAULT NULL,
    `type`                    varchar(8)                DEFAULT NULL,
    `relatedFreePaidId`       int(11)                   DEFAULT NULL,
    `license`                 varchar(20)               DEFAULT NULL,
    `jedNote`                 text,
    `updateUrl`               varchar(255)              DEFAULT NULL,
    `updateUrlOk`             tinyint(1)       NOT NULL DEFAULT '0',
    `canUpdate`               tinyint(1)       NOT NULL DEFAULT '1',
    `tags`                    text,
    `languageCode`            varchar(100)              DEFAULT NULL,
    `video`                   varchar(255)              DEFAULT NULL,
    `version`                 varchar(255)              DEFAULT NULL,
    `usesUpdater`             tinyint(1)                DEFAULT NULL,
    `includes`                varchar(100)              DEFAULT NULL,
    `score`                   double(6, 2)              DEFAULT NULL,
    `approved`                int(2)                    DEFAULT NULL,
    `approvedTime`            datetime                  DEFAULT NULL,
    `extensionFile`           varchar(150)              DEFAULT NULL,
    `downloadIntegrationType` varchar(100)              DEFAULT NULL,
    `downloadIntegrationUrl`  varchar(255)              DEFAULT NULL,
    `secondContactEmail`      varchar(100)              DEFAULT NULL,
    `currency`                varchar(50)               DEFAULT NULL,
    `price`                   double(6, 2)              DEFAULT NULL,
    `pricePer`                int(2)                    DEFAULT NULL,
    `priceInterval`           char(6)                   DEFAULT NULL,
    `languageBody`            text,
    `backlink`                tinyint(1)                DEFAULT '0',
    `nonGplCssJs`             tinyint(1)                DEFAULT '0',
    `parent_id`               int(6)                    DEFAULT NULL,
    `functionality`           int(3) unsigned           DEFAULT NULL,
    `easeOfUse`               int(3) unsigned           DEFAULT NULL,
    `support`                 int(3) unsigned           DEFAULT NULL,
    `documentation`           int(3) unsigned           DEFAULT NULL,
    `valueForMoney`           int(3) unsigned           DEFAULT NULL,
    `numReviews`              int(6)           NOT NULL,
    `jedChecked`              tinyint(1)                DEFAULT NULL,
    `usesThirdParty`          tinyint(1)                DEFAULT '0',
    `intro`                   varchar(255)     NOT NULL DEFAULT '',
    `category_id`             int(11)          NOT NULL DEFAULT '0',
    `logo`                    varchar(255)     NOT NULL DEFAULT '' COMMENT 'The extension logo',
    `communityChoice`         tinyint(1)       NOT NULL DEFAULT '0',
    `approvedNotes`           varchar(255)     NOT NULL DEFAULT '',
    `approvedReason`          varchar(4)       NOT NULL DEFAULT '',
    `publishedNotes`          varchar(255)     NOT NULL DEFAULT '',
    `publishedReason`         varchar(4)       NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    KEY `Extensions Categories` (`category_id`),
    CONSTRAINT `Extensions Categories` FOREIGN KEY (`category_id`) REFERENCES `#__categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 5
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_extensions_categories`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id` int(11) unsigned NOT NULL,
    `category_id`  int(11)          NOT NULL,
    PRIMARY KEY (`id`),
    KEY `Extension Categories Extensions` (`extension_id`),
    KEY `Extension Categories` (`category_id`),
    CONSTRAINT `Extension Categories` FOREIGN KEY (`category_id`) REFERENCES `#__categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Extension Categories Extensions` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='Cross-reference table between extensions and categories';

CREATE TABLE IF NOT EXISTS `#__jed_extensions_favoured`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id` int(11) unsigned NOT NULL,
    `user_id`      int(11)          NOT NULL,
    `created`      datetime         NOT NULL,
    PRIMARY KEY (`id`),
    KEY `Extensions favoured` (`extension_id`),
    CONSTRAINT `Extensions favoured` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `#__jed_extensions_files`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id` int(11) unsigned NOT NULL,
    `file`         varchar(255)     NOT NULL,
    `meta`         text,
    `created_by`   int(11)      DEFAULT NULL,
    `originalFile` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `Extensions files` (`extension_id`),
    CONSTRAINT `Extension files` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_extensions_images`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id` int(11) unsigned NOT NULL,
    `filename`     varchar(255)     NOT NULL,
    `order`        int(3)           NOT NULL,
    PRIMARY KEY (`id`),
    KEY `Extension images` (`extension_id`),
    CONSTRAINT `Extension images` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `#__jed_extensions_joomla_versions`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id` int(11) unsigned NOT NULL,
    `version`      varchar(8)       NOT NULL DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='Cross-reference table between extensions and Joomla versions';

CREATE TABLE `#__jed_extensions_php_versions`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id` int(11) unsigned NOT NULL,
    `version`      varchar(8)       NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    KEY `Extensions PHP Versions` (`extension_id`),
    CONSTRAINT `Extensions PHP Versions` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='Cross-reference table between extensions and PHP versions';

CREATE TABLE `#__jed_extensions_published_reasons`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id` int(11) unsigned NOT NULL,
    `reason`       varchar(4)       NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    KEY `Extensions Published Reason` (`extension_id`),
    CONSTRAINT `Extensions Published Reason` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='Cross-reference table between extensions and published reasons';

CREATE TABLE IF NOT EXISTS `#__jed_extensions_related`
(
    `id`           int(11) unsigned NOT NULL,
    `related_id`   int(11) unsigned NOT NULL,
    `extension_id` int(11) unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `Extensions Main` (`extension_id`),
    KEY `Extensions Related` (`related_id`),
    CONSTRAINT `Extensions Main` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Extensions Related` FOREIGN KEY (`related_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_extensions_status`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id` int(11) unsigned DEFAULT NULL,
    `created_time` datetime         DEFAULT NULL,
    `type`         char(30)         DEFAULT NULL,
    `code`         char(50)         DEFAULT NULL,
    `message`      text,
    `user_id`      int(11)          DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `Extension status` (`extension_id`),
    CONSTRAINT `Extension status` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='When a user submits a new extension we make a record in here for the pending\r\nIf admin changes published or approved state we make a note here as well';

CREATE TABLE `#__jed_extensions_types`
(
    `id`           int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id` int(11) unsigned NOT NULL,
    `type`         varchar(20)      NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Unique Extension Type` (`extension_id`, `type`),
    CONSTRAINT `Extension Types` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='Hold the extension type for each extension';

CREATE TABLE IF NOT EXISTS `#__jed_hit_log`
(
    `id`            int(11) unsigned NOT NULL AUTO_INCREMENT,
    `created_time`  datetime         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id`       int(11)          NOT NULL,
    `extension_id`  int(11) unsigned NOT NULL,
    `ip_address`    char(45)         NOT NULL,
    `location`      varchar(100)     NOT NULL,
    `browser`       varchar(50)      NOT NULL,
    `platform`      varchar(50)      NOT NULL,
    `major_version` int(3)           NOT NULL,
    `minor_version` int(3)           NOT NULL,
    `is_robot`      tinyint(1)       NOT NULL DEFAULT '0',
    `is_mobile`     tinyint(1)       NOT NULL,
    `suspicious`    tinyint(1)       NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `Extension Hit log` (`extension_id`),
    KEY `User Hit log` (`user_id`),
    CONSTRAINT `Extension Hit log` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `User Hit log` FOREIGN KEY (`user_id`) REFERENCES `#__users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_reviews`
(
    `id`              int(11) unsigned NOT NULL AUTO_INCREMENT,
    `extension_id`    int(11) unsigned          DEFAULT NULL,
    `functionality`   int(3)                    DEFAULT NULL,
    `ease_of_use`     int(3)                    DEFAULT NULL,
    `support`         int(3)                    DEFAULT NULL,
    `documentation`   int(3)                    DEFAULT NULL,
    `valueForMoney`   int(3)                    DEFAULT NULL,
    `overallScore`    int(3)                    DEFAULT NULL,
    `usedFor`         varchar(280)              DEFAULT NULL,
    `version`         varchar(10)               DEFAULT NULL,
    `flagged`         tinyint(1)       NOT NULL,
    `parent_id`       int(6)           NOT NULL,
    `ipAddress`       varchar(20)               DEFAULT NULL,
    `imported`        int(1)                    DEFAULT '0',
    `title`           varchar(400)     NOT NULL DEFAULT '',
    `alias`           varchar(400)     NOT NULL DEFAULT '',
    `body`            mediumtext       NOT NULL,
    `published`       tinyint(1)       NOT NULL DEFAULT '0',
    `created_on`      datetime                  DEFAULT NULL,
    `created_by`      int(11)          NOT NULL,
    PRIMARY KEY (`id`),
    KEY `Reviews` (`extension_id`),
    KEY `User Reviews` (`created_by`),
    CONSTRAINT `Reviews` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `User Reviews` FOREIGN KEY (`created_by`) REFERENCES `#__users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_suspect_ip_range`
(
    `id`         int(11) unsigned NOT NULL AUTO_INCREMENT,
    `created_by` int(11)          NOT NULL,
    `created`    datetime         NOT NULL,
    `start`      char(45)         NOT NULL,
    `end`        char(45)         NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_ticket_files`
(
    `id`         int(11) unsigned NOT NULL AUTO_INCREMENT,
    `ticket_id`  int(11) unsigned NOT NULL,
    `file`       varchar(255)     NOT NULL,
    `meta`       text,
    `created_by` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `Ticket Files` (`ticket_id`),
    CONSTRAINT `Ticket Files` FOREIGN KEY (`ticket_id`) REFERENCES `#__jed_tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_tickets`
(
    `id`               int(11) unsigned NOT NULL AUTO_INCREMENT,
    `created_by`       int(11)          NOT NULL,
    `created`          datetime         NOT NULL,
    `extension_id`     int(11) unsigned DEFAULT NULL,
    `review_id`        int(11) unsigned DEFAULT NULL,
    `category`         int(3)           NOT NULL,
    `subject`          varchar(255)     NOT NULL,
    `message`          text             NOT NULL,
    `status`           int(3)           NOT NULL,
    `modified`         datetime         NOT NULL,
    `understand`       tinyint(1)       NOT NULL,
    `reason`           varchar(255)     NOT NULL,
    `assigned_to_date` datetime         DEFAULT NULL,
    `assigned_to`      int(11)          DEFAULT NULL,
    `parent_type_id`   int(11)          NOT NULL,
    PRIMARY KEY (`id`),
    KEY `Extension Tickets` (`extension_id`),
    KEY `Review Tickets` (`review_id`),
    CONSTRAINT `Extension Tickets` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Review Tickets` FOREIGN KEY (`review_id`) REFERENCES `#__jed_reviews` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_user_bans`
(
    `id`               int(11) unsigned NOT NULL AUTO_INCREMENT,
    `user_id`          int(11)     DEFAULT NULL,
    `banned_reason`    text,
    `apply_period`     varchar(10) DEFAULT NULL,
    `apply_start_time` datetime    DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `User Bans` (`user_id`),
    CONSTRAINT `User Access` FOREIGN KEY (`user_id`) REFERENCES `#__users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `User Bans` FOREIGN KEY (`user_id`) REFERENCES `#__users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_emails`
(
    `id`               INT(10) unsigned NOT NULL AUTO_INCREMENT
        COMMENT 'Auto increment ID',
    `subject`          VARCHAR(150)     NOT NULL
        COMMENT 'The subject',
    `body`             TEXT             NOT NULL
        COMMENT 'The body text',
    `created`          DATETIME         NOT NULL DEFAULT '0000-00-00 00:00:00',
    `created_by`       INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `modified`         DATETIME         NOT NULL DEFAULT '0000-00-00 00:00:00',
    `modified_by`      INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `checked_out`      INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `checked_out_time` DATETIME         NOT NULL DEFAULT '0000-00-00 00:00:00',
    PRIMARY KEY (`id`)
)
    CHARSET = utf8mb4
    COMMENT = 'Email templates';

CREATE TABLE IF NOT EXISTS `#__jed_email_logs`
(
    `id`               INT(11) UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Auto increment ID',
    `extension_id`     INT(11) UNSIGNED NOT NULL,
    `subject`          VARCHAR(150)     NOT NULL
        COMMENT 'The subject',
    `body`             TEXT             NOT NULL
        COMMENT 'The body text',
    `developer_id`     INT(11)          NOT NULL,
    `developer_name`   VARCHAR(400)     NOT NULL DEFAULT '',
    `developer_email`  VARCHAR(100)     NOT NULL DEFAULT '',
    `created`          DATETIME         NULL,
    `created_by`       INT(11)          NOT NULL DEFAULT '0',
    `modified`         DATETIME         NULL,
    `modified_by`      INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `checked_out`      INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `checked_out_time` DATETIME         NULL,
    PRIMARY KEY (`id`),
    KEY `developer_user` (`developer_id`),
    KEY `member_user` (`created_by`),
    KEY `extension_email_logs` (`extension_id`),
    CONSTRAINT `developer_user` FOREIGN KEY (`developer_id`) REFERENCES `#__users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `extension_email_logs` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `member_user` FOREIGN KEY (`created_by`) REFERENCES `#__users` (`id`) ON UPDATE CASCADE
)
    CHARSET = utf8mb4
    COMMENT = 'Email logs';

CREATE TABLE IF NOT EXISTS `#__jed_extensions_notes`
(
    `id`               INT(11) UNSIGNED NOT NULL AUTO_INCREMENT
        COMMENT 'Auto increment ID',
    `extension_id`     INT(11) UNSIGNED NOT NULL,
    `body`             TEXT             NOT NULL
        COMMENT 'The body text',
    `developer_id`     INT(11)          NOT NULL,
    `developer_name`   VARCHAR(400)     NOT NULL DEFAULT '',
    `created`          DATETIME         NULL,
    `created_by`       INT(11)          NOT NULL DEFAULT '0',
    `modified`         DATETIME         NULL,
    `modified_by`      INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `checked_out`      INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `checked_out_time` DATETIME         NULL,
    PRIMARY KEY (`id`),
    KEY `developer_user` (`developer_id`),
    KEY `member_user` (`created_by`),
    CONSTRAINT `developer_user_notes` FOREIGN KEY (`developer_id`) REFERENCES `#__users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `extension_extensions_notes` FOREIGN KEY (`extension_id`) REFERENCES `#__jed_extensions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `member_user_notes` FOREIGN KEY (`created_by`) REFERENCES `#__users` (`id`) ON UPDATE CASCADE
)
    CHARSET = utf8mb4
    COMMENT = 'Internal notes';

INSERT INTO `#__action_logs_extensions` (`extension`)
VALUES ('com_jed');
INSERT INTO `#__action_log_config` (`type_title`, `type_alias`, `id_holder`, `title_holder`, `table_name`,
                                    `text_prefix`)
VALUES ('extension', 'com_jed.extension', 'id', 'title', '#__jed_extensions', 'COM_JED_TRANSACTION');
INSERT INTO `#__action_log_config` (`type_title`, `type_alias`, `id_holder`, `title_holder`, `table_name`, `text_prefix`)
VALUES ('review', 'com_jed.review', 'id', 'title', '#__jed_reviews', 'COM_JED_TRANSACTION');
