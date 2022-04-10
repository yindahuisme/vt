create databases vt;


-- 项目配置表
CREATE TABLE IF NOT EXISTS vt.`vt_settings`(
   `type` VARCHAR(32) NOT NULL,-- 配置所属类别
   `key` VARCHAR(32) NOT NULL,-- 配置项唯一id
   `value` VARCHAR(32) NOT NULL,-- 值
   PRIMARY KEY ( `key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 素材文件表
CREATE TABLE IF NOT EXISTS vt.`vt_met_file`(
   `type` VARCHAR(32) NOT NULL,-- 素材文件类型（视频，音频，图片）
   `key` VARCHAR(32) NOT NULL,-- 文件全名，例如test.mp4
   `duration_second` VARCHAR(32) NOT NULL,-- 时长（秒）,如果为图片，留空串
   `create_time` VARCHAR(32) NOT NULL,-- 创建时间，格式（yyyy-MM-dd hh:mm:ss）
   `met_list` VARCHAR(32) NOT NULL,-- 被哪些素材使用到，格式（met1,met2）
   PRIMARY KEY ( `key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 素材表
CREATE TABLE IF NOT EXISTS vt.`vt_met`(
   `type` VARCHAR(32) NOT NULL,-- 素材类型（视频，音频）
   `key` VARCHAR(32) NOT NULL,-- 素材名
   `duration_second` VARCHAR(32) NOT NULL,-- 时长（秒）
   `create_time` VARCHAR(32) NOT NULL,-- 创建时间，格式（yyyy-MM-dd hh:mm:ss）
   `pro_list` VARCHAR(32) NOT NULL,-- 被哪些项目使用到，格式（pro1,pro2）
   `met_file` VARCHAR(32) NOT NULL,-- 依赖的素材文件全名，例如test.mp4
   `met_file_sub_second` VARCHAR(32) NOT NULL,-- 从素材文件多少秒处开始截取
   `tags` VARCHAR(64) NOT NULL,-- 标签，格式(tag1,tag2)
   PRIMARY KEY ( `key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;








