--
-- PostgreSQL database dump
--
-- Dumped from database version 13.0
-- Dumped by pg_dump version 13.0

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

DROP TABLE if exists public.parse;
CREATE TABLE public.parse (
    keyword character varying(9) NOT NULL,
    "keywordDESC" character varying NOT NULL,
    "parameterName" character varying(7) NOT NULL
);


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

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);

INSERT INTO public.admin (id,name,label,created) VALUES (1,'萌新','第一次报道','2020-09-23 02:32:18.711136'),
(2,'新人','来逛逛','2020-09-23 02:32:29.142567'),
(3,'老板','打赏','2020-09-23 02:32:40.422285'),
(4,'商人','寻求商机','2020-09-23 02:32:46.201144');

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

INSERT INTO public."user" (id,created,updated,account,pwd,name,status,phone,photo,logged) VALUES (1,'2020-09-23 00:13:34.795000','2020-10-26 14:00:33.000000','admin','·\C]·DwÐ;âÚÐa"«m2mýP»:Òª¿Èÿ¯E¬ñl)ïúõ>','萌新',true,'12345678912','','2020-11-07 23:29:46');