/*
SQLyog v10.2 
MySQL - 8.0.11 : Database - test
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(9) NOT NULL COMMENT '游客名',
  `label` varchar(30) NOT NULL DEFAULT '' COMMENT '标签',
  `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '加入日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `admin` */

/*Table structure for table `parse` */

DROP TABLE IF EXISTS `parse`;

CREATE TABLE `parse` (
  `keyword` varchar(9) NOT NULL COMMENT '键',
  `keywordDESC` varchar(255) NOT NULL COMMENT '选项值',
  `parameterName` varchar(7) NOT NULL COMMENT '描述',
  PRIMARY KEY (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `parse` */

insert  into `parse`(`keyword`,`keywordDESC`,`parameterName`) values ('BLOOD','0=未知,1=A型,2=B型,3=O型,4=AB型','血型'),('EDUCATION','0=未知,1=专科以下,2=专科,3=本科,4=硕士,5=博士','学历'),('GENDER','0=未知,M=男性,F=女性','性别'),('ID_TYPE','0=身份证,1=护照,2=军官证','证件类型'),('LOGINLOG_','L=登录,Q=退出,P=重要行为','登录日志类型'),('MARRIAGE','0=未知,1=已婚,2=未婚,3=离异,4=丧偶','婚姻情况'),('NATIONALI','0=未知,1=汉族,2=满族,3=蒙古族,4=回族,5=藏族,6=壮族,7=苗族,8=维吾尔族,9=其他','民族'),('POLITYFAC','0=未知,1=无党派人士,2=共产党员,9=民主党党员','政治面貌'),('RELIGION','0=无宗教,1=佛教,2=道教,3=基督教,4=天主教,5=东正教,6=伊斯兰教,9=其他教','宗教'),('STATUS','0=正常,S=失效,C=建档,N=新员工,E=过期,P=暂停,F=欠费,X=待清理','状态'),('USER_TYPE','0=员工,C=客户,P=合作伙伴,T=临时用户','用户类型');

/*Table structure for table `query-result-cache` */

DROP TABLE IF EXISTS `query-result-cache`;

CREATE TABLE `query-result-cache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `duration` int(11) NOT NULL,
  `query` text NOT NULL,
  `result` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `query-result-cache` */

insert  into `query-result-cache`(`id`,`identifier`,`time`,`duration`,`query`,`result`) values (1,NULL,1607530738817,2000,'SELECT `user`.`id` AS `user_id`, `user`.`created` AS `user_created`, `user`.`updated` AS `user_updated`, `user`.`account` AS `user_account`, `user`.`name` AS `user_name`, `user`.`status` AS `user_status`, `user`.`phone` AS `user_phone`, `user`.`photo` AS `user_photo`, `user`.`logged` AS `user_logged` FROM `user` `user` ORDER BY `user`.`id` DESC LIMIT 10 -- PARAMETERS: []','[{\"user_id\":1,\"user_created\":\"2020-12-09T15:55:39.544Z\",\"user_updated\":\"2020-12-09T15:55:39.544Z\",\"user_account\":\"admin\",\"user_name\":\"admin\",\"user_status\":1,\"user_phone\":null,\"user_photo\":null,\"user_logged\":null}]'),(2,NULL,1607530738883,2000,'SELECT COUNT(DISTINCT(`user`.`id`)) as \"cnt\" FROM `user` `user` -- PARAMETERS: []','[{\"cnt\":\"1\"}]');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建日期',
  `updated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '修改日期',
  `account` varchar(10) NOT NULL COMMENT '账户（3-10）',
  `pwd` varchar(50) NOT NULL COMMENT '密码（6-25）',
  `name` varchar(15) NOT NULL COMMENT '昵称',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '默认状态：1，未禁用',
  `phone` varchar(12) DEFAULT NULL COMMENT '电话',
  `photo` varchar(50) DEFAULT NULL COMMENT '头像',
  `logged` datetime DEFAULT NULL COMMENT '登录时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user` */

insert  into `user`(`id`,`created`,`updated`,`account`,`pwd`,`name`,`status`,`phone`,`photo`,`logged`) values (1,'2020-12-09 23:55:39.544395','2020-12-09 23:55:39.544395','admin','·\\C]·DwÐ;âÚÐa\"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','admin',1,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
