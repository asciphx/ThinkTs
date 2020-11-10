/*
MySQL - 8.0.11 : Database - spring
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;
/*!40101 SET SQL_MODE=''*/;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`spring` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(9) NOT NULL COMMENT '游客名',
  `label` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '标签',
  `created` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '加入日期',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `admin` */

INSERT  INTO `admin`(`id`,`name`,`label`,`created`) VALUES (1,'萌新','第一次报道','2020-09-23 02:32:18.711136'),(2,'新人','来逛逛','2020-09-23 02:32:29.142567'),(3,'老板','打赏','2020-09-23 02:32:40.422285'),(4,'商人','寻求商机','2020-09-23 02:32:46.201144');

/*Table structure for table `menu` */

DROP TABLE IF EXISTS `menu`;

CREATE TABLE `menu` (
  `id` SMALLINT(6) NOT NULL AUTO_INCREMENT,
  `pid` SMALLINT(6) NOT NULL DEFAULT '0' COMMENT '父节点id',
  `name` VARCHAR(10) NOT NULL COMMENT '名称',
  `type` TINYINT(4) NOT NULL DEFAULT '1' COMMENT '类型（0：目录、1：路由、2：按钮）',
  `weight` TINYINT(4) NOT NULL DEFAULT '99' COMMENT '权重（0-99）',
  `perm` VARCHAR(15) NOT NULL DEFAULT '' COMMENT '前端标识',
  `path` VARCHAR(40) NOT NULL COMMENT '请求方法路径，比如GET/menu',
  `pic` VARCHAR(25) DEFAULT NULL COMMENT '图标',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_51b63874cdce0d6898a0b2150f` (`name`)
) ENGINE=INNODB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `menu` */

INSERT  INTO `menu`(`id`,`pid`,`name`,`type`,`weight`,`perm`,`path`,`pic`) VALUES (1,0,'查权限',1,99,'','GET/role/perm',NULL),(2,0,'删用户',1,99,'','DELETE/user/',NULL),(3,0,'改用户',1,99,'','PUT/user/',NULL),(4,0,'查用户',1,99,'','GET/user/',NULL),(5,0,'页用户',1,99,'','GET/user',NULL),(6,0,'增菜单',1,99,'','POST/menu',NULL),(7,0,'删菜单',1,99,'','DELETE/menu/',NULL),(8,0,'改菜单',1,99,'','PUT/menu/',NULL),(9,0,'查菜单',1,99,'','GET/menu/',NULL),(10,0,'页菜单',1,99,'','GET/menu',NULL),(11,0,'增游客',1,99,'','POST/admin',NULL),(12,0,'删游客',1,99,'','DELETE/admin/',NULL),(13,0,'改游客',1,99,'','PUT/admin/',NULL),(14,0,'查游客',1,99,'','GET/admin/',NULL),(15,0,'页游客',1,99,'','GET/admin',NULL),(16,0,'增角色',1,99,'','POST/role',NULL),(17,0,'删角色',1,99,'','DELETE/role/',NULL),(18,0,'改角色',1,99,'','PUT/role/',NULL),(19,0,'查角色',1,99,'','GET/role/',NULL),(20,0,'页角色',1,99,'','GET/role',NULL);

/*Table structure for table `menu_role` */

DROP TABLE IF EXISTS `menu_role`;

CREATE TABLE `menu_role` (
  `menu_id` SMALLINT(6) NOT NULL,
  `role_id` SMALLINT(6) NOT NULL,
  PRIMARY KEY (`menu_id`,`role_id`),
  KEY `IDX_143506d9bf15aadfe43855ad04` (`menu_id`),
  KEY `IDX_a003b451f469f1818762c92fb1` (`role_id`),
  CONSTRAINT `FK_143506d9bf15aadfe43855ad044` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_a003b451f469f1818762c92fb15` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `menu_role` */

INSERT  INTO `menu_role`(`menu_id`,`role_id`) VALUES (1,1),(1,2),(1,3),(1,6),(2,2),(3,2),(3,4),(4,2),(4,3),(4,4),(5,2),(5,3),(5,5),(6,2),(6,3),(7,2),(8,2),(8,4),(9,2),(9,3),(9,4),(10,2),(10,3),(10,5),(11,3),(11,5),(12,5),(13,4),(13,5),(14,2),(14,3),(14,4),(14,5),(15,2),(15,3),(15,5),(16,2),(16,3),(17,2),(18,2),(18,4),(19,2),(19,3),(19,4),(20,2),(20,3),(20,5);

/*Table structure for table `parse` */

DROP TABLE IF EXISTS `parse`;

CREATE TABLE `parse` (
  `keyword` VARCHAR(9) NOT NULL COMMENT '键',
  `keywordDESC` VARCHAR(255) NOT NULL COMMENT '选项值',
  `parameterName` VARCHAR(7) NOT NULL COMMENT '描述',
  PRIMARY KEY (`keyword`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `parse` */

INSERT  INTO `parse`(`keyword`,`keywordDESC`,`parameterName`) VALUES ('BLOOD','0=未知,1=A型,2=B型,3=O型,4=AB型','血型'),('EDUCATION','0=未知,1=专科以下,2=专科,3=本科,4=硕士,5=博士','学历'),('GENDER','0=未知,M=男性,F=女性','性别'),('ID_TYPE','0=身份证,1=护照,2=军官证','证件类型'),('LOGINLOG_','L=登录,Q=退出,P=重要行为','登录日志类型'),('MARRIAGE','0=未知,1=已婚,2=未婚,3=离异,4=丧偶','婚姻情况'),('NATIONALI','0=未知,1=汉族,2=满族,3=蒙古族,4=回族,5=藏族,6=壮族,7=苗族,8=维吾尔族,9=其他','民族'),('POLITYFAC','0=未知,1=无党派人士,2=共产党员,9=民主党党员','政治面貌'),('RELIGION','0=无宗教,1=佛教,2=道教,3=基督教,4=天主教,5=东正教,6=伊斯兰教,9=其他教','宗教'),('STATUS','0=正常,S=失效,C=建档,N=新员工,E=过期,P=暂停,F=欠费,X=待清理','状态'),('USER_TYPE','0=员工,C=客户,P=合作伙伴,T=临时用户','用户类型');

/*Table structure for table `role` */

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` SMALLINT(6) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(9) NOT NULL COMMENT '名称',
  `remark` VARCHAR(25) DEFAULT NULL COMMENT '标签简介',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ae4578dcaed5adff96595e6166` (`name`)
) ENGINE=INNODB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `role` */

INSERT  INTO `role`(`id`,`name`,`remark`) VALUES (1,'admin','董事长'),(2,'super','超级管理员'),(3,'hook','委员'),(4,'personnel','职员'),(5,'manager','总经理'),(6,'comptroll','审计主任'),(7,'president','总裁'),(8,'CEO','首席执行官'),(9,'CTO','技术总督'),(10,'CFO','财务总监'),(11,'COO','运营总监'),(12,'CIO','信息部长'),(13,'CKO','知识部长'),(14,'CPO','产品总督'),(15,'CGO','游戏总督'),(16,'CMO','市场营销官'),(17,'CSO','问题提督'),(18,'CXO','惊喜部长'),(19,'CHO','人力资源提督');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `created` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建日期',
  `updated` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '修改日期',
  `account` VARCHAR(10) NOT NULL COMMENT '账户',
  `pwd` VARCHAR(40) NOT NULL COMMENT '密码（select禁用）',
  `name` VARCHAR(15) NOT NULL COMMENT '昵称',
  `status` TINYINT(4) NOT NULL DEFAULT '1' COMMENT '默认状态：1，未禁用',
  `phone` VARCHAR(12) DEFAULT NULL COMMENT '电话',
  `photo` VARCHAR(50) DEFAULT NULL COMMENT '头像',
  `logged` DATETIME DEFAULT NULL COMMENT '登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_4ab2df0a57a74fdf904e0e2708` (`account`)
) ENGINE=INNODB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user` */

INSERT  INTO `user`(`id`,`created`,`updated`,`account`,`pwd`,`name`,`status`,`phone`,`photo`,`logged`) VALUES (1,'2020-09-23 00:13:34.795800','2020-09-23 00:13:34.795800','admin','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E','admin',1,NULL,NULL,NULL),(2,'2020-09-23 00:15:05.662503','2020-09-23 00:15:05.662503','Asciphx','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E','accp',1,NULL,NULL,NULL),(3,'2020-09-23 00:15:15.705353','2020-09-23 00:15:15.705353','Asp.net','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E','asp.net',1,NULL,NULL,NULL),(4,'2020-09-23 00:15:30.421221','2020-09-23 00:15:30.421221','Jdk','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E','jdk',1,NULL,NULL,NULL),(5,'2020-09-23 00:15:51.080007','2020-09-23 00:15:51.080007','hook','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E','hook',1,NULL,NULL,NULL),(6,'2020-09-23 00:15:56.378298','2020-09-23 00:15:56.378298','accp','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E','hooks',1,NULL,NULL,NULL);

/*Table structure for table `user_role` */

DROP TABLE IF EXISTS `user_role`;

CREATE TABLE `user_role` (
  `user_id` INT(11) NOT NULL,
  `role_id` SMALLINT(6) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `IDX_d0e5815877f7395a198a4cb0a4` (`user_id`),
  KEY `IDX_32a6fc2fcb019d8e3a8ace0f55` (`role_id`),
  CONSTRAINT `FK_32a6fc2fcb019d8e3a8ace0f55f` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_d0e5815877f7395a198a4cb0a46` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user_role` */

INSERT  INTO `user_role`(`user_id`,`role_id`) VALUES (1,1),(1,2),(2,2),(3,2),(6,2),(1,3),(2,3),(4,3),(5,3),(6,3),(3,5),(4,6),(5,7),(6,8);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
