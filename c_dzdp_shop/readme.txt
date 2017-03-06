规律分析：2017-02-18

注意：国外与港澳台不符合以下规律

--分类导航--
页面地址：http://www.dianping.com/shopall/1/0
地址规则：http://www.dianping.com/shopall/{地区编号}/0
地区编号规则：1-上海 2-北京 ...

页面分析
频道：二位代码 如美食10 购物20 ...特殊的是0在搜索页中表示生活服务或首页，即所有频道（或所有频道的父类）
频道分三级，从属关系：
  channel 一级频道 是美食、购物大类，二位代码如10
  type 二级频道 是子分类，代码以g开头，如g132是美食下的咖啡厅
  三级频道 是品牌，以g开头，如g24645是美食-->咖啡厅-->星巴克 注意品牌这级可能为空

位置：以r开头 ，如卢湾区为r0
位置分二级，从属关系：
  一级位置 以r开头 卢湾区为r0 注意 仅崇明县以c开头  逻辑上分类为：商区 行政区 地铁线 大学周边
  二级位置 r开头 逻辑上分类：某某路/区/县/镇 地标 大学 注意地铁站以u开头


--搜索列表--
搜索页：http://www.dianping.com/search/category/{地区编号}/{一级频道}/[^g{二级频道/三级频道}][^r{一级位置/二级位置}][^u{地铁站}]


--实体描述--
shop：商户
channel：频道
type:分类
branch:品牌

--实体关系分析--
一个type可以属于多个channel，如咖啡厅 美食休闲 娱乐
一个branch只属于一个type
一个shop有多个type,如中经堂，即是中医养生，又是足疗保健
一个shop只有一个branch 如星巴克
一个shop可以属于多个channel 如星巴克会出现在 美食 休闲娱乐 结婚 三个频道

--遗留--
以上分类页面结构不同，暂不处理
'http://www.dianping.com/search/category/1/55/g6844'
'http://www.dianping.com/search/category/1/70/g33792'
'http://www.dianping.com/search/category/1/90/g25475'
'http://www.dianping.com/search/category/1/40/g33818'

耗时预估
地点基数:1000
总用时=(分类数量(含子分类)*1000)+商铺数量

分类里没取cityCode
爬codeCode
商圈、行政区、地标之间关系没分析好