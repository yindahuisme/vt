create databases vt;


-- 项目配置表
drop table if exists vt.`vt_setting`;
CREATE TABLE IF NOT EXISTS vt.`vt_setting`(
   `setting_key` VARCHAR(64) NOT NULL,-- 配置项唯一id
   `setting_value` VARCHAR(128) NOT NULL,-- 值
   PRIMARY KEY ( `setting_key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into vt.`vt_setting` values('settingMatFilePath','D:\\vt_data\\matFilePath\\');
insert into vt.`vt_setting` values('settingFreePointSecond','300');
insert into vt.`vt_setting` values('settingInPointHotKey','a');
insert into vt.`vt_setting` values('settingOutPointHotKey','d');
insert into vt.`vt_setting` values('settingPointHotKey','f');
insert into vt.`vt_setting` values('settingTransformEffectMs','300');
insert into vt.`vt_setting` values('settingTransformEffectOptions','淡入,瞬切');
insert into vt.`vt_setting` values('settingTransformEffectValue','瞬切');
insert into vt.`vt_setting` values('settingMogrtPath','D:\\vt_data\\mogrtPath\\');

-- 素材文件表
drop table if exists vt.`vt_matfile`;
CREATE TABLE IF NOT EXISTS vt.`vt_matfile`(
   `matfile_id` INTEGER AUTO_INCREMENT,-- 素材文件id
   `matfile_type` VARCHAR(32) NOT NULL,-- 素材文件类型（视频，音频，图片）
   `matfile_full_path` VARCHAR(256) NOT NULL,-- 文件全名，例如D:\test.mp4
   `duration_second` VARCHAR(32) NOT NULL,-- 时长（秒）,如果为图片，留空串
   `size_kb` integer NOT NULL,-- 大小（kb）,如235343
   `create_time` VARCHAR(32) NOT NULL,-- 创建时间，格式（yyyy-MM-dd hh:mm:ss）
   `tags` VARCHAR(256) NOT NULL,-- 标签，格式(tag1,tag2)
   PRIMARY KEY ( `matfile_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 素材表
drop table if exists vt.`vt_mat`;
CREATE TABLE IF NOT EXISTS vt.`vt_mat`(
   `mat_id` INTEGER AUTO_INCREMENT,-- 素材id
   `mat_type` VARCHAR(32) NOT NULL,-- 素材类型（视频，音频）
   `duration_second` VARCHAR(32) NOT NULL,-- 时长（秒）
   `create_time` VARCHAR(32) NOT NULL,-- 创建时间，格式（yyyy-MM-dd hh:mm:ss）
   `matfile_id` INTEGER NOT NULL,-- 依赖的素材文件id
   `point_info` VARCHAR(256) NOT NULL,-- 点位信息，格式(2.654,7.543)
   `tags` VARCHAR(64) NOT NULL,-- 标签，格式(tag1,tag2)
   PRIMARY KEY ( `mat_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 素材文件搜索预设表
drop table if exists vt.`vt_matfile_sql`;
CREATE TABLE IF NOT EXISTS vt.`vt_matfile_sql`(
   `sql_name` VARCHAR(64) NOT NULL,-- 配置项名
   `sql_value` VARCHAR(4096) NOT NULL,-- 具体素材文件，素材的筛选sql，sql只能返回素材文件名，素材名两个字段
   PRIMARY KEY ( `sql_name` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into vt.`vt_matfile_sql` values('默认','select matfile_id as id,\nmatfile_type as type,\nSUBSTRING_INDEX(matfile_full_path,"\\\\",-1) as matFileName, \nduration_second as durationSecond \nfrom vt.vt_matfile \norder by create_time asc');

-- 项目表
drop table if exists vt.`vt_project`;
CREATE TABLE IF NOT EXISTS vt.`vt_project`(
   `pro_name` VARCHAR(32) NOT NULL,-- 项目名
   `track_name` VARCHAR(32) NOT NULL,-- 轨道名,格式（视频 1）
   `mat_id` INTEGER NOT NULL,-- 素材id
   `out_point_time` VARCHAR(32) NOT NULL,-- 出点时间，秒
   `dep` VARCHAR(64) NOT NULL,-- 依赖,格式(视频 1#34.346),没有留空串
   PRIMARY KEY ( `pro_name` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
