create databases vt;


-- 项目配置表
drop table vt.`vt_setting`;
CREATE TABLE IF NOT EXISTS vt.`vt_setting`(
   `setting_key` VARCHAR(64) NOT NULL,-- 配置项唯一id
   `setting_value` VARCHAR(128) NOT NULL,-- 值
   PRIMARY KEY ( `setting_key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into vt.`vt_setting` values('vt_main_setting_metFilePath','C:\\Users\\Administrator\\Desktop\\pr_plugin\\vt_data');
insert into vt.`vt_setting` values('vt_main_setting_freePointMs','300');
insert into vt.`vt_setting` values('vt_main_setting_inPointHotKey','a');
insert into vt.`vt_setting` values('vt_main_setting_speedPointHotKey','s');
insert into vt.`vt_setting` values('vt_main_setting_outPointHotKey','d');
insert into vt.`vt_setting` values('vt_main_setting_transformEffectMs','300');
insert into vt.`vt_setting` values('vt_main_setting_transformEffectOptions','淡入,瞬切');
insert into vt.`vt_setting` values('vt_main_setting_transformEffectValue','瞬切');
insert into vt.`vt_setting` values('vt_main_setting_mogrtPath','C:\\Users\\Administrator\\Desktop\\pr_plugin\\vt_mogrt');

-- 素材文件表
drop table vt.`vt_met_file`;
CREATE TABLE IF NOT EXISTS vt.`vt_met_file`(
   `met_file_id` INTEGER AUTO_INCREMENT,-- 素材文件id
   `met_file_type` VARCHAR(32) NOT NULL,-- 素材文件类型（视频，音频，图片）
   `met_file_full_path` VARCHAR(256) NOT NULL,-- 文件全名，例如D:\test.mp4
   `duration_second` VARCHAR(32) NOT NULL,-- 时长（秒）,如果为图片，留空串
   `create_time` VARCHAR(32) NOT NULL,-- 创建时间，格式（yyyy-MM-dd hh:mm:ss）
   `tags` VARCHAR(256) NOT NULL,-- 标签，格式(tag1,tag2)
   PRIMARY KEY ( `met_file_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 素材表
drop table vt.`vt_met`;
CREATE TABLE IF NOT EXISTS vt.`vt_met`(
   `met_id` INTEGER AUTO_INCREMENT,-- 素材id
   `met_type` VARCHAR(32) NOT NULL,-- 素材类型（视频，音频）
   `duration_second` VARCHAR(32) NOT NULL,-- 时长（秒）
   `create_time` VARCHAR(32) NOT NULL,-- 创建时间，格式（yyyy-MM-dd hh:mm:ss）
   `met_file_id` INTEGER NOT NULL,-- 依赖的素材文件id
   `point_info` VARCHAR(256) NOT NULL,-- 点位信息
   `tags` VARCHAR(64) NOT NULL,-- 标签，格式(tag1,tag2)
   PRIMARY KEY ( `met_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 素材文件搜索预设表
drop table vt.`vt_met_file_sql`;
CREATE TABLE IF NOT EXISTS vt.`vt_met_file_sql`(
   `sql_name` VARCHAR(64) NOT NULL,-- 配置项名
   `sql_value` VARCHAR(4096) NOT NULL,-- 具体素材文件，素材的筛选sql，sql只能返回素材文件名，素材名两个字段
   PRIMARY KEY ( `sql_name` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into vt.`vt_met_file_sql` values('默认','select met_file_type as type,\n met_file_full_path as metFileName, \n duration_second as durationSecond \n from vt.vt_met_file \n order by create_time asc');

-- 项目表
drop table vt.`vt_project`;
CREATE TABLE IF NOT EXISTS vt.`vt_project`(
   `pro_name` VARCHAR(32) NOT NULL,-- 项目名
   `track_type` VARCHAR(32) NOT NULL,-- 轨道类型（主，副）
   `track_id` VARCHAR(32) NOT NULL,-- 轨道id,格式（v1）
   `met_id` INTEGER NOT NULL,-- 素材id
   `in_point` VARCHAR(32) NOT NULL,-- 入点，秒
   PRIMARY KEY ( `pro_name` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
