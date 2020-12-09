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

INSERT  INTO `admin`(`id`,`name`,`label`,`created`) VALUES (1,'萌新','第一次报道','2020-09-23 02:32:18.711136'),(2,'新人','来逛逛','2020-09-23 02:32:29.142567'),(3,'老板','打赏','2020-09-23 02:32:40.422285'),(4,'商人','寻求商机','2020-09-23 02:32:46.201144');

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

INSERT  INTO `user`(`id`,`created`,`updated`,`account`,`pwd`,`name`,`status`,`phone`,`photo`,`logged`) VALUES (1,'2020-09-23 00:13:34.795800','2020-09-23 00:13:34.795800','admin','·\\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','admin',1,NULL,NULL,NULL),(2,'2020-09-23 00:15:05.662503','2020-09-23 00:15:05.662503','Asciphx','·\\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','accp',1,NULL,NULL,NULL),(3,'2020-09-23 00:15:15.705353','2020-09-23 00:15:15.705353','Asp.net','·\\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','asp.net',1,NULL,NULL,NULL),(4,'2020-09-23 00:15:30.421221','2020-09-23 00:15:30.421221','Jdk','·\\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','jdk',1,NULL,NULL,NULL),(5,'2020-09-23 00:15:51.080007','2020-09-23 00:15:51.080007','hook','·\\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','hook',1,NULL,NULL,NULL),(6,'2020-09-23 00:15:56.378298','2020-09-23 00:15:56.378298','accp','·\\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','hooks',1,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
