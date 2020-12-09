--
-- PostgreSQL database dump
--
-- Dumped from database version 13.0
-- Dumped by pg_dump version 13.0

-- Started on 2020-11-08 00:12:47
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;


DROP TABLE if exists public.admin;
CREATE TABLE public.admin (
    id integer NOT NULL,
    name character varying(9) NOT NULL,
    label character varying(30) DEFAULT ''::character varying NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


DROP TABLE if exists public.menu_role;
CREATE TABLE public.menu_role (
    menu_id smallint NOT NULL,
    role_id smallint NOT NULL
);

DROP TABLE if exists public.menu;
CREATE TABLE public.menu (
    id smallint NOT NULL,
    pid smallint DEFAULT 0 NOT NULL,
    name character varying(10) NOT NULL,
    type smallint DEFAULT 1 NOT NULL,
    weight smallint DEFAULT 99 NOT NULL,
    perm character varying(15) DEFAULT ''::character varying NOT NULL,
    path character varying(40) NOT NULL,
    pic character varying(25)
);


CREATE SEQUENCE public.menu_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_id_seq OWNED BY public.menu.id;

DROP TABLE if exists public.parse;
CREATE TABLE public.parse (
    keyword character varying(9) NOT NULL,
    "keywordDESC" character varying NOT NULL,
    "parameterName" character varying(7) NOT NULL
);



DROP TABLE if exists public.user_role;
CREATE TABLE public.user_role (
    user_id integer NOT NULL,
    role_id smallint NOT NULL
);



DROP TABLE if exists public.role;
CREATE TABLE public.role (
    id smallint NOT NULL,
    name character varying(9) NOT NULL,
    remark character varying(25)
);


CREATE SEQUENCE public.role_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;

DROP TABLE if exists public."user";
CREATE TABLE public."user" (
    id integer NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    updated timestamp without time zone DEFAULT now() NOT NULL,
    account character varying(10) NOT NULL,
    pwd character varying(50) NOT NULL,
    name character varying(15) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    phone character varying(12),
    photo character varying(50),
    logged timestamp without time zone
);

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;



ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);



ALTER TABLE ONLY public.menu ALTER COLUMN id SET DEFAULT nextval('public.menu_id_seq'::regclass);


ALTER TABLE ONLY public."query-result-cache" ALTER COLUMN id SET DEFAULT nextval('public."query-result-cache_id_seq"'::regclass);


ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);

INSERT INTO public.admin (id,name,label,created) VALUES (1,'萌新','第一次报道','2020-09-23 02:32:18.711136'),
(2,'新人','来逛逛','2020-09-23 02:32:29.142567'),
(3,'老板','打赏','2020-09-23 02:32:40.422285'),
(4,'商人','寻求商机','2020-09-23 02:32:46.201144');

--
-- Dumping data for table menu
--

INSERT INTO public.menu (id,pid,name,perm,path,pic,type,weight) VALUES (1,0,'查权限','','GET/role/perm',NULL,1,99),
(2,0,'删用户','','DELETE/user/',NULL,1,99),
(3,0,'改用户','','PUT/user/',NULL,1,99),
(4,0,'查用户','','GET/user/',NULL,1,99),
(5,0,'页用户','','GET/user',NULL,1,99),
(6,0,'增菜单','','POST/menu',NULL,1,99),
(7,0,'删菜单','','DELETE/menu/',NULL,1,99),
(8,0,'改菜单','','PUT/menu/',NULL,1,99),
(9,0,'查菜单','','GET/menu/',NULL,1,99),
(10,0,'页菜单','','GET/menu',NULL,1,99),
(11,0,'增游客','','POST/admin',NULL,1,99),
(12,0,'删游客','','DELETE/admin/',NULL,1,99),
(13,0,'改游客','','PUT/admin/',NULL,1,99),
(14,0,'查游客','','GET/admin/',NULL,1,99),
(15,0,'页游客','','GET/admin',NULL,1,99),
(16,0,'增角色','','POST/role',NULL,1,99),
(17,0,'删角色','','DELETE/role/',NULL,1,99),
(18,0,'改角色','','PUT/role/',NULL,1,99),
(19,0,'查角色','','GET/role/',NULL,1,99),
(20,0,'页角色','','GET/role',NULL,1,99);

--
-- Dumping data for table role
--

