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
   `key` VARCHAR(32) NOT NULL,-- 素材名，统一met前缀
   `duration_second` VARCHAR(32) NOT NULL,-- 时长（秒）
   `create_time` VARCHAR(32) NOT NULL,-- 创建时间，格式（yyyy-MM-dd hh:mm:ss）
   `pro_list` VARCHAR(32) NOT NULL,-- 被哪些项目使用到，格式（pro1,pro2）
   `met_file` VARCHAR(32) NOT NULL,-- 依赖的素材文件全名，例如test.mp4
   `point_info` VARCHAR(32) NOT NULL,-- 点位信息，秒，至少包含入点，出点
   `tags` VARCHAR(64) NOT NULL,-- 标签，格式(tag1,tag2)
   PRIMARY KEY ( `key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 素材文件搜索预设表
CREATE TABLE IF NOT EXISTS vt.`vt_met_file_sql`(
   `key` VARCHAR(32) NOT NULL,-- 配置项名
   `value` VARCHAR(32) NOT NULL,-- 具体素材文件，素材的筛选sql，sql只能返回素材文件名，素材名两个字段
   PRIMARY KEY ( `key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 项目表
CREATE TABLE IF NOT EXISTS vt.`vt_project`(
   `key` VARCHAR(32) NOT NULL,-- 项目名
   `track_type` VARCHAR(32) NOT NULL,-- 轨道类型,包含（主轨道，音频轨道，视频轨道，调整轨道，字幕轨道）
   `track_id` VARCHAR(32) NOT NULL,-- 轨道id,格式（视频1）
   `met_id` VARCHAR(32) NOT NULL,-- 素材id,可以是素材名，mogrt（mogrt前缀）或调整图层（adjust前缀）
   `in_point` VARCHAR(32) NOT NULL,-- 入点，秒
   `out_point` VARCHAR(32) NOT NULL,-- 出点，秒
   PRIMARY KEY ( `key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 调整图层元数据表
CREATE TABLE IF NOT EXISTS vt.`vt_adjust_layer`(
   `key` VARCHAR(32) NOT NULL,-- 调整图层名
   `tags` VARCHAR(64) NOT NULL,-- 标签，格式(tag1,tag2)
   PRIMARY KEY ( `key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 动态图形模板(mogrt)元数据表
CREATE TABLE IF NOT EXISTS vt.`vt_mogrt`(
   `key` VARCHAR(32) NOT NULL,-- mogrt名
   `text` VARCHAR(128) NOT NULL,-- 源文本
   `tags` VARCHAR(64) NOT NULL,-- 标签，格式(tag1,tag2)
   PRIMARY KEY ( `key` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