INSERT INTO public.role (id,name,remark) VALUES (1,'admin','董事长'),
(2,'super','超级管理员'),
(3,'hook','委员'),
(4,'personnel','职员'),
(5,'manager','总经理'),
(6,'comptroll','审计主任'),
(7,'president','总裁'),
(8,'CEO','首席执行官'),
(9,'CTO','技术总督'),
(10,'CFO','财务总监'),
(11,'COO','运营总监'),
(12,'CIO','信息部长'),
(13,'CKO','知识部长'),
(14,'CPO','产品总督'),
(15,'CGO','游戏总督'),
(16,'CMO','市场营销官'),
(17,'CSO','问题提督'),
(18,'CXO','惊喜部长'),
(19,'CHO','人力资源提督');

--
-- Dumping data for table parse
--

INSERT INTO public.parse (keyword,"keywordDESC","parameterName") VALUES ('BLOOD','0=未知,1=A型,2=B型,3=O型,4=AB型','血型'),
('DD','0=as,1=ege,2=gdg,3=ffff','dd类型'),
('EDUCATION','0=未知,1=专科以下,2=专科,3=本科,4=硕士,5=博士','学历'),
('GENDER','0=未知,M=男性,F=女性','性别'),
('ID_TYPE','0=身份证,1=护照,2=军官证','证件类型'),
('LOGINLOG_','L=登录,Q=退出,P=重要行为','登录日志类型'),
('MARRIAGE','0=未知,1=已婚,2=未婚,3=离异,4=丧偶','婚姻情况'),
('NATIONALI','0=未知,1=汉族,2=满族,3=蒙古族,4=回族,5=藏族,6=壮族,7=苗族,8=维吾尔族,9=其他','民族'),
('POLITYFAC','0=未知,1=无党派人士,2=共产党员,9=民主党党员','政治面貌'),
('RELIGION','0=无宗教,1=佛教,2=道教,3=基督教,4=天主教,5=东正教,6=伊斯兰教,9=其他教','宗教'),
('STATUS','0=正常,S=失效,C=建档,N=新员工,E=过期,P=暂停,F=欠费,X=待清理','状态'),
('USER_TYPE','0=员工,C=客户,P=合作伙伴,T=临时用户','用户类型');

--
-- Dumping data for table user
--

INSERT INTO public."user" (id,created,updated,account,pwd,name,status,phone,photo,logged) VALUES (1,'2020-09-23 00:13:34.795000','2020-10-26 14:00:33.000000','admin','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','萌新',true,'12345678912','','2020-11-07 23:29:46'),
(2,'2020-09-23 00:15:05.662503','2020-09-23 00:15:05.662503','Asciphx','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','accp',true,NULL,NULL,NULL),
(3,'2020-09-23 00:15:15.705353','2020-09-23 00:15:15.705353','Asp.net','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','asp.net',true,NULL,NULL,NULL),
(4,'2020-09-23 00:15:30.421221','2020-09-23 00:15:30.421221','Jdk','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','jdk',true,NULL,NULL,NULL),
(5,'2020-09-23 00:15:51.080007','2020-09-23 00:15:51.080007','hook','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','hook',true,NULL,NULL,NULL),
(6,'2020-09-23 00:15:56.378298','2020-09-23 00:15:56.378298','accp','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','hooks',true,NULL,NULL,NULL);

--
-- Dumping data for table user_role
--

INSERT INTO public.user_role (user_id,role_id) VALUES (1,1),
(1,2),
(2,2),
(3,2),
(6,2),
(1,3),
(2,3),
(4,3),
(5,3),
(6,3),
(3,5),
(4,6),
(5,7),
(6,8);

--
-- Dumping data for table menu_role
--

INSERT INTO public.menu_role (menu_id,role_id) VALUES (1,1),
(1,2),
(1,3),
(1,6),
(2,2),
(3,2),
(3,4),
(4,2),
(4,3),
(4,4),
(5,2),
(5,3),
(5,5),
(6,2),
(6,3),
(7,2),
(8,2),
(8,4),
(9,2),
(9,3),
(9,4),
(10,2),
(10,3),
(10,5),
(11,3),
(11,5),
(12,5),
(13,4),
(13,5),
(14,2),
(14,3),
(14,4),
(14,5),
(15,2),
(15,3),
(15,5),
(16,2),
(16,3),
(17,2),
(18,2),
(18,4),
(19,2),
(19,3),
(19,4),
(20,2),
(20,3),
(20,5);